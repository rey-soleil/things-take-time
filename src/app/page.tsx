"use client";

import ControlCenter from "components/ControlCenter";
import Stopwatch from "components/Stopwatch";
import Timeline from "components/Timeline";
import { useEffect, useState } from "react";

export default function Home() {
  const [startTime, setStartTime] = useState<number | undefined>();
  const [milliseconds, setMilliseconds] = useState(0);
  const [endTime, setEndTime] = useState<number | undefined>();
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();

  function startStopwatch() {
    setStartTime(Date.now());
  }

  function stopStopwatch() {
    setStartTime(undefined);
    setMilliseconds(0);
    setEndTime(Date.now());
    clearInterval(intervalId!);
    setIntervalId(null);
  }

  // When startTime is set, create an interval to update milliseconds every
  // second
  useEffect(() => {
    if (!startTime) return;
    const intervalId = setInterval(() => {
      setMilliseconds(Date.now() - startTime);
    }, 1000);
    setIntervalId(intervalId);
  }, [startTime]);

  // TODO: save #F2F2F2 as a CSS variable
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-[#F2F2F2]">
      <Timeline milliseconds={milliseconds} />
      <Stopwatch milliseconds={milliseconds} />
      <ControlCenter
        startTime={startTime}
        startStopwatch={startStopwatch}
        stopStopwatch={stopStopwatch}
      />
    </main>
  );
}
