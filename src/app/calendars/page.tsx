"use client";

import { TodoistApi } from "@doist/todoist-api-typescript";
import CheckIcon from "@mui/icons-material/Check";
import { Roboto } from "next/font/google";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import styles from "../page.module.css";

const roboto = Roboto({ subsets: ["latin"], weight: "700" });
const api = new TodoistApi(process.env.NEXT_PUBLIC_TODOIST_API_TOKEN!);

export default function Calendars() {
  const [addedToGoogleCalendar, setAddedToGoogleCalendar] = useState(false);
  const [addedToTodoist, setAddedToTodoist] = useState(false);

  const searchParams = useSearchParams();

  let startTime: any = searchParams.get("startTime");
  let eventName: any = searchParams.get("eventName");
  let task: any = searchParams.get("task");

  if (eventName === "undefined") eventName = undefined;
  if (task === "undefined") task = undefined;
  if (task) task = JSON.parse(task);

  console.log({ startTime, eventName, task });

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
    task && task.id && (await api.closeTask(task.id));
    setAddedToTodoist(true);
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
          <h1 className={roboto.className}>Adding to Google Calendar</h1>
        </div>
        <div className={styles.calendarUpdateRow}>
          {addedToTodoist ? (
            <CheckIcon fontSize="large" sx={{ color: "white" }} />
          ) : (
            <ClipLoader color="white" />
          )}{" "}
          <h1 className={roboto.className}>Marking Todoist task complete</h1>
        </div>
        {addedToGoogleCalendar && addedToTodoist && (
          <h1 className={roboto.className}>
            Congratulations! You’ve completed your task.
          </h1>
        )}
        {addedToGoogleCalendar && addedToTodoist && (
          <div className={`${roboto.className} ${styles.todoistButton}`}>
            <Link href={`/`}>
              <p className={styles.todoistButtonText}>do another</p>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
