import { Input } from "@mui/material";

/**
 * A component for inputting the task name. Eventually, we'll query Todoist
 * tasks and make this an Autocomplete with a freeSolo option.
 */
export default function EnterTaskName({
  taskName,
  setTaskName,
  startStopwatch,
}: {
  taskName: string;
  setTaskName: (taskName: string) => void;
  startStopwatch: () => void;
}) {
  return (
    <Input
      fullWidth
      onChange={({ target }) => setTaskName(target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          startStopwatch();
        }
      }}
      value={taskName}
      slotProps={{
        input: {
          className: "text-3xl text-center",
        },
      }}
    ></Input>
  );
}
