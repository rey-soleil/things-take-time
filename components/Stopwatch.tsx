"use client";
import { useState } from "react";
import { formatasHHMMSS } from "../utils/time";

export default function Stopwatch() {
  const [timeElapsed, setTimeElapsed] = useState(0);

  // TODO: add style
  return <div>{formatasHHMMSS(timeElapsed)}</div>;
}
