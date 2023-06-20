import { updateCalendarId } from "@/app/_actions";
import { Session } from "next-auth";

// If the user has a calendarId in session, use that. If not, create a
// calendarId (by calling api/calendar) and store it in session.

// If we created a new calendar, return {needToRefresh: true} so that
// we know to refresh the page.
export async function setCalendarIdInSession(session: Session) {
  if (session.user.calendarId) {
    return { needToRefresh: false };
  }

  // If no calendarId, create one using /api/calendar
  const data = await fetch("/api/calendar", {
    method: "POST",
    body: JSON.stringify({ email: session?.user?.email }),
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.error(err));

  updateCalendarId(session?.user?.email!, data.calendarId);
  return { needToRefresh: true };
}
