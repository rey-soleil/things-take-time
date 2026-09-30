import { authOptions } from "lib/auth";
import { getNotionConnection } from "lib/notion-credentials";
import { listNotionTasks } from "lib/notion";
import { notionErrorResponse } from "lib/notion-route";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const connection = await getNotionConnection(session.user.email);
    const tasks = connection ? await listNotionTasks(connection) : [];
    return Response.json(
      {
        tasks,
        configured: Boolean(connection),
        dataSourceId: connection?.dataSourceId,
      },
      {
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  } catch (error) {
    return notionErrorResponse(error);
  }
}
