"use client";

import { useEffect, useMemo, useState } from "react";
import NumDaysSelector from "../components/insights/NumDaysSelector";
import RecentTasks from "../components/insights/RecentTasks";
import TimeLogged from "../components/insights/TimeLogged";
import { Task, convertToCluster, filterAndSortEvents } from "../utils";

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

  // This is where we fetch Google Calendar events going back selectedNumDays.
  async function loadTasks() {
    setIsLoading(true);
    const events = await fetch(
      `api/insights?selectedNumDays=${selectedNumDays}`,
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="flex flex-col md:p-4">
        <NumDaysSelector
          selectedNumDays={selectedNumDays}
          setSelectedNumDays={setSelectedNumDays}
        />
        {/* TODO: implement TaskSelector */}
        {/* <TaskSelector /> */}
      </div>
      <div className="flex flex-col">
        <TimeLogged clusteredTasks={clusteredTasks} />
        <RecentTasks tasks={tasks} clusteredTasks={clusteredTasks} />
      </div>
    </div>
  );
}
