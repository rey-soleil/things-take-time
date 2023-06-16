"use client";

import { faCirclePlay, faCircleStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../page.module.css";
import { formatAsString } from "../utils";
import { Task } from "@doist/todoist-api-typescript";

export default function Stopwatch() {
  const [startTime, setStartTime] = useState<number | null>();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();

  const searchParams = useSearchParams();
  const router = useRouter();

  const eventName = searchParams.has("eventName")
    ? searchParams.get("eventName")
    : undefined;
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

  const clearStopwatch = () => {
    window.localStorage.removeItem("startTime");
    setStartTime(null);
    setTimeElapsed(0);

    intervalId && clearInterval(intervalId);
    setIntervalId(null);
  };

  function stopStopwatch() {
    const localStartTime = startTime;
    const localTimeElapsed = timeElapsed;
    clearStopwatch();
    router.push(
      `confirm?startTime=${localStartTime}&timeElapsed=${localTimeElapsed}&eventName=${eventName}&task=${JSON.stringify(
        task
      )}`
    );
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
        <button onClick={startStopwatch} className="text-8xl">
          <FontAwesomeIcon icon={faCirclePlay} />
        </button>
      )}
      {startTime && (
        <button onClick={stopStopwatch} className="text-8xl">
          <FontAwesomeIcon icon={faCircleStop} />
        </button>
      )}
    </main>
  );
}
