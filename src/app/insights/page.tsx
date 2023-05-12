"use client";

import { useEffect, useState } from "react";
import NumDaysSelector from "../components/insights/NumDaysSelector";

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

  // selectedNumDays: the number of days to show insights for
  const [selectedNumDays, setSelectedNumDays] = useState<number>(7);

  // This is where we fetch Google Calendar events. This may be moved to a util
  // function if it's repeatedly used.
  async function loadEvents() {
    const events = await fetch("api/insights", { cache: "no-store" }).then(
      (res) => res.json()
    );
    setEvents(events);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="">
      <NumDaysSelector
        selectedNumDays={selectedNumDays}
        setSelectedNumDays={setSelectedNumDays}
      />
    </div>
  );
}
