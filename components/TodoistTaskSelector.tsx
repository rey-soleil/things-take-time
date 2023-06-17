import { Task } from "@doist/todoist-api-typescript";
import { Autocomplete, TextField } from "@mui/material";

export default function TodoistTaskSelector({
  tasks,
  setTaskName,
  setTask,
}: {
  tasks: Task[];
  setTaskName: (taskName: string) => void;
  setTask: (task: Task | undefined) => void;
}) {
  return (
    <Autocomplete
      freeSolo
      fullWidth
      renderInput={(params) => (
        <TextField {...params} label="type out or select a task here" />
      )}
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
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          return;
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
