import { authOptions } from "lib/auth";
import { getNotionConnection } from "lib/notion-credentials";
import { completeNotionTask, NotionError } from "lib/notion";
import { notionErrorResponse, requireSameOrigin } from "lib/notion-route";
import { getServerSession } from "next-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    requireSameOrigin(request);
    const connection = await getNotionConnection(session.user.email);
    if (!connection)
      throw new NotionError("Connect Notion to complete this task.", 503);
    await completeNotionTask(connection, (await params).taskId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return notionErrorResponse(error);
  }
}
