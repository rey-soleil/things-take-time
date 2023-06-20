import { Session } from "next-auth";
import toast from "react-hot-toast";
import { Task } from "utils/tasks";

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

export function toastTodoistCompletion(
  todoistPromise: Promise<boolean | void>,
  task: Task | undefined
) {
  toast.promise(todoistPromise, {
    loading: (
      <div>
        <p>
          Marking <b>{task?.content}</b> as closed in Todoist
        </p>
      </div>
    ),
    success: (
      <div>
        <p>
          Marked <b>{task?.content}</b> as closed in Todoist
        </p>
      </div>
    ),
    error: (
      <div>
        <p>
          Failed to mark <b>{task?.content}</b> as closed in Todoist
        </p>
      </div>
    ),
  });
}
