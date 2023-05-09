import { Task } from "./components/RecentTasks";

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

export function duration(task: Task) {
  // Compute a duration in minutes given a startTime and endTime
  const startTime = new Date(task.start.dateTime);
  const endTime = new Date(task.end.dateTime);
  return Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60);
}

export function date(task: Task) {
  const startTime = new Date(task.start.dateTime);
  if (startTime.toDateString() === new Date().toDateString()) {
    return "today";
  } else if (
    startTime.toDateString() === new Date(Date.now() - 86400000).toDateString()
  ) {
    return "yesterday";
  }
  // Format date like Mon Jun 4
  return `${startTime.toDateString().slice(0, 3)} ${startTime
    .toDateString()
    .slice(4, 10)}`;
}
