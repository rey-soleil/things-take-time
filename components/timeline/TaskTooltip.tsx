import { formatAsHourAndMinutes } from "@/app/utils";
import {
  convertMillisecondsToMinutes,
  convertTickMarkToLabel,
} from "utils/timeline";

export function TaskTooltip({
  summary,
  startMilliseconds,
  endMilliseconds,
}: {
  summary: string;
  startMilliseconds: number;
  endMilliseconds: number;
}) {
  const startLabel = convertTickMarkToLabel(startMilliseconds);
  const endLabel = convertTickMarkToLabel(endMilliseconds);
  const duration = formatAsHourAndMinutes(
    Math.ceil(convertMillisecondsToMinutes(endMilliseconds - startMilliseconds))
  );

  return (
    <div>
      <div className="text-xl font-bold">
        {summary} ({duration})
      </div>
      <div className="text-base">
        {startLabel} - {endLabel}
      </div>
    </div>
  );
}
