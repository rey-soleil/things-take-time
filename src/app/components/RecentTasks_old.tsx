"use client";
import { useEffect, useState } from "react";
import { GCalEvent } from "../insights/page";
import { date, duration, findMostRecentTasks } from "../utils";

type RecentTasksProps = {
  events: GCalEvent[];
};

export default function RecentTasks({ events }: RecentTasksProps) {
  // A task is a Google Calendar event that has been created using next-right-thing.
  const [recentTasks, setRecentTasks] = useState<any[]>();

  useEffect(() => {
    events && events.length > 0 && setRecentTasks(findMostRecentTasks(events));
  }, [events]);

  // console.log({ events, recentTasks });

  return (
    <div className="flex flex-col items-start">
      <h2>Your last {recentTasks?.length} tasks:</h2>
      {recentTasks?.map((task) => (
        <div key={task.id}>
          <b>{task.summary}</b> ({duration(task)} min, {date(task)})
        </div>
      ))}
    </div>
  );
}
