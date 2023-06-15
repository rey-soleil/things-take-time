"use client";

import { Task } from "@doist/todoist-api-typescript";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Input from "@mui/material/Input";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Todoist from "../../components/Todoist";
import { getURL } from "../../utils/url";
import { updateCalendarId } from "./_actions";
import styles from "./page.module.css";

export default function Home() {
  const { data: session } = useSession({ required: true });
  const router = useRouter();
  // const { data: session } = useSession();

  const [eventName, setEventName] = useState<string | undefined>();

  const [selectingTodoistTasks, setSelectingTodoistTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>();

  const [calendarId, setCalendarId] = useState("");

  // TODO: this code is probably for debugging right now. What we want to do is:
  // If the user has a calendarId in session, use that. If not, create a
  // calendarId (by calling api/calendar) and store it in session.
  async function setCalendarIdInSession() {
    if (session?.user?.calendarId) {
      setCalendarId(session.user.calendarId);
      return;
    }

    // If no calendarId, create one using /api/calendar
    const data = await fetch("/api/calendar", {
      method: "POST",
      body: JSON.stringify({ email: session?.user?.email }),
    }).then((res) => {
      console.log({ res });
      return res.json();
    });
    console.log({ data });

    setCalendarId(data.calendarId);
    updateCalendarId(session?.user?.email!, data.calendarId);
    router.refresh();
  }

  useEffect(() => {
    session && setCalendarIdInSession();
  }, [session]);

  return (
    <main className={styles.main}>
      <div className="text-center font-mono text-5xl">
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
      {!eventName &&
        !selectingTodoistTasks &&
        session?.user?.todoistAPIToken && (
          <>
            <div className="font-mono text-5xl">
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
          <Link href={getURL("/stopwatch", { eventName, task: selectedTask })}>
            <p className={styles.todoistButtonText}>next</p>
          </Link>
        </div>
      )}
      {!selectingTodoistTasks && (
        <div className={`m-5 font-mono ${styles.todoistButton}`}>
          <Link href="/insights">
            <p className={styles.todoistButtonText}>insights</p>
          </Link>
        </div>
      )}
      {calendarId && (
        <div className="absolute bottom-0">
          <a
            href={`https://calendar.google.com/calendar/u/0/r?cid=${calendarId}`}
            target="_blank"
          >
            <span>Take me to my calendar </span>
            <OpenInNewIcon />
          </a>
        </div>
      )}
    </main>
  );
}
