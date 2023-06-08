// TODO: change to imports
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

// The color of the event in the calendar. This one is green.
// See https://lukeboyle.com/blog/posts/google-calendar-api-color-id
const COLOR_ID = 2;

const oAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
const calendarId = process.env.PERSONAL_CALENDAR_ID;

export async function POST(request: Request) {
  const { eventName, startTime } = await request.json();

  const event = {
    summary: eventName,
    description: "made with next-right-thing",
    start: {
      dateTime: new Date(startTime),
    },
    // TODO: pass in endTime so that the GCal event is more accurate
    end: {
      dateTime: new Date(),
    },
    colorId: COLOR_ID,
  };

  try {
    const calendarResponse = await calendar.events.insert({
      calendarId,
      resource: event,
    });

    return new Response(JSON.stringify(calendarResponse));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error));
  }
}
