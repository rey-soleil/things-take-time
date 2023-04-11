/*
 * The HeatMap component is a vertical calendar representing how frequently events occur.
 * It accepts an array of 96 numbers, each representing a 15 minute interval,
 * and renders a vertical calendar with 96 rows, each representing a 15 minute interval.
 */
export default function HeatMap({ heatmap }: { heatmap: number[] }) {
  const maxValue = Math.max(...heatmap);
  console.log(heatmap, maxValue);

  return (
    <div>
      {heatmap.map((numOccurrences, index) => {
        const hue = 108;
        const backgroundColor = `hsl(${hue}, 0%, ${
          100 - (numOccurrences / maxValue) * 100
        }%)`;
        console.log({ backgroundColor });
        return (
          <div
            style={{
              height: "5px",
              width: "200px",
              backgroundColor,
            }}
            key={index}
          ></div>
        );
      })}
    </div>
  );
}
