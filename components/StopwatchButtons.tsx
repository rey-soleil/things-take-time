import { faNoteSticky } from "@fortawesome/free-regular-svg-icons";
import {
  faCirclePlay,
  faCircleStop,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import CuteButton from "components/CuteButton";
import { useState } from "react";
import { Task } from "utils/tasks";
import DescriptionDialog from "./DescriptionDialog";

/**
 * StopwatchButtons contains the buttons for starting, stopping, and clearing the
 * timer.
 * @returns
 */
export default function StopwatchButtons({
  startTime,
  task,
  setTask,
  startStopwatch,
  stopStopwatch,
  clearStopwatch,
}: {
  startTime: number | undefined;
  task: Task;
  setTask: (task: Task) => void;
  startStopwatch: () => void;
  stopStopwatch: () => void;
  clearStopwatch: () => void;
}) {
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);

  return (
    <div>
      {!startTime && (
        <CuteButton
          onClick={startStopwatch}
          icon={faCirclePlay}
          title="Start the stopwatch"
          disabled={task.content === ""}
          large={true}
        />
      )}
      {startTime && (
        <div className="flex items-center">
          <CuteButton
            onClick={clearStopwatch}
            icon={faRotateLeft}
            title="Clear the stopwatch"
          />
          <CuteButton
            onClick={stopStopwatch}
            icon={faCircleStop}
            title="Stop the stopwatch and log the task"
            large={true}
          />
          <CuteButton
            onClick={() => setIsDescriptionDialogOpen(true)}
            icon={faNoteSticky}
            title="Add description to the task"
          />
        </div>
      )}
      <DescriptionDialog
        isDescriptionDialogOpen={isDescriptionDialogOpen}
        setIsDescriptionDialogOpen={setIsDescriptionDialogOpen}
        task={task}
        setTask={setTask}
      />
    </div>
  );
}
