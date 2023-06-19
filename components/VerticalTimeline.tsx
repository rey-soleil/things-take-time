import { getPercentFromEnd } from "utils/timeline";
import TickMarks from "./TickMarks";

// The present moment is in the middle of the screen.
// As time advances, objects on the vertical timeline move upward.
export default function VerticalTimeline({
  startTime,
}: {
  startTime: number | undefined;
}) {
  return (
    <div className="md:left-[20%] absolute left-0 h-screen w-10 bg-gray-200 md:w-12">
      <TickMarks />
      {startTime && (
        <div
          className="absolute bottom-1/2 w-full bg-green-500 opacity-75"
          style={{
            height: `${getPercentFromEnd(startTime, Date.now()) - 50}%`,
          }}
        ></div>
      )}
    </div>
  );
}
