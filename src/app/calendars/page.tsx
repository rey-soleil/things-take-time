"use client";

import { TodoistApi } from "@doist/todoist-api-typescript";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { ClipLoader } from "react-spinners";
import styles from "../page.module.css";

const api = new TodoistApi(process.env.NEXT_PUBLIC_TODOIST_API_TOKEN!);

export default function Calendars() {
  const { data: session } = useSession({ required: true });

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

  const calendarId = session?.user?.calendarId ?? null;

  async function createEvent() {
    const body = JSON.stringify({
      startTime: Number(startTime),
      eventName: eventName ? eventName : task ? task.content : "",
      calendarId,
    });
    const response = await fetch("/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    // TODO: if response returns an error, fail gracefully
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
          Your calendar id: {calendarId}{" "}
          <CopyToClipboard text={calendarId}>
            <button>
              <ContentCopyIcon />
            </button>
          </CopyToClipboard>
        </div>
      )}
    </main>
  );
}
