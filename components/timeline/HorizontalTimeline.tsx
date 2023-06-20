import { GCalEvent } from "@/app/utils";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { getRecentCalendarEvents } from "utils/calendar";
import { MINUTES_ON_SCREEN, getPercentFromEnd } from "utils/timeline";
import HorizontalTickMarks from "./HorizontalTickMarks";
import PastTask from "./PastTask";

export default function HorizontalTimeline({
  session,
  startTime,
}: {
  session: Session;
  startTime: number | undefined;
}) {
  const [minutesOnScreen, setMinutesOnScreen] = useState(MINUTES_ON_SCREEN);
  const [events, setEvents] = useState<GCalEvent[]>();

  if (
    startTime &&
    getPercentFromEnd(startTime, Date.now(), minutesOnScreen) > 75
  ) {
    setMinutesOnScreen(minutesOnScreen * 2);
  }

  useEffect(() => {
    if (!session.user.calendarId) return;
    getRecentCalendarEvents(
      session.user.calendarId,
      Date.now(),
      minutesOnScreen
    ).then((events) => setEvents(events));
  }, [minutesOnScreen, startTime]);

  return (
    <div className="h-7 w-screen bg-gray-300">
      <HorizontalTickMarks minutesOnScreen={minutesOnScreen} />
      {/* This is the vertical bar that distinguishes the present */}
      {!startTime && (
        <div className="absolute right-1/2 h-9 w-1 bg-[#F2F2F2]"></div>
      )}
      {/* This is the bar for the current task that starts at the center and moves left */}
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
      {/* This is all past events in the current window */}
      {events?.map((event, index) => (
        <div key={index}>
          <PastTask event={event} minutesOnScreen={minutesOnScreen} />
        </div>
      ))}
    </div>
  );
}
