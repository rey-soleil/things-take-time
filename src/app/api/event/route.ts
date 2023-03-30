const { google } = require("googleapis");
const { OAuth2 } = google.auth;

export async function POST(request: Request) {
  const body = await request.json();

  const oAuth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  console.log({ oAuth2Client });

  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  console.log({ oAuth2Client, calendar });

  const event = {
    summary: body.eventName,
    description: "made with next-right-thing",
    start: {
      dateTime: new Date(body.startTime),
    },
    end: {
      dateTime: new Date(),
    },
    // This color is green
    // See https://lukeboyle.com/blog/posts/google-calendar-api-color-id
    colorId: body.colorId,
  };

  console.log({ event });

  const calendarResponse = await calendar.events.insert({
    calendarId: process.env.PERSONAL_CALENDAR_ID,
    resource: event,
  });

  console.log({ calendarResponse });

  return new Response(JSON.stringify(calendarResponse));
}
