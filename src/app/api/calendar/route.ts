const { google } = require("googleapis");
const { OAuth2 } = google.auth;

// Authenticate with Google Calendar API using OAuth 2.0
const oAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

/*
 * Create a new Google Calendar and return its calendarId
 */
export async function POST(request: Request) {
  const body = await request.json();
  const email = body.email;

  try {
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    const body = {
      summary: `Next Right Thing (${email})`,
      // TODO: should this have a timezone?
    };
    const createdCalendar = await calendar.calendars.insert({
      requestBody: body,
    });
    const calendarId = createdCalendar.data.id;

    const rule = {
      scope: {
        type: "user",
        value: email,
      },
      role: "owner",
    };

    await calendar.acl.insert({
      calendarId,
      requestBody: rule,
    });

    return new Response(JSON.stringify({ calendarId }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
  return new Response("Hello world");
}
