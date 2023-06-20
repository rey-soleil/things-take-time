import { getTickMarks } from "utils/timeline";

export default function HorizontalTickMarks({
  minutesOnScreen,
}: {
  minutesOnScreen: number;
}) {
  const tickMarks = getTickMarks(Date.now(), minutesOnScreen);

  return (
    <>
      {tickMarks.map(({ milliseconds, label, percentFromEnd }, index) => {
        if (percentFromEnd < 5 || percentFromEnd > 95) return <></>;
        return (
          <div
            key={`tick-mark-${index}`}
            className="absolute flex h-7 flex-col items-center justify-center text-xs font-semibold text-gray-500 md:text-base"
            style={{
              right: `${percentFromEnd}%`,
            }}
          >
            <span className="relative left-1/2">{label}</span>
          </div>
        );
      })}
    </>
  );
}
