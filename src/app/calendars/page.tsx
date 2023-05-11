"use client";

import { TodoistApi } from "@doist/todoist-api-typescript";
import CheckIcon from "@mui/icons-material/Check";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import styles from "../page.module.css";

const api = new TodoistApi(process.env.NEXT_PUBLIC_TODOIST_API_TOKEN!);

export default function Calendars() {
  const [addedToGoogleCalendar, setAddedToGoogleCalendar] = useState(false);
  const [addedToTodoist, setAddedToTodoist] = useState(false);

  const searchParams = useSearchParams();

  let startTime: any = searchParams.get("startTime");
  let eventName: any = searchParams.get("eventName");
  let task: any = searchParams.get("task");
  let taskComplete: any = JSON.parse(
    searchParams.get("taskComplete") || "false"
  );

  if (eventName === "undefined") eventName = undefined;
  if (task === "undefined") task = undefined;
  if (task) task = JSON.parse(task);

  // console.log({ startTime, eventName, task, taskComplete });

  async function createEvent() {
    const body = JSON.stringify({
      startTime: Number(startTime),
      eventName: eventName ? eventName : task ? task.content : "",
    });
    // console.log({ body });
    const response = await fetch("/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    setAddedToGoogleCalendar(true);
    // console.log(
    //   "Attempted to create Google Calendar event. Response is ",
    //   response
    // );
    if (task && task.id && taskComplete) {
      await api.closeTask(task.id);
      setAddedToTodoist(true);
    }
  }

  useEffect(() => {
    createEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <div className="text-3xl font-mono">Adding to Google Calendar</div>
        </div>
        {task && taskComplete && (
          <div className={styles.calendarUpdateRow}>
            {addedToTodoist ? (
              <CheckIcon fontSize="large" sx={{ color: "white" }} />
            ) : (
              <ClipLoader color="white" />
            )}{" "}
            <div className="text-3xl font-mono">
              Marking Todoist task complete
            </div>
          </div>
        )}
        {addedToGoogleCalendar &&
          (!task || (task && !taskComplete) || addedToTodoist) && (
            <div className="text-3xl font-mono">
              Congratulations! You’ve completed your task.
            </div>
          )}
        {addedToGoogleCalendar &&
          (!task || (task && !taskComplete) || addedToTodoist) &&
          [
            { link: "/", text: "do another" },
            { link: "/insights", text: "show me insights" },
          ].map(({ link, text }) => (
            <div className={`font-mono ${styles.todoistButton}`} key={link}>
              <Link href={link}>
                <p className={styles.todoistButtonText}>{text}</p>
              </Link>
            </div>
          ))}
      </div>
    </main>
  );
}
