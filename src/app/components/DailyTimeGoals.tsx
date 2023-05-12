"use client";

import { useEffect, useState } from "react";
import {
  GCalEvent,
  formatAsString,
  getTaskDurationByDate,
  getTimeLoggedToday,
} from "../utils";
import ActivitiesFromLastNDays from "./ActivitiesFromLastNDays";

type DailyTimeGoalsProps = {
  events: GCalEvent[];
};

export default function DailyTimeGoals({ events }: DailyTimeGoalsProps) {
  // This is the total time logged today, in milliseconds.
  const [timeLoggedToday, setTimeLoggedToday] = useState(0);

  // eg. taskDurationByDate["Fri Apr 14 2023"] = { "meditate": 65, "code": 120 }
  const [taskDurationByDate, setTaskDurationByDate] = useState({});

  useEffect(() => {
    setTimeLoggedToday(getTimeLoggedToday(events));
    setTaskDurationByDate(getTaskDurationByDate(events));
  }, [events]);

  return (
    <>
      <div className="text-6xl">
        You&apos;ve logged {formatAsString(timeLoggedToday)} today
      </div>
      <ActivitiesFromLastNDays taskDurationByDate={taskDurationByDate} />
    </>
  );
}
