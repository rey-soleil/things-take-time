"use client";

import ControlCenter from "components/ControlCenter";
import Stopwatch from "components/Stopwatch";
import { useState } from "react";

export default function Home() {
  const [startTime, setStartTime] = useState<number | undefined>();
  const [endTime, setEndTime] = useState<number | undefined>();
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();

  function startStopwatch() {
    setStartTime(Date.now());
  }

  function stopStopwatch() {
    setStartTime(undefined);
    setEndTime(Date.now());
    clearInterval(intervalId!);
    setIntervalId(null);
  }

  // TODO: save #F2F2F2 as a CSS variable
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-[#F2F2F2]">
      <Stopwatch startTime={startTime} setIntervalId={setIntervalId} />
      <ControlCenter
        startTime={startTime}
        startStopwatch={startStopwatch}
        stopStopwatch={stopStopwatch}
      />
    </main>
  );
}
