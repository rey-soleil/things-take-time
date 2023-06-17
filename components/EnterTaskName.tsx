import { Input } from "@mui/material";

/**
 * A component for inputting the task name. Eventually, we'll query Todoist
 * tasks and make this an Autocomplete with a freeSolo option.
 */
export default function EnterTaskName({
  taskName,
  setTaskName,
}: {
  taskName: string;
  setTaskName: (taskName: string) => void;
}) {
  return (
    <Input
      placeholder="enter a task here"
      onChange={({ target }) => setTaskName(target.value)}
      value={taskName}
      slotProps={{
        input: {
          className: "text-3xl text-center",
        },
      }}
    ></Input>
  );
}
