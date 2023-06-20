"use client";

import { TodoistApi } from "@doist/todoist-api-typescript";
import Stopwatch from "components/Stopwatch";
import StopwatchButtons from "components/StopwatchButtons";
import TaskCompleteDialog from "components/TaskCompleteDialog";
import TaskController from "components/TaskController";
import HorizontalTimeline from "components/timeline/HorizontalTimeline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { logToGoogleCalendarAndToast } from "utils/task-logging";
import { Task } from "utils/tasks";

export default function Home() {
  const { data: session } = useSession({ required: true });

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

  // This ensures that we clear the task when closing the "Did you complete..."
  // dialog
  useEffect(() => {
    if (!isTaskConfirmationDialogOpen) setTask({ content: "" });
  }, [isTaskConfirmationDialogOpen]);

  // TODO: save #F2F2F2 as a CSS variable
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-[#F2F2F2] p-5">
      {/* <VerticalTimeline startTime={startTime} /> */}
      <TaskController
        startTime={startTime}
        tasks={tasks}
        task={task}
        setTask={setTask}
        startStopwatch={startStopwatch}
      />
      <Stopwatch milliseconds={milliseconds} />
      <HorizontalTimeline startTime={startTime} />
      <StopwatchButtons
        startTime={startTime}
        task={task}
        setTask={setTask}
        startStopwatch={startStopwatch}
        stopStopwatch={stopStopwatch}
        clearStopwatch={clearStopwatch}
      />
      <Toaster position="bottom-right" />
      <TaskCompleteDialog
        task={task}
        setTask={setTask}
        isTaskConfirmationDialogOpen={isTaskConfirmationDialogOpen}
        setIsTaskConfirmationDialogOpen={setIsTaskConfirmationDialogOpen}
        session={session}
      />
    </main>
  );
}
