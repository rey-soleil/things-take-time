"use client";
import { useState } from "react";
import { formatAsHHMMSS } from "utils/time";

export default function Stopwatch() {
  // TODO: increment secondsElapsed when user clicks START
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // TODO: add style
  return <div className="text-7xl">{formatAsHHMMSS(secondsElapsed)}</div>;
}
