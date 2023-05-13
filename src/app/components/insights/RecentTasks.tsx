"use client";
import { useState } from "react";
import {
  ClusteredTasks,
  Task,
  date,
  formatAsHourAndMinutes,
  getDuration,
} from "../../utils";
import GroupBySelector, { GroupBy } from "./GroupBySelector";

type RecentTasksProps = {
  tasks?: Task[];
  clusteredTasks: ClusteredTasks;
};

export default function RecentTasks({
  tasks,
  clusteredTasks,
}: RecentTasksProps) {
  const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.Date);

  return (
    <div className="flex flex-col items-start">
      <GroupBySelector groupBy={groupBy} setGroupBy={setGroupBy} />
      {groupBy === GroupBy.Date &&
        tasks?.map((task) => (
          <div key={task.start.dateTime}>
            <b>{task.summary}</b> ({formatAsHourAndMinutes(getDuration(task))} ,{" "}
            {date(task)})
          </div>
        ))}
      {groupBy === GroupBy.Task &&
        Object.entries(clusteredTasks)
          .sort((a, b) => b[1].duration - a[1].duration)
          .map(([task, { duration, instances }]) => (
            <div key={task} className="mb-5">
              <div className="text-3xl">
                {task} ({formatAsHourAndMinutes(duration)})
              </div>
              <ul>
                {instances.map((instance) => (
                  <li key={instance.start.dateTime} className="ml-6">
                    {instance.summary} (
                    {formatAsHourAndMinutes(getDuration(instance))},{" "}
                    {date(instance)})
                  </li>
                ))}
              </ul>
            </div>
          ))}
    </div>
  );
}
