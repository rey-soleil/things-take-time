"use client";

import { useEffect, useState } from "react";
import NumDaysSelector from "../components/insights/NumDaysSelector";
import RecentTasks from "../components/insights/RecentTasks";
import { Task, filterAndSortEvents } from "../utils";

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
  const [events, setEvents] = useState<Task[]>();

  // selectedNumDays: the number of days to show insights for
  const [selectedNumDays, setSelectedNumDays] = useState<number>(7);

  // This is where we fetch Google Calendar events. This may be moved to a util
  // function if it's repeatedly used.
  async function loadEvents() {
    const events = await fetch(
      `api/insights?selectedNumDays=${selectedNumDays}`,
      {
        method: "GET",
        cache: "no-store",
      }
    ).then((res) => res.json());
    setEvents(filterAndSortEvents(events));
  }

  useEffect(() => {
    loadEvents();
  }, [selectedNumDays]);

  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="flex flex-col md:p-4">
        <NumDaysSelector
          selectedNumDays={selectedNumDays}
          setSelectedNumDays={setSelectedNumDays}
        />
        {/* TODO: implement TaskSelector */}
        {/* <TaskSelector /> */}
      </div>
      <RecentTasks events={events} />
    </div>
  );
}
