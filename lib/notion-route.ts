import { NotionError } from "./notion";

export function requireSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    throw new NotionError("Request origin is not allowed.", 403);
  }
}

export function notionErrorResponse(error: unknown) {
  return Response.json(
    {
      error:
        error instanceof NotionError
          ? error.message
          : "The Notion connection could not be used. Please try again.",
    },
    {
      status: error instanceof NotionError ? error.status : 500,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
