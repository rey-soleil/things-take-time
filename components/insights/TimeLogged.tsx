import { ClusteredTasks, formatAsHourAndMinutes } from "@/app/utils";
import { useMemo } from "react";

type TimeLoggedProps = {
  clusteredTasks: ClusteredTasks;
  selectedTasks: Set<string>;
};

export default function TimeLogged({
  clusteredTasks,
  selectedTasks,
}: TimeLoggedProps) {
  const timeLogged = useMemo(
    () =>
      Array.from(selectedTasks).reduce(
        (totalTime, task) => totalTime + clusteredTasks[task]?.duration,
        0
      ),
    [clusteredTasks, selectedTasks]
  );

  return <div className="text-7xl">{formatAsHourAndMinutes(timeLogged)}</div>;
}
