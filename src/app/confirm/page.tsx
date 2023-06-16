"use client";

import { Task } from "@doist/todoist-api-typescript";
import { Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getURL } from "../../../utils/url";
import styles from "../page.module.css";
import { formatAsString } from "../utils";

export default function Confirm() {
  const [taskComplete, setTaskComplete] = useState(true);
  const searchParams = useSearchParams();

  const eventName = searchParams.get("eventName");
  const task: Task = searchParams.has("task")
    ? JSON.parse(searchParams.get("task") || "")
    : undefined;
  const startTime = searchParams.get("startTime");
  const timeElapsed = Number(searchParams.get("timeElapsed"));

  return (
    <main className={styles.main}>
      <div className="font-mono text-6xl">You did</div>
      <div className={styles.eventNameChip}>
        <div className="font-mono text-3xl">
          {eventName ? eventName : task ? task.content : ""}
        </div>
      </div>
      <div className="font-mono text-6xl">for</div>
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
          href={getURL("/calendars", {
            startTime,
            eventName,
            task,
            taskComplete,
          })}
        >
          <p className={styles.todoistButtonText}>that&apos;s right!</p>
        </Link>
      </div>
    </main>
  );
}
