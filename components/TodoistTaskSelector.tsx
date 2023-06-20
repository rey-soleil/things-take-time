import { Task } from "@doist/todoist-api-typescript";
import { Autocomplete, TextField } from "@mui/material";

export default function TodoistTaskSelector({
  tasks,
  setTaskName,
  setTask,
  startStopwatch,
}: {
  tasks: Task[];
  setTaskName: (taskName: string) => void;
  setTask: (task: Task | undefined) => void;
  startStopwatch: () => void;
}) {
  return (
    <Autocomplete
      freeSolo
      fullWidth
      renderInput={(params) => <TextField key={params.id} {...params} />}
      onInputChange={(_, value, reason) => {
        if (reason === "input") {
          setTask(undefined);
          setTaskName(value);
        }
      }}
      onChange={(event, value, reason) => {
        if (reason === "selectOption") {
          setTaskName("");
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
