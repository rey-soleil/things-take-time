import { GCalEvent } from "@/app/utils";
import { convertTickMarkToLabel } from "utils/timeline";

export function TaskTooltip({ event }: { event: GCalEvent }) {
  if (!event.start?.dateTime || !event.end?.dateTime)
    return <>{event.summary}</>;

  const startLabel = convertTickMarkToLabel(
    new Date(event.start?.dateTime).getTime()
  );

  const endLabel = convertTickMarkToLabel(
    new Date(event.end?.dateTime).getTime()
  );

  return (
    <div>
      <div className="text-xl font-bold">{event.summary}</div>
      <div className="text-base">
        {startLabel} - {endLabel}
      </div>
    </div>
  );
}
