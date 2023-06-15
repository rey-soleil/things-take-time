"use client";

import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../page.module.css";
import { formatAsString } from "../utils";

export default function Stopwatch() {
  const [startTime, setStartTime] = useState<number | null>();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();

  const searchParams = useSearchParams();

  // TODO: give these real types
  let eventName: any = searchParams.get("eventName");
  let task: any = searchParams.get("task");

  if (eventName === "undefined") eventName = undefined;
  if (task === "undefined") task = undefined;
  if (task) task = JSON.parse(task);

  // console.log({ eventName, task });

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
        <div className={styles.stopwatchButtons}>
          <div className={`$font-mono ${styles.todoistButton}`}>
            <p className={styles.todoistButtonText} onClick={clearStopwatch}>
              clear
            </p>
          </div>
          <div className={`$font-mono ${styles.todoistButton}`}>
            <Link
              href={`confirm?startTime=${startTime}&timeElapsed=${timeElapsed}&eventName=${eventName}&task=${JSON.stringify(
                task
              )}`}
            >
              <p className={styles.todoistButtonText} onClick={clearStopwatch}>
                finish
              </p>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
