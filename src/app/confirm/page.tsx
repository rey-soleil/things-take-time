"use client";

import { Roboto } from "next/font/google";
import Link from "next/link";
import styles from "../page.module.css";
import { formatAsString } from "../stopwatch/page";

const roboto = Roboto({ subsets: ["latin"], weight: "700" });

export default function Confirm({ searchParams }) {
  let { startTime, timeElapsed, eventName, task } = searchParams;

  if (eventName === "undefined") eventName = undefined;
  if (task === "undefined") task = undefined;
  if (task) task = JSON.parse(task);

  return (
    <main className={styles.main}>
      <div>
        <h1 className={roboto.className}>You did</h1>
      </div>
      <div className={styles.eventNameChip}>
        <h1 className={roboto.className}>
          {eventName ? eventName : task ? task.content : ""}
        </h1>
      </div>
      <div>
        <h1 className={roboto.className}>for</h1>
      </div>
      <div className={`${roboto.className} ${styles.bigClockText}`}>
        {formatAsString(timeElapsed)}
      </div>
      <div className={`${roboto.className} ${styles.todoistButton}`}>
        <Link
          href={`calendars?startTime=${startTime}&eventName=${eventName}&task=${JSON.stringify(
            task
          )}`}
        >
          <p className={styles.todoistButtonText}>that's right!</p>
        </Link>
      </div>
    </main>
  );
}
