"use client";

import { Task } from "@doist/todoist-api-typescript";
import {
  faCirclePlay,
  faCircleStop,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CuteButton from "../../../components/CuteButton";
import { getURL } from "../../../utils/url";
import styles from "../page.module.css";
import { formatAsString } from "../utils";

export default function Stopwatch() {
  const [startTime, setStartTime] = useState<number | null>();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();

  const searchParams = useSearchParams();
  const router = useRouter();

  const eventName = searchParams.get("eventName");
  const task: Task = searchParams.has("task")
    ? JSON.parse(searchParams.get("task") || "")
    : undefined;

  useEffect(() => {
    const maybeStartTime = window.localStorage.getItem("startTime");
    if (maybeStartTime) {
      const startTime = Number(maybeStartTime);
      setStartTime(startTime);
      setIntervalId(
        setInterval(() => {
          setTimeElapsed(new Date().valueOf() - startTime);
        }, 1000)
      );
    }
  }, [startTime]);

  const startStopwatch = () => {
    const time = new Date().valueOf();
    window.localStorage.setItem("startTime", time.toString());
    setStartTime(time);
  };

  // TODO: resolve bug where starting a stopwatch, refreshing it, and clearing
  // it causes the time to continue incrementing until the next refresh.
  const clearStopwatch = () => {
    window.localStorage.removeItem("startTime");
    setStartTime(null);
    setTimeElapsed(0);

    intervalId && clearInterval(intervalId);
    setIntervalId(null);
  };

  function stopStopwatch() {
    window.localStorage.removeItem("startTime");
    intervalId && clearInterval(intervalId);
    router.push(getURL("confirm", { startTime, timeElapsed, eventName, task }));
  }

  return (
    <main className={styles.main}>
      <div className={styles.eventNameChip}>
        <div className="font-mono text-3xl">
          {eventName ? eventName : task ? task.content : ""}
        </div>
      </div>
      <div className={`font-mono ${styles.bigClockText}`}>
        {formatAsString(timeElapsed)}
      </div>
      {!startTime && (
        <CuteButton onClick={startStopwatch} icon={faCirclePlay} text="start" />
      )}
      {startTime && (
        <div className="flex content-between">
          <CuteButton
            onClick={clearStopwatch}
            icon={faRotateLeft}
            text="clear"
          />
          <CuteButton onClick={stopStopwatch} icon={faCircleStop} text="stop" />
        </div>
      )}
    </main>
  );
}
