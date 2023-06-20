import { getTickMarks } from "utils/timeline";

export default function HorizontalTickMarks({
  minutesOnScreen,
}: {
  minutesOnScreen: number;
}) {
  const tickMarks = getTickMarks(Date.now(), minutesOnScreen);

  return (
    <>
      {tickMarks.map(({ milliseconds, label, percentFromEnd }) => {
        if (percentFromEnd < 0 || percentFromEnd > 100) return <></>;
        return (
          <div
            key={milliseconds}
            className="absolute flex h-7 flex-col items-center justify-center text-xs font-semibold text-gray-500 md:text-base"
            style={{
              right: `${percentFromEnd}%`,
            }}
          >
            <span>{label}</span>
          </div>
        );
      })}
    </>
  );
}
