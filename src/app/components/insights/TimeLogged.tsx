import { ClusteredTasks, formatAsHourAndMinutes } from "@/app/utils";
import { useMemo } from "react";

type TimeLoggedProps = {
  clusteredTasks: ClusteredTasks;
};

export default function TimeLogged({ clusteredTasks }: TimeLoggedProps) {
  const timeLogged = useMemo(
    () =>
      Object.keys(clusteredTasks).reduce(
        (totalTime, task) => totalTime + clusteredTasks[task].duration,
        0
      ),
    [clusteredTasks]
  );

  return <div className="text-7xl">{formatAsHourAndMinutes(timeLogged)}</div>;
}
