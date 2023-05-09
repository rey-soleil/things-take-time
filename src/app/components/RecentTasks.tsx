"use client";
import { useEffect, useState } from "react";
import { GCalEvent } from "../insights/page";
import { date, duration } from "../utils";

type RecentTasksProps = {
  events: GCalEvent[];
};

export type Task = {
  start: { dateTime: string };
  end: { dateTime: string };
  description: string;
};

// This function finds the most recent (up to) 10 tasks completed using next-right-thing.
function convertEventsToRecentTasks(events: GCalEvent[]) {
  events = events
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
    );

  return events.slice(0, Math.min(10, events.length));
}

export default function RecentTasks({ events }: RecentTasksProps) {
  // A task is a Google Calendar event that has been created using next-right-thing.
  const [recentTasks, setRecentTasks] = useState<any[]>();

  useEffect(() => {
    events &&
      events.length > 0 &&
      setRecentTasks(convertEventsToRecentTasks(events));
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
