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

/*
 * Add a new event to the user's associated Google Calendar. Its summary comes
 * from eventName or task.content.
 */
export async function POST(request: Request) {
  const { startTime, endTime, eventName, task, calendarId } =
    await request.json();
  const summary = eventName || task.content;
  const description = task?.description || "";

  const resource = {
    summary,
    description,
    start: {
      dateTime: new Date(startTime),
    },
    end: {
      dateTime: new Date(endTime),
    },
  };

  try {
    const calendarResponse = await calendar.events.insert({
      calendarId,
      resource,
    });

    return new Response(JSON.stringify(calendarResponse));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
