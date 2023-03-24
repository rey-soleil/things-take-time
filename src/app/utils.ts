export function formatAsString(time: number) {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    let timeString =
      hours > 0 ? `${(hours % 24).toString().padStart(2, "0")}:` : "";
    return timeString.concat(
      `${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60)
        .toString()
        .padStart(2, "0")}`
    );
  }