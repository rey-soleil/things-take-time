"use client";
import { useEffect, useState } from "react";
import { formatAsHHMMSS } from "utils/time";

export default function Stopwatch({
  startTime,
}: {
  startTime: number | undefined;
}) {
  const [milliseconds, setMilliseconds] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();

  useEffect(() => {
    if (!startTime) return;
    const intervalId = setInterval(() => {
      setMilliseconds(Date.now() - startTime);
    }, 1000);
    setIntervalId(intervalId);
  }, [startTime]);

  // TODO: add style
  return <div className="text-7xl">{formatAsHHMMSS(milliseconds)}</div>;
}
