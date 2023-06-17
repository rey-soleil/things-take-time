import { formatAsHHMMSS } from "utils/time";

export default function Stopwatch({ milliseconds }: { milliseconds: number }) {
  // TODO: add style
  return (
    <div className="my-10 font-mono text-8xl font-medium">
      {formatAsHHMMSS(milliseconds)}
    </div>
  );
}
