"use client";

import { GCalEvent } from "../insights/page";

type DailyTimeGoalsProps = {
  events: GCalEvent[];
};

export default function DailyTimeGoals({ events }: DailyTimeGoalsProps) {
  console.log("in DailyTimeGoals.tsx, events: ", events);
  return <></>;
}
