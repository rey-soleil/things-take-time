import { getTickMarks } from "utils/timeline";

export default function HorizontalTickMarks() {
  const tickMarks = getTickMarks(Date.now());

  return (
    <>
      {tickMarks.map(({ milliseconds, label, percentFromEnd }) => (
        <div
          key={milliseconds}
          className="absolute flex h-7 flex-col items-center justify-center text-xs font-semibold text-gray-500 md:text-base"
          style={{
            right: `${percentFromEnd}%`,
          }}
        >
          <span>{label}</span>
        </div>
      ))}
    </>
  );
}
