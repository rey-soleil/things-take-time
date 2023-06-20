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
          disabled={task.content === ""}
          large={true}
        />
      )}
      {startTime && (
        <div className="flex items-center">
          <CuteButton onClick={clearStopwatch} icon={faRotateLeft} />
          <CuteButton
            onClick={stopStopwatch}
            icon={faCircleStop}
            large={true}
          />
          <CuteButton
            onClick={() => setIsDescriptionDialogOpen(true)}
            icon={faNoteSticky}
          />
        </div>
      )}
    </div>
  );
}
