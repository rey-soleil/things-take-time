import { Task } from "@doist/todoist-api-typescript";
import {
  faCirclePlay,
  faCircleStop,
  faClock,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import CuteButton from "components/CuteButton";

/**
 * StopwatchButtons contains the buttons for starting, stopping, and clearing the
 * timer.
 * @returns
 */
export default function StopwatchButtons({
  startTime,
  taskName,
  task,
  startStopwatch,
  stopStopwatch,
  clearStopwatch,
}: {
  startTime: number | undefined;
  taskName: string;
  task: Task | undefined;
  startStopwatch: () => void;
  stopStopwatch: () => void;
  clearStopwatch: () => void;
}) {
  return (
    <div>
      {!startTime && (
        <CuteButton
          onClick={startStopwatch}
          icon={faCirclePlay}
          disabled={!(taskName || task)}
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
          <CuteButton onClick={() => {}} icon={faClock} />
        </div>
      )}
    </div>
  );
}
