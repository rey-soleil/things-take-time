import { Input } from "@mui/material";
import { Task } from "utils/tasks";

/**
 * A component for inputting the task name. Eventually, we'll query Todoist
 * tasks and make this an Autocomplete with a freeSolo option.
 */
export default function EnterTaskName({
  task,
  setTask,
  startStopwatch,
}: {
  task: Task;
  setTask: (task: Task) => void;
  startStopwatch: () => void;
}) {
  return (
    <Input
      fullWidth
      onChange={({ target }) => setTask({ ...task, content: target.value })}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          startStopwatch();
        }
      }}
      value={task.content}
      slotProps={{
        input: {
          className: "text-3xl text-center",
        },
      }}
    ></Input>
  );
}
