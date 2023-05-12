"use client";
import { useState } from "react";
import { Task, date, getDuration } from "../../utils";
import GroupBySelector, { GroupBy } from "./GroupBySelector";

type RecentTasksProps = {
  tasks?: Task[];
  clusteredTasks: {
    [key: string]: {
      duration: number;
      instances: Task[];
    };
  };
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
            <b>{task.summary}</b> ({getDuration(task)} min, {date(task)})
          </div>
        ))}
      {/* TODO: implement group by activity */}
    </div>
  );
}
