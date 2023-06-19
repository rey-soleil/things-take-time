// The only constraint on NUM_TICKMARKS is that it should be a multiple of 2.
const NUM_TICKMARKS = 4;
const MINUTES_ON_SCREEN = 60;

// Returns an array of NUM_TICKMARKS + 1 numbers, each of which is the
// millisecond value of a tick mark.
// (There are NUM_TICKMARKS + 1 tick marks because one will always be off-screen.)
function getTickMarksInMilliseconds(nowInMilliseconds: number) {
  const minutesBetweenTickMarks = MINUTES_ON_SCREEN / NUM_TICKMARKS;
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

function convertMinutesToMilliseconds(minutes: number) {
  return minutes * 60 * 1000;
}

function convertTickMarkToLabel(milliseconds: number) {
  return simplifyTimeString(new Date(milliseconds).toLocaleTimeString());
}

function simplifyTimeString(timeString: string) {
  return timeString.slice(0, 4) + timeString.slice(-2, -1).toLowerCase();
}

export function getPercentFromEnd(milliseconds: number, now: number) {
  const millisecondsOnScreen = convertMinutesToMilliseconds(MINUTES_ON_SCREEN);
  const end = now + millisecondsOnScreen / 2;
  return (100 * (end - milliseconds)) / millisecondsOnScreen;
}

// Returns an array of {milliseconds, label, percentFromEnd} objects.
export function getTickMarks(now: number) {
  return getTickMarksInMilliseconds(now).map((milliseconds) => {
    return {
      milliseconds,
      label: convertTickMarkToLabel(milliseconds),
      percentFromEnd: getPercentFromEnd(milliseconds, now),
    };
  });
}
