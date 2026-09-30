const assert = require("node:assert/strict");
const { test, afterEach } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

// Run focused TypeScript modules with Node's test runner, without another test dependency.
require.extensions[".ts"] = (module, filename) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  module._compile(compiled.outputText, filename);
};
const {
  parseNotionId,
  notionPageToTask,
  listNotionTasks,
  completeNotionTask,
  resolveNotionDataSource,
} = require("../lib/notion.ts");
const { requireSameOrigin } = require("../lib/notion-route.ts");
const { taskKey } = require("../utils/tasks.ts");

const sourceId = "11111111-1111-4111-8111-111111111111";
const pageId = "22222222-2222-4222-8222-222222222222";
const connection = { token: "test-token", dataSourceId: sourceId };
const realFetch = global.fetch;
afterEach(() => {
  global.fetch = realFetch;
});
function page(overrides = {}) {
  return {
    id: pageId,
    url: `https://www.notion.so/${pageId}`,
    parent: { data_source_id: sourceId },
    properties: {
      Name: {
        title: [{ plain_text: "Read 📖" }, { plain_text: " and reflect" }],
      },
      "Completed on?": { date: null },
      "Active?": { checkbox: true },
      "Needs to be completed by": { date: { start: "2026-10-05" } },
      "Number of minutes (estimated)": { number: 25 },
    },
    ...overrides,
  };
}
function mockFetch(responses) {
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({
      url,
      ...options,
      body: options.body ? JSON.parse(options.body) : undefined,
    });
    const response = responses.shift();
    assert.ok(response, "Unexpected extra request");
    return Response.json(response.body ?? response, {
      status: response.status ?? 200,
    });
  };
  return calls;
}

test("accepts database links and source IDs without confusing a view ID for a database", () => {
  assert.equal(
    parseNotionId(
      `https://www.notion.so/tasks-${sourceId.replaceAll("-", "")}?v=${pageId}`
    ),
    sourceId
  );
  assert.equal(parseNotionId(`collection://${sourceId}`), sourceId);
  assert.equal(
    parseNotionId(`https://app.notion.com/p/${sourceId.replaceAll("-", "")}`),
    sourceId
  );
  assert.throws(() => parseNotionId(`https://example.com/${sourceId}`));
  assert.throws(() => parseNotionId("not-an-id"));
});

test("preserves the exact title, origin, deadline, estimate and active state", () => {
  const task = notionPageToTask(page());
  assert.equal(task.content, "Read 📖 and reflect");
  assert.equal(task.source, "notion");
  assert.equal(task.active, true);
  assert.equal(task.estimatedMinutes, 25);
  assert.equal(task.due.date, "2026-10-05");
  assert.equal(task.due.is_recurring, false);
});

test("keeps inactive/undated tasks and excludes completed, archived and blank tasks", () => {
  const row = page();
  delete row.properties["Needs to be completed by"];
  row.properties["Active?"].checkbox = false;
  assert.equal(notionPageToTask(row).active, false);
  assert.equal(notionPageToTask(row).due, null);
  assert.equal(notionPageToTask(page({ archived: true })), null);
  assert.equal(notionPageToTask(page({ in_trash: true })), null);
  row.properties["Completed on?"].date = { start: "2026-09-30" };
  assert.equal(notionPageToTask(row), null);
  assert.equal(
    notionPageToTask(page({ properties: { Name: { title: [] } } })),
    null
  );
});

test("follows pagination and sends an unfinished-only filter with server credentials", async () => {
  const calls = mockFetch([
    { results: [page()], has_more: true, next_cursor: "next-page" },
    {
      results: [page({ id: sourceId }), page({ archived: true })],
      has_more: false,
      next_cursor: null,
    },
  ]);
  const tasks = await listNotionTasks(connection);
  assert.equal(tasks.length, 2);
  assert.equal(
    calls[0].url,
    `https://api.notion.com/v1/data_sources/${sourceId}/query`
  );
  assert.deepEqual(calls[0].body.filter, {
    property: "Completed on?",
    date: { is_empty: true },
  });
  assert.equal(calls[0].headers.Authorization, "Bearer test-token");
  assert.equal(calls[1].body.start_cursor, "next-page");
  assert.equal(JSON.stringify(tasks).includes("test-token"), false);
});

test("surfaces upstream failures without leaking upstream content or a partial list", async () => {
  mockFetch([{ status: 401, body: { message: "secret upstream details" } }]);
  await assert.rejects(
    listNotionTasks(connection),
    (error) => error.status === 401 && !error.message.includes("secret")
  );
  mockFetch([{ results: [page()], has_more: true, next_cursor: null }]);
  await assert.rejects(listNotionTasks(connection), /full task list/);
});

test("resolves a database only when exactly one data source has the expected schema", async () => {
  mockFetch([
    { data_sources: [{ id: sourceId }] },
    {
      id: sourceId,
      properties: {
        Name: { type: "title" },
        "Completed on?": { type: "date" },
      },
    },
  ]);
  assert.equal(await resolveNotionDataSource("test-token", sourceId), sourceId);
  mockFetch([
    { data_sources: [{ id: sourceId }] },
    {
      id: sourceId,
      properties: { Name: { type: "title" }, Status: { type: "status" } },
    },
  ]);
  await assert.rejects(
    resolveNotionDataSource("test-token", sourceId),
    /Completed on/
  );
});

test("accepts a data source ID directly when it is not a database ID", async () => {
  mockFetch([
    { status: 404, body: {} },
    {
      id: sourceId,
      properties: {
        Name: { type: "title" },
        "Completed on?": { type: "date" },
      },
    },
  ]);
  assert.equal(await resolveNotionDataSource("test-token", sourceId), sourceId);
});

test("completion verifies database membership and updates only Completed on?", async () => {
  const calls = mockFetch([page(), page()]);
  await completeNotionTask(connection, pageId);
  assert.equal(calls[1].method, "PATCH");
  assert.deepEqual(Object.keys(calls[1].body), ["properties"]);
  assert.deepEqual(Object.keys(calls[1].body.properties), ["Completed on?"]);
  assert.ok(
    Number.isFinite(
      Date.parse(calls[1].body.properties["Completed on?"].date.start)
    )
  );
});

test("refuses cross-database and archived completion without sending a mutation", async () => {
  let calls = mockFetch([page({ parent: { data_source_id: pageId } })]);
  await assert.rejects(
    completeNotionTask(connection, pageId),
    (error) => error.status === 403
  );
  assert.equal(calls.length, 1);
  calls = mockFetch([page({ archived: true })]);
  await assert.rejects(
    completeNotionTask(connection, pageId),
    (error) => error.status === 409
  );
  assert.equal(calls.length, 1);
});

test("retrying an already completed task preserves the original completion date", async () => {
  const row = page();
  row.properties["Completed on?"].date = { start: "2026-09-01" };
  const calls = mockFetch([row]);
  await completeNotionTask(connection, pageId);
  assert.equal(calls.length, 1);
});

test("same-origin writes and provider-specific task identity", () => {
  requireSameOrigin(
    new Request("https://ttt.example/api/notion/connection", {
      headers: { origin: "https://ttt.example" },
    })
  );
  assert.throws(() =>
    requireSameOrigin(
      new Request("https://ttt.example/api/notion/connection", {
        headers: { origin: "https://other.example" },
      })
    )
  );
  assert.throws(() =>
    requireSameOrigin(new Request("https://ttt.example/api/notion/connection"))
  );
  assert.notEqual(
    taskKey({ id: pageId, source: "notion", content: "same" }),
    taskKey({ id: pageId, source: "todoist", content: "same" })
  );
});

test("completion routes each task to its original provider and never completes manual entries", async () => {
  const Module = require("node:module");
  const originalLoad = Module._load;
  let closeTaskInSource;
  try {
    Module._load = function (id, ...args) {
      if (id === "utils/tasks") return require("../utils/tasks.ts");
      if (id === "./toast") return {};
      return originalLoad.call(this, id, ...args);
    };
    ({ closeTaskInSource } = require("../utils/task-logging.ts"));
  } finally {
    Module._load = originalLoad;
  }
  const calls = mockFetch([{}, {}, {}]);
  const session = { user: { email: "test@example.com" } };
  await closeTaskInSource(session, {
    source: "notion",
    id: pageId,
    content: "Task",
  });
  await closeTaskInSource(session, {
    source: "todoist",
    id: "123",
    content: "Task",
  });
  await closeTaskInSource(session, { id: "legacy", content: "Task" });
  assert.equal(closeTaskInSource(session, { content: "Manual" }), null);
  assert.equal(closeTaskInSource(null, { id: pageId, content: "Task" }), null);
  assert.deepEqual(
    calls.map((call) => call.url),
    [
      `/api/notion/tasks/${pageId}/close`,
      "/api/todoist/tasks/123/close",
      "/api/todoist/tasks/legacy/close",
    ]
  );
  mockFetch([{ status: 403, body: { error: "Notion access was revoked" } }]);
  await assert.rejects(
    closeTaskInSource(session, {
      source: "notion",
      id: pageId,
      content: "Task",
    }),
    /access was revoked/
  );
});

test("Notion routes reject signed-out requests before accessing credentials or Notion", async () => {
  const Module = require("node:module");
  const originalLoad = Module._load;
  let routes;
  try {
    Module._load = function (id, ...args) {
      if (id === "lib/auth") return { authOptions: {} };
      if (id === "next-auth") return { getServerSession: async () => null };
      if (id === "lib/notion-credentials")
        return new Proxy(
          {},
          {
            get() {
              throw new Error("Credentials accessed before authentication");
            },
          }
        );
      if (id === "lib/notion") return require("../lib/notion.ts");
      if (id === "lib/notion-route") return require("../lib/notion-route.ts");
      return originalLoad.call(this, id, ...args);
    };
    routes = [
      require("../src/app/api/notion/tasks/route.ts").GET,
      require("../src/app/api/notion/tasks/[taskId]/close/route.ts").POST,
      require("../src/app/api/notion/connection/route.ts").POST,
      require("../src/app/api/notion/connection/route.ts").DELETE,
    ];
  } finally {
    Module._load = originalLoad;
  }
  const calls = mockFetch([]);
  for (const handler of routes) {
    assert.equal(
      (
        await handler(new Request("https://ttt.example/api/notion/tasks"), {
          params: Promise.resolve({ taskId: pageId }),
        })
      ).status,
      401
    );
  }
  assert.equal(calls.length, 0);
});
