"use client";

import _ from "lodash";
import { useEffect, useState } from "react";

type Event = { id: string; summary: string };

export default function Insights() {
  const [events, setEvents] = useState<Event[]>();
  const [groupedEvents, setGroupedEvents] = useState<[string, Event[]][]>();

  function groupEvents(events: Event[]) {
    const groupedEvents = _(events)
      .groupBy((event) => event.summary)
      .toPairs()
      .orderBy((pair) => pair[1].length, "desc")
      .valueOf();
    console.log({ groupedEvents });
    return groupedEvents;
  }

  async function loadEvents() {
    const events = await fetch("api/insights").then((res) => res.json());
    const groupedEvents = groupEvents(events);
    setGroupedEvents(groupedEvents);
    return events;
  }

  useEffect(() => {
    loadEvents().then((events) => setEvents(events));
  }, []);

  console.log({ events });

  if (!events) return <div>Loading...</div>;

  return (
    <div>
      {/* {events.map((event) => (
        <div key={event.id}>{`${event.summary} ${_.get(
          event,
          "start.dateTime"
        )} ${_.get(event, "end.dateTime")}`}</div>
      ))} */}
      {groupedEvents &&
        groupedEvents.length > 0 &&
        groupedEvents.map(([summary, events]) => (
          <div key={summary}>
            <h2>{summary}</h2>
            <ul>
              {events.map((event) => (
                <li key={event.id}>
                  {`${event.summary} ${_.get(event, "start.dateTime")} ${_.get(
                    event,
                    "end.dateTime"
                  )}`}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
