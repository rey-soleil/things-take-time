import { Session } from "next-auth";
import { Task } from "utils/tasks";
import { toastGoogleCalendarCompletion, toastTodoistCompletion } from "./toast";

export function logToGoogleCalendarAndToast(
  session: Session | null,
  startTime: number | undefined,
  task: Task | undefined
) {
  const googleCalendarPromise = logTaskToGoogleCalendar(
    session,
    startTime,
    task
  );
  if (googleCalendarPromise) {
    toastGoogleCalendarCompletion(googleCalendarPromise, session, task);
  }
}

export function logTaskToGoogleCalendar(
  session: Session | null,
  startTime: number | undefined,
  task: Task | undefined
) {
  if (!session?.user.calendarId || !startTime) {
    return Promise.reject();
  }
  const body = {
    startTime,
    endTime: Date.now(),
    task,
    calendarId: session.user.calendarId,
  };
  return fetch("/api/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Google Calendar request failed: ${response.status}`);
    }
    return response;
  });
}

export function closeTodoistTaskAndToast(
  session: Session | null,
  task: Task | undefined
) {
  const todoistPromise = closeTaskInTodoist(session, task);
  if (todoistPromise) {
    toastTodoistCompletion(todoistPromise, task);
  }
}

export function closeTaskInTodoist(
  session: Session | null,
  task: Task | undefined
) {
  if (!task?.id || !session) {
    return null;
  }

  return fetch(`/api/todoist/tasks/${encodeURIComponent(task.id)}/close`, {
    method: "POST",
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Todoist request failed: ${response.status}`);
    }
  });
}
