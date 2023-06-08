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
  try {
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    const body = {
      summary: "Next Right Thing",
      // TODO: should this have a timezone?
    };
    const createdCalendar = await calendar.calendars.insert({
      requestBody: body,
    });
    const calendarId = createdCalendar.data.id;

    return new Response(JSON.stringify({ calendarId }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
  return new Response("Hello world");
}
