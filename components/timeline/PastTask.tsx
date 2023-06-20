import { GCalEvent } from "@/app/utils";
import { Tooltip } from "@mui/material";
import { TaskTooltip } from "components/timeline/TaskTooltip";
import { getPercentFromEnd } from "utils/timeline";

export default function PastTask({
  event,
  minutesOnScreen,
}: {
  event: GCalEvent;
  minutesOnScreen: number;
}) {
  if (!event.start?.dateTime || !event.end?.dateTime) return <></>;

  const startMilliseconds = new Date(event.start.dateTime).getTime();
  const endMilliseconds = new Date(event.end.dateTime).getTime();

  const leftPercent = getPercentFromEnd(
    startMilliseconds,
    Date.now(),
    minutesOnScreen
  );
  const rightPercent = getPercentFromEnd(
    endMilliseconds,
    Date.now(),
    minutesOnScreen
  );

  const width = leftPercent - rightPercent;

  return (
    <Tooltip
      title={
        <TaskTooltip
          summary={event.summary}
          startMilliseconds={startMilliseconds}
          endMilliseconds={endMilliseconds}
        />
      }
      placement="top"
    >
      <div
        className="absolute h-7 bg-green-500 opacity-80"
        style={{
          right: `${rightPercent}%`,
          width: `${width}%`,
        }}
      ></div>
    </Tooltip>
  );
}
