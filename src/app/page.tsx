"use client";

import Clock from "components/Clock";
import StopwatchButtons from "components/StopwatchButtons";
import TaskCompleteDialog from "components/TaskCompleteDialog";
import TaskController from "components/TaskController";
import NotionConnectionDialog from "components/NotionConnectionDialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { setCalendarIdInSession } from "utils/calendar";
import { logToGoogleCalendarAndToast } from "utils/task-logging";
import { Task, taskKey } from "utils/tasks";
import { NAVBAR_HEIGHT } from "./utils";

export default function Home() {
  const { data: session } = useSession({ required: true });
  const email = session?.user?.email;
  const router = useRouter();

  // TODO: clean up all the "| null | undefined" here
  const [startTime, setStartTime] = useState<number | undefined>();
  const [msElapsed, setMsElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState<ReturnType<
    typeof setInterval
  > | null>(null);

  // How long, in milliseconds, the user has set the timer for
  const [msUntilAlarm, setMsUntilAlarm] = useState<number>(0);

  const [tasksBySource, setTasksBySource] = useState<Record<string, Task[]>>(
    {}
  );
  const [sourceErrors, setSourceErrors] = useState<Record<string, string>>({});
  const [notionConfigured, setNotionConfigured] = useState(false);
  const [notionDataSourceId, setNotionDataSourceId] = useState<string>();
  const [suggestedNotionDatabase, setSuggestedNotionDatabase] =
    useState<string>();
  const [notionDialogOpen, setNotionDialogOpen] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [tasksLoading, setTasksLoading] = useState(false);
  const tasks = Object.values(tasksBySource).flat();
  const [task, setTask] = useState<Task>({ content: "" });

  const [isTaskConfirmationDialogOpen, setIsTaskConfirmationDialogOpen] =
    useState(false);

  function startStopwatch() {
    if (startTime) return;
    const startedAt = Date.now();
    setStartTime(startedAt);
    const intervalId = setInterval(() => {
      setMsElapsed(Date.now() - startedAt);
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
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
    if (!task.id) setTask({ content: "" });
  }

  useEffect(() => {
    if (!email) return;
    const controller = new AbortController();
    setTasksLoading(true);
    setSourceErrors({});
    Promise.allSettled(
      (["todoist", "notion"] as const).map(async (source) => {
        try {
          const response = await fetch(`/api/${source}/tasks`, {
            signal: controller.signal,
            cache: "no-store",
          });
          const body = await response.json();
          if (!response.ok)
            throw new Error(body.error || `${source} is unavailable`);
          if (controller.signal.aborted) return;
          setTasksBySource((current) => ({
            ...current,
            [source]: body.tasks.map((item: Task) => ({ ...item, source })),
          }));
          if (source === "notion") {
            setNotionConfigured(body.configured);
            setNotionDataSourceId(body.dataSourceId);
          }
        } catch (error) {
          if (controller.signal.aborted) return;
          setTasksBySource((current) => ({ ...current, [source]: [] }));
          setSourceErrors((current) => ({
            ...current,
            [source]:
              error instanceof Error
                ? error.message
                : `${source} is unavailable`,
          }));
        }
      })
    ).then(() => {
      if (!controller.signal.aborted) setTasksLoading(false);
    });
    return () => controller.abort();
  }, [email, refreshCount]);

  useEffect(() => {
    const database = new URLSearchParams(window.location.search).get(
      "notionDatabase"
    );
    if (database) {
      setSuggestedNotionDatabase(database);
      setNotionDialogOpen(true);
    }
  }, []);

  useEffect(() => {
    const refresh = () => setRefreshCount((count) => count + 1);
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

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
    <main className="flex h-full w-screen flex-col items-center justify-center space-y-8 px-5">
      <div className="flex w-full flex-col items-center gap-2">
        <TaskController
          startTime={startTime}
          tasks={tasks}
          task={task}
          setTask={setTask}
          startStopwatch={startStopwatch}
        />
        {!startTime && (
          <>
            <div className="flex gap-5 text-sm text-black/60">
              <button
                type="button"
                className="underline"
                onClick={() => setNotionDialogOpen(true)}
              >
                {notionConfigured ? "Notion settings" : "Connect Notion"}
              </button>
              <button
                type="button"
                className="underline disabled:opacity-50"
                disabled={tasksLoading}
                onClick={() => setRefreshCount((count) => count + 1)}
              >
                {tasksLoading ? "Refreshing…" : "Refresh tasks"}
              </button>
            </div>
            {Object.entries(sourceErrors).map(([source, error]) => (
              <p
                key={source}
                role="status"
                className="max-w-[700px] text-center text-sm text-red-700"
              >
                {source === "notion" ? "Notion" : "Todoist"}: {error}
              </p>
            ))}
          </>
        )}
      </div>
      <Clock
        startTime={startTime}
        msElapsed={msElapsed}
        msUntilAlarm={msUntilAlarm}
        setMsUntilAlarm={setMsUntilAlarm}
      />
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
        onCompleted={(completed) => {
          setTasksBySource((current) =>
            Object.fromEntries(
              Object.entries(current).map(([source, items]) => [
                source,
                items.filter((item) => taskKey(item) !== taskKey(completed)),
              ])
            )
          );
          setRefreshCount((count) => count + 1);
        }}
        isTaskConfirmationDialogOpen={isTaskConfirmationDialogOpen}
        setIsTaskConfirmationDialogOpen={setIsTaskConfirmationDialogOpen}
        session={session}
      />
      {notionDialogOpen && (
        <NotionConnectionDialog
          open
          configured={notionConfigured}
          dataSourceId={notionDataSourceId ?? suggestedNotionDatabase}
          onClose={() => setNotionDialogOpen(false)}
          onSaved={() => setRefreshCount((count) => count + 1)}
        />
      )}
      <Toaster
        position="bottom-right"
        containerStyle={{ marginBottom: NAVBAR_HEIGHT, zIndex: 1 }}
      />
    </main>
  );
}
