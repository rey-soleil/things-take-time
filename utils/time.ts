/**
 * Converts a time in milliseconds to a string in the format HH:MM:SS
 * @param milliseconds The time in milliseconds
 * @returns The formatted time
 */
export function formatAsHHMMSS(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const formattedHours = hours > 0 ? `${(hours % 24).toString()}:` : "";
  let formattedMinutes = `${(minutes % 60).toString()}`;
  if (hours > 0) formattedMinutes = formattedMinutes.padStart(2, "0");
  const formattedSeconds = `${(seconds % 60).toString().padStart(2, "0")}`;

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}
