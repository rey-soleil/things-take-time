const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

export async function POST(request: Request) {
  const body = await request.json();
  const { eventName, startTime } = body;

  const event = {
    summary: eventName,
    description: "made with next-right-thing",
    start: {
      dateTime: new Date(startTime),
    },
    end: {
      dateTime: new Date(),
    },
    // This color is green
    // See https://lukeboyle.com/blog/posts/google-calendar-api-color-id
    colorId: 2,
  };

  const calendarResponse = await calendar.events.insert({
    calendarId: process.env.PERSONAL_CALENDAR_ID,
    resource: event,
  });

  console.log({ calendarResponse });

  return new Response(JSON.stringify(calendarResponse));
}
