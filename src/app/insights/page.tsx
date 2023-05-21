"use client";

import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useMemo, useState } from "react";
import NumDaysSelector from "../components/insights/NumDaysSelector";
import RecentTasks from "../components/insights/RecentTasks";
import TaskChart from "../components/insights/TaskChart";
import TaskSelector from "../components/insights/TaskSelector";
import TimeLogged from "../components/insights/TimeLogged";
import { Task, convertToCluster, filterAndSortEvents } from "../utils";

const INITIAL_SELECTED_TASKS = 5;

/*
 * Insights is a page with multiple components giving users insights into their time management.
 */
export default function Insights() {
  // isLoading: whether we are currently fetching data
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // tasks: an array of tasks obtained by calling the Google Calendar API
  const [tasks, setTasks] = useState<Task[]>();

  // selectedNumDays: the number of days to show insights for
  const [selectedNumDays, setSelectedNumDays] = useState<number>(7);

  // clusteredTasks: map of tasks grouped by type
  // eg. clusteredTasks["code"] = { duration: 546, instances: Array(5)}
  const clusteredTasks = useMemo(() => convertToCluster(tasks), [tasks]);

  const taskLabels = useMemo(
    () =>
      Object.entries(clusteredTasks)
        .sort((a, b) => b[1].duration - a[1].duration)
        .map((a) => a[0]),
    [clusteredTasks]
  );
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (taskLabels.length > 0) {
      const sliceLength = Math.min(taskLabels.length, INITIAL_SELECTED_TASKS);
      setSelectedTasks(new Set(taskLabels.slice(0, sliceLength)));
    }
  }, [taskLabels]);

  // This is where we fetch Google Calendar events going back selectedNumDays.
  async function loadTasks() {
    setIsLoading(true);

    // timeMin is midnight on the start of the day selectedNumDays ago
    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() + 1 - selectedNumDays);
    timeMin.setHours(0, 0, 0, 0);

    const events = await fetch(
      `api/insights?timeMin=${timeMin.toISOString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    ).then((res) => res.json());
    setTasks(filterAndSortEvents(events));
    setIsLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, [selectedNumDays]);

  // TODO: implement a loading spinner
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="m-4 flex flex-col md:flex-row">
      <div className="flex flex-col md:p-4">
        <TaskSelector
          taskLabels={taskLabels}
          selectedTasks={selectedTasks}
          setSelectedTasks={setSelectedTasks}
        />
      </div>
      <div className="m-5 flex flex-col">
        <TimeLogged
          clusteredTasks={clusteredTasks}
          selectedTasks={selectedTasks}
        />
        <NumDaysSelector
          selectedNumDays={selectedNumDays}
          setSelectedNumDays={setSelectedNumDays}
        />
        <TaskChart tasks={tasks} selectedTasks={selectedTasks} />
        <RecentTasks tasks={tasks} clusteredTasks={clusteredTasks} />
      </div>
      <a
        className="absolute right-8 top-8"
        href="/"
        title="go back to homepage"
      >
        <CloseIcon />
      </a>
    </div>
  );
}
