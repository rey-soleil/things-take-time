const HUE = 108;

/*
 * The HeatMap component is a vertical calendar representing how frequently events occur.
 * It accepts `heatmap`: an array of 96 numbers, each representing a 15 minute interval,
 * and renders a vertical calendar from 12 AM to 11:59 PM, where each 15 minute interval
 * has a color corresponding to the number of events that occur during that interval.
 */
export default function HeatMap({ heatmap }: { heatmap: number[] }) {
  const maxValue = Math.max(...heatmap);

  function convertNumOccurrencesToColoredDiv(
    numOccurrences: number,
    index: number
  ) {
    const height = (1 - numOccurrences / maxValue) * 100;
    const backgroundColor = `hsl(${HUE}, 100%, ${height}%)`;

    return <div className="h-1 w-40" style={{ backgroundColor }}></div>;
  }

  function convertIndexToTime(index: number) {
    return Math.floor(index / 4) % 12;
  }

  return (
    <div className="flex flex-col items-center bg-white">
      {heatmap.map((numOccurrences, index) => (
        <div key={index} className="flex flex-row">
          {index % 4 === 0 && (
            <div className="text-black">{convertIndexToTime(index)}</div>
          )}
          {convertNumOccurrencesToColoredDiv(numOccurrences, index)}
        </div>
      ))}
    </div>
  );
}
