import { Autocomplete, TextField } from "@mui/material";
import { Task } from "utils/tasks";

export default function TodoistTaskSelector({
  tasks,
  setTask,
  startStopwatch,
}: {
  tasks: Task[];
  setTask: (task: Task) => void;
  startStopwatch: () => void;
}) {
  return (
    <Autocomplete
      freeSolo
      fullWidth
      renderInput={(params) => <TextField key={params.id} {...params} />}
      onInputChange={(_, value, reason) => {
        if (reason === "input") {
          setTask({ content: value });
        }
      }}
      onChange={(event, value, reason) => {
        if (reason === "selectOption") {
          setTask(value as Task);
          startStopwatch();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          startStopwatch();
        }
      }}
      options={tasks}
      getOptionLabel={(task) => {
        if (typeof task === "string") return task;
        return task.content;
      }}
    ></Autocomplete>
  );
}
