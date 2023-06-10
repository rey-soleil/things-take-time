type HeatMapProps = {
  heatmap: number[];
  activity: string;
};
/*
 * The HeatMap component is a vertical calendar representing how frequently events occur.
 * It accepts `heatmap`: an array of 96 numbers, each representing a 15 minute interval,
 * and renders a vertical calendar from 12 AM to 11:59 PM, where each 15 minute interval
 * has a color corresponding to the number of events that occur during that interval.
 */
export default function HeatMap({ heatmap, activity }: HeatMapProps) {
  // heatmapByHour is an array of 24 arrays, each representing an hour of the day
  const heatmapByHour = heatmap.reduce((acc, curr, index) => {
    if (index % 4 === 0) {
      acc.push([curr]);
    } else {
      acc[acc.length - 1].push(curr);
    }
    return acc;
  }, [] as number[][]);

  function convertIndexToTime(index: number) {
    if (index < 12) return `${index === 0 ? 12 : index} AM`;
    return `${index === 12 ? 12 : index - 12} PM`;
  }

  return (
    <div>
      <h2 className="text-lg">
        This is when you tend to <b>{activity}</b>:
      </h2>
      <div>
        {heatmapByHour.map((hour, index) => (
          <div key={index} className="flex flex-row justify-center mb-1">
            <div className="text-white">{convertIndexToTime(index)}</div>
            <div className="flex flex-col">
              {hour.map((numOccurrences, index) => {
                const height = (1 - numOccurrences / 10) * 100;
                const backgroundColor = `hsl(108, 100%, ${height}%)`;
                return (
                  <div
                    key={index}
                    className="h-1 w-20"
                    style={{ backgroundColor }}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
