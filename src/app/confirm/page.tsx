"use client";

import { Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "../page.module.css";
import { formatAsString } from "../utils";

export default function Confirm() {
  const [taskComplete, setTaskComplete] = useState(true);
  const searchParams = useSearchParams();

  let startTime: any = searchParams.get("startTime");
  let eventName: any = searchParams.get("eventName");
  let task: any = searchParams.get("task");
  let timeElapsed: any = searchParams.get("timeElapsed");

  if (eventName === "undefined") eventName = undefined;
  if (task === "undefined") task = undefined;
  if (task) task = JSON.parse(task);

  // console.log({ startTime, eventName, task, timeElapsed });

  return (
    <main className={styles.main}>
      <div className="text-6xl font-mono">You did</div>
      <div className={styles.eventNameChip}>
        <div className="text-6xl font-mono">
          {eventName ? eventName : task ? task.content : ""}
        </div>
      </div>
      <div className="text-6xl font-mono">for</div>
      <div className={`font-mono ${styles.bigClockText}`}>
        {formatAsString(timeElapsed)}
      </div>
      {task && (
        <div className="font-mono">
          <FormControlLabel
            label="This task is complete"
            control={
              <Checkbox style={{ color: "white" }} checked={taskComplete} />
            }
            onChange={() => setTaskComplete(!taskComplete)}
          />
        </div>
      )}
      <div className={`font-mono ${styles.todoistButton}`}>
        <Link
          href={`calendars?startTime=${startTime}&eventName=${eventName}&task=${JSON.stringify(
            task
          )}&taskComplete=${taskComplete}`}
        >
          <p className={styles.todoistButtonText}>that&apos;s right!</p>
        </Link>
      </div>
    </main>
  );
}
