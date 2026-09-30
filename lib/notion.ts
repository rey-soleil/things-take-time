import type { Task } from "../utils/tasks";

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2025-09-03";

export class NotionError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
  }
}

type Property = {
  type?: string;
  title?: Array<{ plain_text?: string; text?: { content: string } }>;
  date?: { start: string } | null;
  checkbox?: boolean;
  number?: number | null;
};

type DataSource = {
  id: string;
  properties: Record<string, Property>;
};

export type NotionPage = {
  id: string;
  url?: string;
  archived?: boolean;
  in_trash?: boolean;
  parent?: { data_source_id?: string };
  properties: Record<string, Property>;
};

export type NotionConnection = { token: string; dataSourceId: string };

export function parseNotionId(value: string) {
  let candidate = value.trim();
  if (candidate.startsWith("collection://")) {
    candidate = candidate.slice("collection://".length);
  } else if (candidate.startsWith("https://")) {
    const url = new URL(candidate);
    if (!/(^|\.)notion\.(so|com|site)$/.test(url.hostname)) {
      throw new NotionError(
        "Use a Notion database link or data source ID.",
        400
      );
    }
    candidate = url.pathname.split("/").filter(Boolean).pop() ?? "";
  }
  const match = candidate.match(
    /(?:^|-)([a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i
  );
  if (!match)
    throw new NotionError("Use a Notion database link or data source ID.", 400);
  const id = match[1].replaceAll("-", "").toLowerCase();
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(
    16,
    20
  )}-${id.slice(20)}`;
}

async function notionRequest<T>(
  token: string,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${NOTION_API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new NotionError("Notion could not be reached. Please try again.");
  }
  if (!response.ok) {
    const message =
      response.status === 401
        ? "Your Notion token is no longer valid. Reconnect Notion."
        : response.status === 403 || response.status === 404
        ? "Give your Notion connection access to the Tasks database and permission to read and update its pages."
        : response.status === 429
        ? "Notion is busy. Please try again in a moment."
        : "Notion could not process this request. Check the Tasks database fields and try again.";
    throw new NotionError(message, response.status);
  }
  return response.json();
}

function isTasksSchema(dataSource: DataSource) {
  return (
    dataSource.properties?.Name?.type === "title" &&
    dataSource.properties?.["Completed on?"]?.type === "date"
  );
}

export async function resolveNotionDataSource(token: string, database: string) {
  const id = parseNotionId(database);
  let sources: Array<{ id: string }>;
  try {
    const result = await notionRequest<{ data_sources: Array<{ id: string }> }>(
      token,
      `/databases/${id}`
    );
    sources = result.data_sources ?? [];
  } catch (error) {
    if (!(error instanceof NotionError) || error.status !== 404) throw error;
    const source = await notionRequest<DataSource>(
      token,
      `/data_sources/${id}`
    );
    if (!isTasksSchema(source)) {
      throw new NotionError(
        'Choose the Tasks database with "Name" and "Completed on?" fields.',
        400
      );
    }
    return source.id;
  }
  const matching: string[] = [];
  for (const source of sources) {
    const detail = await notionRequest<DataSource>(
      token,
      `/data_sources/${source.id}`
    );
    if (isTasksSchema(detail)) matching.push(detail.id);
  }
  if (matching.length !== 1) {
    throw new NotionError(
      matching.length
        ? "This database has more than one Tasks data source. Paste the specific data source ID."
        : 'Choose the Tasks database with "Name" and "Completed on?" fields.',
      400
    );
  }
  return matching[0];
}

export function notionPageToTask(page: NotionPage): Task | null {
  if (page.archived || page.in_trash || page.properties["Completed on?"]?.date)
    return null;
  const content = (page.properties.Name?.title ?? [])
    .map((part) => part.plain_text ?? part.text?.content ?? "")
    .join("");
  if (!content.trim()) return null;
  const due = page.properties["Needs to be completed by"]?.date?.start;
  return {
    id: page.id,
    source: "notion",
    content,
    url: page.url,
    active: page.properties["Active?"]?.checkbox ?? false,
    estimatedMinutes: page.properties["Number of minutes (estimated)"]?.number,
    due: due ? { date: due, is_recurring: false, string: due } : null,
  };
}

export async function listNotionTasks(
  connection: NotionConnection
): Promise<Task[]> {
  const tasks: Task[] = [];
  let cursor: string | undefined;
  const visited = new Set<string>();
  do {
    const page = await notionRequest<{
      results: NotionPage[];
      has_more: boolean;
      next_cursor: string | null;
    }>(connection.token, `/data_sources/${connection.dataSourceId}/query`, {
      method: "POST",
      body: JSON.stringify({
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
        filter: { property: "Completed on?", date: { is_empty: true } },
        sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
      }),
    });
    for (const row of page.results) {
      const task = notionPageToTask(row);
      if (task) tasks.push(task);
    }
    if (!page.has_more) break;
    if (!page.next_cursor || visited.has(page.next_cursor)) {
      throw new NotionError(
        "Notion could not load the full task list. Please refresh."
      );
    }
    cursor = page.next_cursor;
    visited.add(cursor);
    // Stay within Notion's average request limit while following pagination.
    await new Promise((resolve) => setTimeout(resolve, 350));
  } while (cursor);
  return tasks;
}

export async function completeNotionTask(
  connection: NotionConnection,
  pageId: string
) {
  const id = parseNotionId(pageId);
  const page = await notionRequest<NotionPage>(
    connection.token,
    `/pages/${id}`
  );
  if (
    !page.parent?.data_source_id ||
    parseNotionId(page.parent.data_source_id) !==
      parseNotionId(connection.dataSourceId)
  ) {
    throw new NotionError(
      "This task is not in your connected Tasks database.",
      403
    );
  }
  if (page.archived || page.in_trash)
    throw new NotionError("This Notion task has been archived.", 409);
  if (page.properties["Completed on?"]?.date) return;
  await notionRequest(connection.token, `/pages/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      properties: {
        "Completed on?": { date: { start: new Date().toISOString() } },
      },
    }),
  });
}
