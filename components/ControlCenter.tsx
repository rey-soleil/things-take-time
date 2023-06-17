import { Task } from "@doist/todoist-api-typescript";
import { faCirclePlay, faCircleStop } from "@fortawesome/free-solid-svg-icons";
import CuteButton from "components/CuteButton";

/**
 * ControlCenter contains the buttons for starting, stopping, and resetting the
 * timer.
 * @returns
 */
export default function ControlCenter({
  startTime,
  taskName,
  task,
  startStopwatch,
  stopStopwatch,
}: {
  startTime: number | undefined;
  taskName: string;
  task: Task | undefined;
  startStopwatch: () => void;
  stopStopwatch: () => void;
}) {
  return (
    <div>
      {!startTime && (
        <CuteButton
          onClick={startStopwatch}
          icon={faCirclePlay}
          text="start"
          disabled={!(taskName || task)}
        />
      )}
      {startTime && (
        <CuteButton onClick={stopStopwatch} icon={faCircleStop} text="stop" />
      )}
    </div>
  );
}
