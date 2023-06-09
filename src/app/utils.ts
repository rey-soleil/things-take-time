import _ from "lodash";

export type Task = {
  start: { dateTime: string };
  end: { dateTime: string };
  description: string;
  summary: string;
};

export type GCalEvent = {
  id: string;
  summary: string;
  start?: { dateTime: string };
  end?: { dateTime: string };
  description: string;
};

export type ClusteredTasks = {
  [key: string]: {
    duration: number;
    instances: Task[];
  };
};

export type TasksByDate = {
  [key: string]: any;
};

/* Cluster related event summaries,
 * e.g. "meditate ☀️", "meditate" => "meditate"
 * This is obviously unique to Rey and needs to be adapted for other users.
 */
export function getTaskType(summary: string) {
  if (summary === undefined) return "";
  if (summary.includes("leetcode")) return "leetcode";
  if (summary.startsWith("meditate")) return "meditate";
  if (summary === "gym" || summary.startsWith("exercise")) return "exercise";
  if (summary.startsWith("read")) return "read";
  if (summary.startsWith("journal")) return "journal";
  if (summary.includes("dinner")) return "dinner";
  if (summary.startsWith("code")) return "code";
  if (summary.includes("piano")) return "piano";
  if (summary.includes("walk")) return "walk";
  if (summary.includes(" w ")) return "social";
  if (summary.startsWith("climb")) return "climb";
  if (summary.startsWith("job search")) return "job search";
  if (summary.includes(":")) return summary.split(":")[0].toLowerCase();
  return summary;
}

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
export function getDuration(task: Task) {
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
        event.end.dateTime
    )
    .reverse() as Task[];
}

// Returns a map from dates to lists of events on that date.
// Eg. groupEventsByDate["Fri Apr 14 2023"] = [{...}, {...}, {...}]
export function groupEventsByDate(events: GCalEvent[]) {
  return _(filterAndSortEvents(events))
    .groupBy((event) => new Date(event.start.dateTime).toDateString())
    .valueOf();
}

// Returns a map from dates to a map from task category to its duration.
// Eg. getTaskDurationByDate["Fri Apr 14 2023"] = { "meditate": 65, "code": 120 }
export function getTaskDurationByDate(events: GCalEvent[]) {
  return _(groupEventsByDate(events))
    .mapValues((events) => {
      const taskClusters = {};
      events.forEach((event) => {
        const taskCluster = getTaskType(event.summary);
        (taskClusters as any)[taskCluster] =
          ((taskClusters as any)[taskCluster] || 0) + getDuration(event);
      });
      return taskClusters;
    })
    .valueOf();
}

// Retrives the total time logged today in milliseconds.
export function getTimeLoggedToday(events: GCalEvent[]) {
  return (
    1000 *
    groupEventsByDate(events)[new Date().toDateString()]?.reduce(
      (a, b) => a + getDuration(b),
      0
    )
  );
}

// This function accepts an array of GCalEvents and finds
//  the most recent (up to) 10 tasks completed using next-right-thing.
export function findMostRecentTasks(events: GCalEvent[]) {
  return filterAndSortEvents(events).slice(0, Math.min(10, events.length));
}

// This function converts an array of tasks to a map from task type to
// its duration and instances.
// eg. clusteredTasks["code"] = { duration: 546, instances: Array(5)}
export function convertToCluster(tasks?: Task[]) {
  if (!tasks) return {};
  return tasks.reduce((acc, event) => {
    const taskType = getTaskType(event.summary);
    let { duration, instances } = acc[taskType] ?? {
      duration: 0,
      instances: [],
    };
    duration += getDuration(event);
    instances.push(event);
    acc[taskType] = { duration, instances };
    return acc;
  }, {} as ClusteredTasks);
}

// This function takes timeLogged, in minutes, and formats it as
// a string in the format "1h 30m".
export function formatAsHourAndMinutes(timeLogged: number) {
  const hours = Math.floor(timeLogged / 60);
  const minutes = timeLogged % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

// tasksByDate is in the form rechart expects
// its entries look like this:
// { day: "Fri Apr 14 2023", code: 120, meditate: 65 }
export function convertToTasksByDate(tasks?: Task[]) {
  if (!tasks) return [];
  return tasks
    .reduce((acc, task) => {
      const dayOfTask = new Date(task.start.dateTime).toDateString();
      const taskType = getTaskType(task.summary);
      const duration = getDuration(task);
      if (acc.length === 0 || acc[acc.length - 1].day !== dayOfTask) {
        acc.push({ day: dayOfTask });
      }
      acc[acc.length - 1][taskType] =
        duration + (acc[acc.length - 1][taskType] || 0);
      return acc;
      //   TODO: specify accumulator type
    }, [] as any)
    .reverse();
}

// When charting tasks for a single day, we'd rather display
// each task as its own bar rather than stack them.
// A typical entry looks like this:
// { taskType: "code", duration: 120 }
export function convertToTasksForASingleDay(
  selectedTasks: Set<string>,
  tasks?: Task[]
) {
  if (!tasks) return [];
  return Object.entries(convertToCluster(tasks))
    .map((a) => ({
      taskType: a[0],
      duration: a[1].duration,
    }))
    .filter((a) => selectedTasks.has(a.taskType))
    .sort((a, b) => b.duration - a.duration);
}
