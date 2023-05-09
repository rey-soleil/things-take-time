import _ from "lodash";
import { GCalEvent } from "./insights/page";

type Task = {
  start: { dateTime: string };
  end: { dateTime: string };
  description: string;
};

// Converts a time in milliseconds to a string in the format HH:MM:SS
export function formatAsString(time: number) {
  const seconds = Math.floor(time / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  let timeString =
    hours > 0 ? `${(hours % 24).toString().padStart(2, "0")}:` : "";
  return timeString.concat(
    `${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`
  );
}

// Compute a duration in minutes given a startTime and endTime
export function duration(task: Task) {
  const startTime = new Date(task.start.dateTime);
  const endTime = new Date(task.end.dateTime);
  return Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60);
}

// Given a task with a date, formats its date like "Mon Jun 4"
export function date(task: Task) {
  const startTime = new Date(task.start.dateTime);
  if (startTime.toDateString() === new Date().toDateString()) {
    return "today";
  } else if (
    startTime.toDateString() === new Date(Date.now() - 86400000).toDateString()
  ) {
    return "yesterday";
  }
  return `${startTime.toDateString().slice(0, 3)} ${startTime
    .toDateString()
    .slice(4, 10)}`;
}

// This function filters out all-day events and events without descriptions,
// then sorts them in reverse chronological order.
export function filterAndSortEvents(events: GCalEvent[]): Task[] {
  return events
    .filter(
      (event) =>
        event &&
        event.start &&
        event.start.dateTime &&
        event.end &&
        event.end.dateTime &&
        event.description &&
        event.description === "made with next-right-thing"
    )
    .sort((a, b) =>
      (a?.start?.dateTime ?? 0) > (b?.start?.dateTime ?? 0) ? -1 : 1
    ) as Task[];
}

// Returns a map from dates to lists of events on that date.
// Eg. groupEventsByDate["Fri Apr 14 2023"] = [{...}, {...}, {...}]
export function groupEventsByDate(events: GCalEvent[]) {
  return _(filterAndSortEvents(events))
    .groupBy((event) => new Date(event.start.dateTime).toDateString())
    .valueOf();
}

// Retrives the total time logged today in milliseconds.
export function getTimeLoggedToday(events: GCalEvent[]) {
  return (
    1000 *
    groupEventsByDate(events)[new Date().toDateString()]?.reduce(
      (a, b) => a + duration(b),
      0
    )
  );
}

// This function accepts an array of GCalEvents and finds
//  the most recent (up to) 10 tasks completed using next-right-thing.
export function findMostRecentTasks(events: GCalEvent[]) {
  return filterAndSortEvents(events).slice(0, Math.min(10, events.length));
}
