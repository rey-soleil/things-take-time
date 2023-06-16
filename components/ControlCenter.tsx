import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import CuteButton from "components/CuteButton";

/**
 * ControlCenter contains the buttons for starting, stopping, and resetting the
 * timer.
 * @returns
 */
export default function ControlCenter({
  setStartTime,
}: {
  setStartTime: (startTime: number) => void;
}) {
  function startStopwatch() {
    setStartTime(Date.now());
  }

  return (
    <div>
      <CuteButton onClick={startStopwatch} icon={faCirclePlay} text="start" />
    </div>
  );
}
