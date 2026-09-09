"use client";

import Clock from "components/Clock";
import StopwatchButtons from "components/StopwatchButtons";
import TaskCompleteDialog from "components/TaskCompleteDialog";
import TaskController from "components/TaskController";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { setCalendarIdInSession } from "utils/calendar";
import { logToGoogleCalendarAndToast } from "utils/task-logging";
import { Task } from "utils/tasks";
import { NAVBAR_HEIGHT } from "./utils";

export default function Home() {
  const { data: session } = useSession({ required: true });
  const router = useRouter();

  // TODO: clean up all the "| null | undefined" here
  const [startTime, setStartTime] = useState<number | undefined>();
  const [msElapsed, setMsElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();

  // How long, in milliseconds, the user has set the timer for
  const [msUntilAlarm, setMsUntilAlarm] = useState<number>(0);

  const [tasks, setTasks] = useState<Task[]>();
  const [todoistError, setTodoistError] = useState<string>();
  const [task, setTask] = useState<Task>({ content: "" });

  const [isTaskConfirmationDialogOpen, setIsTaskConfirmationDialogOpen] =
    useState(false);

  function startStopwatch() {
    const startTime = Date.now();
    setStartTime(startTime);
    const intervalId = setInterval(() => {
      setMsElapsed(Date.now() - startTime);
    }, 1000);
    setIntervalId(intervalId);
  }

  function stopStopwatch() {
    task.id && setIsTaskConfirmationDialogOpen(true);
    logToGoogleCalendarAndToast(session, startTime, task);
    clearStopwatch();
  }

  function clearStopwatch() {
    setStartTime(undefined);
    setMsElapsed(0);
    setMsUntilAlarm(0);
    clearInterval(intervalId!);
    setIntervalId(null);
    if (!task.id) setTask({ content: "" });
  }

  useEffect(() => {
    if (!session) return;

    setTodoistError(undefined);
    fetch("/api/todoist/tasks")
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || "Todoist is unavailable");
        }
        return response.json();
      })
      .then(({ tasks }) => setTasks(tasks))
      .catch((error) => {
        console.error(error);
        setTasks(undefined);
        setTodoistError(error.message || "Todoist is unavailable");
      });
  }, [session]);

  useEffect(() => {
    if (!session || !session.user) return;
    setCalendarIdInSession(session).then(
      ({ needToRefresh }) => needToRefresh && router.refresh()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // This ensures that we clear the task when closing the "Did you complete..."
  // dialog
  useEffect(() => {
    if (!isTaskConfirmationDialogOpen) setTask({ content: "" });
  }, [isTaskConfirmationDialogOpen]);

  if (!session) return <></>;

  // TODO: save #F2F2F2 as a CSS variable
  return (
    <main className="flex w-screen flex-col items-center px-5 h-full justify-center space-y-8">
      <div className="flex w-full flex-col items-center gap-2">
        <TaskController
          startTime={startTime}
          tasks={tasks}
          task={task}
          setTask={setTask}
          startStopwatch={startStopwatch}
        />
        {todoistError && !startTime && (
          <p className="text-center font-mono text-sm">
            Todoist unavailable — using manual task entry.
          </p>
        )}
      </div>
      <Clock startTime={startTime} msElapsed={msElapsed} msUntilAlarm={msUntilAlarm} setMsUntilAlarm={setMsUntilAlarm} />
      <StopwatchButtons
        startTime={startTime}
        task={task}
        setTask={setTask}
        startStopwatch={startStopwatch}
        stopStopwatch={stopStopwatch}
        clearStopwatch={clearStopwatch}
      />
      <TaskCompleteDialog
        task={task}
        setTask={setTask}
        isTaskConfirmationDialogOpen={isTaskConfirmationDialogOpen}
        setIsTaskConfirmationDialogOpen={setIsTaskConfirmationDialogOpen}
        session={session}
      />
      <Toaster position="bottom-right" containerStyle={{ marginBottom: NAVBAR_HEIGHT, zIndex: 1 }} />
    </main>
  );
}
