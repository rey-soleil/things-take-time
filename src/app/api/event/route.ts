// TODO: change to imports
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

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
  const { startTime, eventName, task, calendarId } = await request.json();
  const summary = eventName || task.content;
  const description = task?.description || '';

  const event = {
    summary,
    description,
    start: {
      dateTime: new Date(startTime),
    },
    // TODO: pass in endTime so that the GCal event is more accurate
    end: {
      dateTime: new Date(),
    },
  };

  try {
    const calendarResponse = await calendar.events.insert({
      calendarId,
      resource: event,
    });

    return new Response(JSON.stringify(calendarResponse));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
