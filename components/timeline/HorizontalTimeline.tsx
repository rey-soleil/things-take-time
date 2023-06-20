import { useState } from "react";
import { MINUTES_ON_SCREEN, getPercentFromEnd } from "utils/timeline";
import HorizontalTickMarks from "./HorizontalTickMarks";

export default function HorizontalTimeline({
  startTime,
}: {
  startTime: number | undefined;
}) {
  const [minutesOnScreen, setMinutesOnScreen] = useState(MINUTES_ON_SCREEN);

  if (
    startTime &&
    getPercentFromEnd(startTime, Date.now(), minutesOnScreen) > 75
  ) {
    setMinutesOnScreen(minutesOnScreen * 2);
  }

  return (
    <div className="h-7 w-screen bg-gray-300">
      <HorizontalTickMarks minutesOnScreen={minutesOnScreen} />
      {!startTime && (
        <div className="absolute right-1/2 h-9 w-1 bg-[#F2F2F2]"></div>
      )}
      {startTime && (
        <div
          className="absolute right-1/2 h-7 bg-green-500"
          style={{
            width: `${
              getPercentFromEnd(startTime, Date.now(), minutesOnScreen) - 50
            }%`,
          }}
        ></div>
      )}
    </div>
  );
}
