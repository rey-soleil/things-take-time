const HUE = 108;

/*
 * The HeatMap component is a vertical calendar representing how frequently events occur.
 * It accepts an array of 96 numbers, each representing a 15 minute interval,
 * and renders a vertical calendar with 96 rows, each representing a 15 minute interval.
 */
export default function HeatMap({ heatmap }: { heatmap: number[] }) {
  const maxValue = Math.max(...heatmap);

  function convertNumOccurrencesToColoredDiv(
    numOccurrences: number,
    index: number
  ) {
    const height = (1 - numOccurrences / maxValue) * 100;
    const backgroundColor = `hsl(${HUE}, 100%, ${height}%)`;

    return (
      <div key={index}>
        <div className="h-1 w-20" style={{ backgroundColor }}></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {heatmap.map((numOccurrences, index) =>
        convertNumOccurrencesToColoredDiv(numOccurrences, index)
      )}
    </div>
  );
}
