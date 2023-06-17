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
  startStopwatch,
  stopStopwatch,
}: {
  startTime: number | undefined;
  taskName: string;
  startStopwatch: () => void;
  stopStopwatch: () => void;
}) {
  return (
    <div>
      {!startTime && (
        <CuteButton onClick={startStopwatch} icon={faCirclePlay} text="start" disabled={taskName === ""} />
      )}
      {startTime && (
        <CuteButton onClick={stopStopwatch} icon={faCircleStop} text="stop" />
      )}
    </div>
  );
}
