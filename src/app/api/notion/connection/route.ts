import { authOptions } from "lib/auth";
import {
  getNotionConnection,
  removeNotionConnection,
  saveNotionConnection,
} from "lib/notion-credentials";
import { NotionError, resolveNotionDataSource } from "lib/notion";
import { notionErrorResponse, requireSameOrigin } from "lib/notion-route";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    requireSameOrigin(request);
    const body = await request.json();
    if (
      !body ||
      typeof body.database !== "string" ||
      body.database.length > 2048 ||
      (body.token !== undefined &&
        (typeof body.token !== "string" || body.token.length > 4096))
    ) {
      throw new NotionError(
        "Enter your Notion token and Tasks database link.",
        400
      );
    }
    const token =
      body.token?.trim() ||
      (await getNotionConnection(session.user.email))?.token;
    if (!token)
      throw new NotionError("Enter your Notion connection token.", 400);
    const dataSourceId = await resolveNotionDataSource(token, body.database);
    await saveNotionConnection(session.user.email, { token, dataSourceId });
    return Response.json({ configured: true, dataSourceId });
  } catch (error) {
    return notionErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    requireSameOrigin(request);
    await removeNotionConnection(session.user.email);
    return new Response(null, { status: 204 });
  } catch (error) {
    return notionErrorResponse(error);
  }
}
