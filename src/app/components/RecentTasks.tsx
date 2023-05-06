"use client";
import { useEffect, useState } from "react";

type Event = {
  id: string;
  summary: string;
  start?: { dateTime: string };
  description: string;
};

type Task = {
  start: { dateTime: string };
  end: { dateTime: string };
};

export default function RecentTasks() {
  // This is where we fetch Google Calendar events. This may be moved to a util
  // function if it's repeatedly used.
  const [events, setEvents] = useState<Event[]>();

  // TODO: specify type for recentTasks
  const [recentTasks, setRecentTasks] = useState<any[]>();

  // Returns an array of events that have a start and end time,
  // that were created in next-right-thing, and are sorted by start time.
  // Return the 10 most recent events.
  function convertEventsToRecentTasks(events: Event[]) {
    events = events
      .filter(
        (event) =>
          event &&
          event.start &&
          event.start.dateTime &&
          event.description &&
          event.description === "made with next-right-thing"
      )
      .sort((a, b) =>
        (a?.start?.dateTime ?? 0) > (b?.start?.dateTime ?? 0) ? -1 : 1
      );

    return events.slice(0, Math.min(10, events.length));
  }

  async function loadEvents() {
    const events = await fetch("api/insights").then((res) => res.json());
    const recentTasks = await convertEventsToRecentTasks(events);
    setEvents(events);
    setRecentTasks(recentTasks);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function duration(task: Task) {
    // Compute a duration in minutes given a startTime and endTime
    const startTime = new Date(task.start.dateTime);
    const endTime = new Date(task.end.dateTime);
    return Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60);
  }

  function date(task: Task) {
    const startTime = new Date(task.start.dateTime);
    if (startTime.toDateString() === new Date().toDateString()) {
      return "today";
    } else if (
      startTime.toDateString() ===
      new Date(Date.now() - 86400000).toDateString()
    ) {
      return "yesterday";
    }
    // Format date like Mon Jun 4
    return `${startTime.toDateString().slice(0, 3)} ${startTime
      .toDateString()
      .slice(4, 10)}`;
  }

  console.log({ events, recentTasks });

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
