"use client";

import { Task, TodoistApi } from "@doist/todoist-api-typescript";
import CheckIcon from "@mui/icons-material/Check";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import styles from "../page.module.css";

export default function Completed() {
  const { data: session } = useSession({ required: true });
  const calendarId = session?.user?.calendarId ?? null;

  const [addedToGoogleCalendar, setAddedToGoogleCalendar] = useState(false);
  const [addedToTodoist, setAddedToTodoist] = useState(false);

  const searchParams = useSearchParams();

  const eventName = searchParams.get("eventName");
  const task: Task = searchParams.has("task")
    ? JSON.parse(searchParams.get("task") || "")
    : undefined;
  const startTime = Number(searchParams.get("startTime"));
  const timeElapsed = Number(searchParams.get("timeElapsed"));
  let taskComplete = searchParams.get("taskComplete") === "true";

  async function createEvent() {
    const body = JSON.stringify({
      startTime: startTime,
      endTime: startTime + timeElapsed,
      eventName,
      task,
      calendarId,
    });
    try {
      await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
    } catch (e) {
      console.error(e);
    }
    setAddedToGoogleCalendar(true);
    if (task && task.id && taskComplete && session?.user?.todoistAPIToken) {
      try {
        const todoistApi = new TodoistApi(session.user.todoistAPIToken);
        await todoistApi.closeTask(task.id);
      } catch (e) {
        console.error(e);
      }
      setAddedToTodoist(true);
    }
  }

  useEffect(() => {
    calendarId && createEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarId]);

  // console.log({ addedToGoogleCalendar });

  return (
    <main className={styles.main}>
      <div className={styles.calendar}>
        <div className={styles.calendarUpdateRow}>
          {addedToGoogleCalendar ? (
            <CheckIcon fontSize="large" sx={{ color: "white" }} />
          ) : (
            <ClipLoader color="white" />
          )}
          <div className="font-mono text-3xl">Adding to Google Calendar</div>
        </div>
        {task && taskComplete && (
          <div className={styles.calendarUpdateRow}>
            {addedToTodoist ? (
              <CheckIcon fontSize="large" sx={{ color: "white" }} />
            ) : (
              <ClipLoader color="white" />
            )}{" "}
            <div className="font-mono text-3xl">
              Marking Todoist task complete
            </div>
          </div>
        )}
        {addedToGoogleCalendar &&
          (!task || (task && !taskComplete) || addedToTodoist) && (
            <div className="font-mono text-3xl">
              Congratulations! You’ve completed your task.
            </div>
          )}
        {addedToGoogleCalendar &&
          (!task || (task && !taskComplete) || addedToTodoist) &&
          [
            { link: "/", text: "do another" },
            { link: "/insights", text: "show me insights" },
          ].map(({ link, text }) => (
            <div key={link} className="flex justify-center">
              <div className={`font-mono ${styles.todoistButton}`}>
                <Link href={link}>
                  <p className={styles.todoistButtonText}>{text}</p>
                </Link>
              </div>
            </div>
          ))}
      </div>
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
