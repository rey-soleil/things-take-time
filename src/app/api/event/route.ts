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
 * from taskName or task.content.
 */
export async function POST(request: Request) {
  const { startTime, endTime, task, calendarId } = await request.json();
  const summary = task.content;
  const description = task?.description || "";
  const taskType = summary.split(":").length > 0 ? summary.split(":")[0].toLowerCase() : null;
  let colorId = null;
  if(taskType === "freelance") colorId = 9

  const resource = {
    summary,
    description,
    start: {
      dateTime: new Date(startTime),
    },
    end: {
      dateTime: new Date(endTime),
    },
    colorId
  };

  try {
    const calendarResponse = await calendar.events.insert({
      calendarId,
      resource,
    });

    return new Response(JSON.stringify(calendarResponse), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
