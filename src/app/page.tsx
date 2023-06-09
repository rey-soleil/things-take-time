"use client";

import { Task } from "@doist/todoist-api-typescript";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Input from "@mui/material/Input";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { updateCalendarId } from "./_actions";
import Todoist from "./components/Todoist";
import styles from "./page.module.css";

export default function Home() {
  const { data: session } = useSession({ required: true });
  const router = useRouter();
  // const { data: session } = useSession();

  console.log({ session });

  const [eventName, setEventName] = useState<string | undefined>();

  const [selectingTodoistTasks, setSelectingTodoistTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>();

  const [calendarId, setCalendarId] = useState("");

  // TODO: this code is probably for debugging right now. What we want to do is:
  // If the user has a calendarId in session, use that. If not, create a
  // calendarId (by calling api/calendar) and store it in session.
  async function setCalendarIdInSession() {
    if (session.user.calendarId) {
      setCalendarId(session.user.calendarId);
      return;
    }

    // If no calendarId, create one using /api/calendar
    const data = await fetch("/api/calendar", {
      method: "POST",
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
    setCalendarIdInSession();
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
      {!eventName && !selectingTodoistTasks && (
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
          <Link
            href={`/stopwatch?eventName=${eventName}&task=${JSON.stringify(
              selectedTask
            )}`}
          >
            <p className={styles.todoistButtonText}>next</p>
          </Link>
        </div>
      )}
      <div className="absolute bottom-0">
        Your calendar id: {calendarId}{" "}
        <CopyToClipboard text={calendarId}>
          <button>
            <ContentCopyIcon />
          </button>
        </CopyToClipboard>
      </div>
    </main>
  );
}
