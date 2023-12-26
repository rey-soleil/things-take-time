"use client";

import { TodoistApi } from "@doist/todoist-api-typescript";
import Stopwatch from "components/Stopwatch";
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
  const [milliseconds, setMilliseconds] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();

  const [tasks, setTasks] = useState<Task[]>();
  const [task, setTask] = useState<Task>({ content: "" });

  const [isTaskConfirmationDialogOpen, setIsTaskConfirmationDialogOpen] =
    useState(false);

  function startStopwatch() {
    const startTime = Date.now();
    setStartTime(startTime);
    const intervalId = setInterval(() => {
      setMilliseconds(Date.now() - startTime);
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
    setMilliseconds(0);
    clearInterval(intervalId!);
    setIntervalId(null);
    if (!task.id) setTask({ content: "" });
  }

  // If the user has a Todoist API token, fetch their tasks
  useEffect(() => {
    if (!session?.user?.todoistAPIToken) return;
    const todoistApi = new TodoistApi(session.user.todoistAPIToken);
    todoistApi.getTasks({ filter: "today" }).then((res) => setTasks(res));
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
      <TaskController
        startTime={startTime}
        tasks={tasks}
        task={task}
        setTask={setTask}
        startStopwatch={startStopwatch}
      />
      <Stopwatch milliseconds={milliseconds} />
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
