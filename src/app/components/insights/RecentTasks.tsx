"use client";
import { Task, date, duration } from "../../utils";

type RecentTasksProps = {
  events?: Task[];
};

export default function RecentTasks({ events }: RecentTasksProps) {
  return (
    <div className="flex flex-col items-start">
      {events?.map((task) => (
        <div key={task.start.dateTime}>
          <b>{task.summary}</b> ({duration(task)} min, {date(task)})
        </div>
      ))}
    </div>
  );
}
