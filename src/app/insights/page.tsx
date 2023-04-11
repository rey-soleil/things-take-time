"use client";

import _ from "lodash";
import { useEffect, useState } from "react";

type Event = { id: string; summary: string };

// How many 15-minute intervals there are in a day
const NUM_INTERVALS = 4 * 24;

/* Cluster related event summaries,
 * e.g. "meditate ☀️", "meditate" => "meditate"
 */
function clean(summary: string) {
  if (summary === undefined) return undefined;
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
  return summary;
}

function getMinutesSinceStartOfDay(dateTime) {
  const startOfDay = new Date(
    dateTime.getFullYear(),
    dateTime.getMonth(),
    dateTime.getDate()
  );
  const diffMilliseconds = dateTime.getTime() - startOfDay.getTime();
  const diffMinutes = Math.floor(diffMilliseconds / 60000);
  return diffMinutes;
}

function convertToHeatMap(events: Event[]) {
  const heatMap = new Array(NUM_INTERVALS).fill(0);
  events.forEach((event) => {
    const startInterval = Math.floor(
      getMinutesSinceStartOfDay(new Date(_.get(event, "start.dateTime"))) / 15
    );
    const endInterval = Math.floor(
      getMinutesSinceStartOfDay(new Date(_.get(event, "end.dateTime"))) / 15
    );
    for (let i = startInterval; i < endInterval; i++) {
      heatMap[i] += 1;
    }
  });
  return heatMap;
}

export default function Insights() {
  const [events, setEvents] = useState<Event[]>();
  const [groupedEvents, setGroupedEvents] = useState(); // useState<[string, Event[]][]>();

  function groupEvents(events: Event[]) {
    const groupedEvents = _(events)
      .filter((event) => event.summary !== undefined)
      .groupBy((event) => clean(event.summary))
      .toPairs()
      .orderBy((pair) => pair[1].length, "desc")
      .valueOf();
    setGroupedEvents(groupedEvents);
  }

  async function loadEvents() {
    const events = await fetch("api/insights").then((res) => res.json());
    groupEvents(events);
    return events;
  }

  useEffect(() => {
    loadEvents().then((events) => setEvents(events));
  }, []);

  console.log({ events, groupedEvents });

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
            <ul>{JSON.stringify(convertToHeatMap(events))}</ul>
          </div>
        ))}
    </div>
  );
}
