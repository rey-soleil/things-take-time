import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import CuteButton from "components/CuteButton";

/**
 * ControlCenter contains the buttons for starting, stopping, and resetting the
 * timer.
 * @returns
 */
export default function ControlCenter() {
  return (
    <div>
      <CuteButton onClick={() => {}} icon={faCirclePlay} text="start" />
    </div>
  );
}
