import { convertTickMarkToLabel } from "utils/timeline";

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

  return (
    <div>
      <div className="text-xl font-bold">{summary}</div>
      <div className="text-base">
        {startLabel} - {endLabel}
      </div>
    </div>
  );
}
