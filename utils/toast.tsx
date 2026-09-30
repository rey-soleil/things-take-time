import { Session } from "next-auth";
import toast from "react-hot-toast";
import { Task, taskSourceLabel } from "utils/tasks";

export function toastGoogleCalendarCompletion(
  googleCalendarPromise: Promise<void | Response>,
  session: Session | null,
  task: Task | undefined
) {
  toast.promise(googleCalendarPromise, {
    loading: (
      <div>
        <p>
          Adding <b>{task?.content}</b> to Google Calendar
        </p>
      </div>
    ),
    success: (
      <div>
        <p>
          Added <b>{task?.content}</b> to Google Calendar.{" "}
        </p>
        {session?.user.calendarId && (
          <a
            href={`https://calendar.google.com/calendar/u/0/r?cid=${session.user.calendarId}`}
            target="_blank"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Check it out ↗
          </a>
        )}
      </div>
    ),
    error: (
      <div>
        <p>
          Failed to add <b>{task?.content}</b> to Google Calendar
        </p>
      </div>
    ),
  });
}

export function toastTaskCompletion(
  completionPromise: Promise<boolean | void>,
  task: Task | undefined
) {
  const source = task ? taskSourceLabel(task) : "task source";
  toast.promise(completionPromise, {
    loading: (
      <div>
        <p>
          Marking <b>{task?.content}</b> complete in {source}
        </p>
      </div>
    ),
    success: (
      <div>
        <p>
          Marked <b>{task?.content}</b> complete in {source}
        </p>
      </div>
    ),
    error: (
      <div>
        <p>
          Failed to mark <b>{task?.content}</b> complete in {source}
        </p>
      </div>
    ),
  });
}
