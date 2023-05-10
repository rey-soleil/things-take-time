"use client";

import { Task } from "@doist/todoist-api-typescript";
import Input from "@mui/material/Input";
import Link from "next/link";
import { useState } from "react";
import Todoist from "./components/Todoist";
import styles from "./page.module.css";

export default function Home() {
  const [eventName, setEventName] = useState<string | undefined>();

  const [selectingTodoistTasks, setSelectingTodoistTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>();

  return (
    <main className={styles.main}>
      <div className="text-5xl font-mono text-center">
        What&apos;s the next right thing?
      </div>
      {!selectingTodoistTasks && (
        <Input
          placeholder="type it here"
          onChange={({ target }) => setEventName(target.value)}
          sx={{ color: "white", fontSize: "45px" }}
          inputProps={{ style: { textAlign: "center" } }}
        ></Input>
      )}
      {!eventName && !selectingTodoistTasks && (
        <>
          <div className="text-5xl font-mono">
            <i>or</i>
          </div>
          <div
            className={`font-mono ${styles.todoistButton}`}
            onClick={() => setSelectingTodoistTasks(true)}
          >
            <p className={styles.todoistButtonText}>
              choose from Todoist tasks
            </p>
          </div>
        </>
      )}
      {!eventName && selectingTodoistTasks && (
        <Todoist
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />
      )}
      {(eventName || selectedTask) && (
        <div className={`font-mono ${styles.todoistButton}`}>
          <Link
            href={`/stopwatch?eventName=${eventName}&task=${JSON.stringify(
              selectedTask
            )}`}
          >
            <p className={styles.todoistButtonText}>next</p>
          </Link>
        </div>
      )}
    </main>
  );
}
