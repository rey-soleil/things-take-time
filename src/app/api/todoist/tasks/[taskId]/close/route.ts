import { authOptions } from "lib/auth";
import { getServerSession } from "next-auth";

const TODOIST_API_BASE = "https://api.todoist.com/api/v1";

function getTodoistToken() {
  return process.env.TODOIST_API_TOKEN || process.env.NEXT_PUBLIC_TODOIST_API_TOKEN;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const token = getTodoistToken();
  if (!token) {
    return new Response(JSON.stringify({ error: "Todoist is not configured" }), {
      status: 503,
    });
  }

  const { taskId } = await params;

  try {
    const response = await fetch(
      `${TODOIST_API_BASE}/tasks/${encodeURIComponent(taskId)}/close`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error("Todoist task close failed", response.status, detail);
      return new Response(
        JSON.stringify({ error: "Failed to close Todoist task" }),
        { status: response.status }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Todoist task close failed", error);
    return new Response(JSON.stringify({ error: "Failed to close Todoist task" }), {
      status: 500,
    });
  }
}
