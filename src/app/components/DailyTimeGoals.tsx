"use client";

import { useEffect, useState } from "react";
import { GCalEvent } from "../insights/page";
import { formatAsString, getTimeLoggedToday } from "../utils";

type DailyTimeGoalsProps = {
  events: GCalEvent[];
};

export default function DailyTimeGoals({ events }: DailyTimeGoalsProps) {
  const [timeLoggedToday, setTimeLoggedToday] = useState(0);

  useEffect(() => {
    setTimeLoggedToday(getTimeLoggedToday(events));
  }, [events]);

  return (
    <>
      <div className="text-6xl">
        You&apos;ve logged {formatAsString(timeLoggedToday)} today
      </div>
    </>
  );
}
