/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { formatAsHHMMSS } from "utils/time";

export default function Stopwatch({
  startTime,
  setIntervalId,
}: {
  startTime: number | undefined;
  setIntervalId: (intervalId: NodeJS.Timer) => void;
}) {
  const [milliseconds, setMilliseconds] = useState(0);

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
