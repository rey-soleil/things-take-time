import toast from "react-hot-toast";
import { Task } from "utils/tasks";

export function toastGoogleCalendarCompletion(
  googleCalendarPromise: Promise<void | Response>,
  task: Task | undefined
) {
  toast.promise(googleCalendarPromise, {
    loading: (
      <p>
        Adding <b>{task?.content}</b> to Google Calendar
      </p>
    ),
    success: (
      <p>
        Added <b>{task?.content}</b> to Google Calendar
      </p>
    ),
    error: (
      <p>
        Failed to add <b>{task?.content}</b> to Google Calendar
      </p>
    ),
  });
}

export function toastTodoistCompletion(
  todoistPromise: Promise<boolean | void>,
  task: Task | undefined
) {
  toast.promise(todoistPromise, {
    loading: (
      <p>
        Marking <b>{task?.content}</b> as closed in Todoist
      </p>
    ),
    success: (
      <p>
        Marked <b>{task?.content}</b> as closed in Todoist
      </p>
    ),
    error: (
      <p>
        Failed to mark <b>{task?.content}</b> as closed in Todoist
      </p>
    ),
  });
}
