"use client";

import { useEffect, useState } from "react";
import DailyTimeGoals from "../components/DailyTimeGoals";
import RecentTasks from "../components/RecentTasks";

export type GCalEvent = {
  id: string;
  summary: string;
  start?: { dateTime: string };
  end?: { dateTime: string };
  description: string;
};

/*
 * Insights is a page with multiple components giving users insights into their time management.
 */
export default function Insights() {
  // events: an array of events obtained by calling the Google Calendar API
  const [events, setEvents] = useState<GCalEvent[]>();

  // This is where we fetch Google Calendar events. This may be moved to a util
  // function if it's repeatedly used.
  async function loadEvents() {
    const events = await fetch("api/insights").then((res) => res.json());
    setEvents(events);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="flex flex-col items-center m-6">
      <DailyTimeGoals events={events || []} />
      {/* <WhenYouDoEachActivity /> */}
      <RecentTasks events={events || []} />
    </div>
  );
}
