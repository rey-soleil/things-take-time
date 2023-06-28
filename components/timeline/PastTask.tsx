import { Tooltip } from "@mui/material";
import { TaskTooltip } from "components/timeline/TaskTooltip";
import { getPercentFromEnd } from "utils/timeline";

export default function PastTask({
  summary,
  startTime,
  endTime,
  minutesOnScreen,
}: {
  summary: string,
  startTime: string | number,
  endTime?: string,
  minutesOnScreen: number;
}) {
  if (!startTime) return <></>;

  const startMilliseconds = new Date(startTime).getTime();

  const leftPercent = getPercentFromEnd(
    startMilliseconds,
    Date.now(),
    minutesOnScreen
  );

  let rightPercent = 50;
  let endMilliseconds = Date.now();

  if (endTime) {
    endMilliseconds = new Date(endTime).getTime();

    rightPercent = getPercentFromEnd(
      endMilliseconds,
      Date.now(),
      minutesOnScreen
    );
  }

  const width = leftPercent - rightPercent;

  return (
    <Tooltip
      title={
        <TaskTooltip
          summary={summary}
          startMilliseconds={startMilliseconds}
          endMilliseconds={endMilliseconds}
        />
      }
      placement="top"
      enterTouchDelay={0}
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
