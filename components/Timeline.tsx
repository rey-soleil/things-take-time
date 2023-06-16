/**
 * Timeline is a vertical bar with a height equal to the seconds since the task
 * started. Longer term, I'd like it to contain all recently logged events.
 */
export default function Timeline({ milliseconds }: { milliseconds: number }) {
  // TODO: add a tooltip with event name and duration
  return (
    <div className="absolute bottom-1/2 left-0">
      <div
        className="w-5 bg-green-500"
        style={{ height: `${milliseconds / 1000}px` }}
      ></div>
    </div>
  );
}
