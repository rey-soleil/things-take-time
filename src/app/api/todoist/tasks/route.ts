import { authOptions } from "lib/auth";
import { getServerSession } from "next-auth";

const TODOIST_API_BASE = "https://api.todoist.com/api/v1";

function getTodoistToken(session: any) {
  return (
    session?.user?.todoistAPIToken ||
    process.env.TODOIST_API_TOKEN ||
    process.env.NEXT_PUBLIC_TODOIST_API_TOKEN
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const token = getTodoistToken(session);
  if (!token) {
    return new Response(JSON.stringify({ error: "Todoist is not configured" }), {
      status: 503,
    });
  }

  try {
    const response = await fetch(
      `${TODOIST_API_BASE}/tasks/filter?query=${encodeURIComponent("today")}&limit=200`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error("Todoist task fetch failed", response.status, detail);
      return new Response(
        JSON.stringify({ error: "Failed to load Todoist tasks" }),
        { status: response.status }
      );
    }

    const data = await response.json();
    const tasks = Array.isArray(data) ? data : data.results ?? [];
    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (error) {
    console.error("Todoist task fetch failed", error);
    return new Response(JSON.stringify({ error: "Failed to load Todoist tasks" }), {
      status: 500,
    });
  }
}
