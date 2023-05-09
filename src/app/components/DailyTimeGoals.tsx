"use client";

import { useEffect, useState } from "react";
import { GCalEvent } from "../insights/page";
import {
  formatAsString,
  getTaskDurationByDate,
  getTimeLoggedToday,
} from "../utils";

type DailyTimeGoalsProps = {
  events: GCalEvent[];
};

export default function DailyTimeGoals({ events }: DailyTimeGoalsProps) {
  // This is the total time logged today, in milliseconds.
  const [timeLoggedToday, setTimeLoggedToday] = useState(0);

  const [taskDurationByDate, setTaskDurationByDate] = useState({});

  useEffect(() => {
    setTimeLoggedToday(getTimeLoggedToday(events));
    setTaskDurationByDate(getTaskDurationByDate(events));
  }, [events]);

  console.log({
    taskDurationByDate,
    today: new Date().toDateString(),
    values: taskDurationByDate[new Date().toDateString()],
  });

  return (
    <>
      <div className="text-6xl">
        You&apos;ve logged {formatAsString(timeLoggedToday)} today
      </div>
      <div>{JSON.stringify(taskDurationByDate[new Date().toDateString()])}</div>
    </>
  );
}
