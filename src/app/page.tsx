"use client";

import { Task, TodoistApi } from "@doist/todoist-api-typescript";
import Stopwatch from "components/Stopwatch";
import StopwatchButtons from "components/StopwatchButtons";
import TaskCompleteDialog from "components/TaskCompleteDialog";
import TaskController from "components/TaskController";
import Timeline from "components/Timeline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { logToGoogleCalendarAndToast } from "utils/task-logging";

export default function Home() {
  const { data: session } = useSession();

  // TODO: clean up all the "| null | undefined" here
  const [startTime, setStartTime] = useState<number | undefined>();
  const [milliseconds, setMilliseconds] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();

  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState<Task[]>();
  const [task, setTask] = useState<Task>();

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
    task && setIsTaskConfirmationDialogOpen(true);
    logToGoogleCalendarAndToast(session, startTime, taskName, task);
    clearStopwatch();
  }

  function clearStopwatch() {
    setStartTime(undefined);
    setMilliseconds(0);
    clearInterval(intervalId!);
    setIntervalId(null);
  }

  // If the user has a Todoist API token, fetch their tasks
  useEffect(() => {
    if (!session?.user?.todoistAPIToken) return;
    const todoistApi = new TodoistApi(session.user.todoistAPIToken);
    todoistApi.getTasks({ filter: "today" }).then((res) => setTasks(res));
  }, [session]);

  // TODO: save #F2F2F2 as a CSS variable
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-[#F2F2F2] p-5">
      <Timeline milliseconds={milliseconds} />
      <TaskController
        startTime={startTime}
        tasks={tasks}
        task={task}
        taskName={taskName}
        setTaskName={setTaskName}
        setTask={setTask}
        startStopwatch={startStopwatch}
      />
      <Stopwatch milliseconds={milliseconds} />
      <StopwatchButtons
        startTime={startTime}
        taskName={taskName}
        task={task}
        startStopwatch={startStopwatch}
        stopStopwatch={stopStopwatch}
        clearStopwatch={clearStopwatch}
      />
      <Toaster position="bottom-right" />
      <TaskCompleteDialog
        task={task}
        isTaskConfirmationDialogOpen={isTaskConfirmationDialogOpen}
        setIsTaskConfirmationDialogOpen={setIsTaskConfirmationDialogOpen}
        session={session}
      />
    </main>
  );
}
