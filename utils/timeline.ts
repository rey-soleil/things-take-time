// The only constraint on NUM_TICKMARKS is that it should be a multiple of 2.
const NUM_TICKMARKS = 4;
export const MINUTES_ON_SCREEN = 60;

// Returns an array of NUM_TICKMARKS + 1 numbers, each of which is the
// millisecond value of a tick mark.
// (There are NUM_TICKMARKS + 1 tick marks because one will always be off-screen.)
function getTickMarksInMilliseconds(
  nowInMilliseconds: number,
  minutesOnScreen: number
) {
  const minutesBetweenTickMarks = minutesOnScreen / NUM_TICKMARKS;
  const millisecondsBetweenTickMarks = convertMinutesToMilliseconds(
    minutesBetweenTickMarks
  );
  const closestTickMark =
    Math.round(nowInMilliseconds / millisecondsBetweenTickMarks) *
    millisecondsBetweenTickMarks;
  return populateMilliseconds(closestTickMark, millisecondsBetweenTickMarks);
}

function populateMilliseconds(
  closestTickMark: number,
  millisecondsBetweenTickMarks: number
) {
  const milliseconds = [];
  for (let i = 0; i < NUM_TICKMARKS + 1; i++) {
    const delta = i - NUM_TICKMARKS / 2;
    milliseconds.push(closestTickMark + delta * millisecondsBetweenTickMarks);
  }
  return milliseconds;
}

export function convertMinutesToMilliseconds(minutes: number) {
  return minutes * 60 * 1000;
}

function convertTickMarkToLabel(milliseconds: number) {
  return simplifyTimeString(new Date(milliseconds).toLocaleTimeString());
}

function simplifyTimeString(timeString: string) {
  const colonIndex = timeString.indexOf(":");
  const hourWithMinutes = timeString.slice(0, colonIndex + 3);
  const amOrPM = timeString.slice(-2, -1).toLowerCase();
  return hourWithMinutes + amOrPM;
}

export function getPercentFromEnd(
  milliseconds: number,
  now: number,
  minutesOnScreen: number
) {
  const millisecondsOnScreen = convertMinutesToMilliseconds(minutesOnScreen);
  const end = now + millisecondsOnScreen / 2;
  return (100 * (end - milliseconds)) / millisecondsOnScreen;
}

// Returns an array of {milliseconds, label, percentFromEnd} objects.
export function getTickMarks(now: number, minutesOnScreen: number) {
  return getTickMarksInMilliseconds(now, minutesOnScreen).map(
    (milliseconds) => {
      return {
        milliseconds,
        label: convertTickMarkToLabel(milliseconds),
        percentFromEnd: getPercentFromEnd(milliseconds, now, minutesOnScreen),
      };
    }
  );
}
