import { getTickMarks } from "utils/timeline";

export default function TickMarks() {
  const tickMarks = getTickMarks(Date.now());

  return (
    <>
      {tickMarks.map(({ milliseconds, label, percentFromEnd }) => (
        <div
          key={milliseconds}
          className="absolute my-1 w-full bg-[#F2F2F2] text-center text-xs md:text-base"
          style={{
            bottom: `${percentFromEnd}%`,
          }}
        >
          {label}
        </div>
      ))}
    </>
  );
}
