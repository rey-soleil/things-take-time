import { Autocomplete, TextField } from "@mui/material";
import { Task } from "utils/tasks";

function hasTime(task: Task) {
  return Boolean(task.due?.date?.includes("T"));
}

function isRoutine(task: Task) {
  return Boolean(task.due?.is_recurring && hasTime(task));
}

function dueTimestamp(task: Task) {
  if (!task.due?.date) return Number.POSITIVE_INFINITY;
  const timestamp = new Date(task.due.date).getTime();
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

function formatTime(task: Task) {
  if (!hasTime(task) || !task.due?.date) return undefined;
  const date = new Date(task.due.date);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TodoistTaskSelector({
  tasks,
  setTask,
  startStopwatch,
}: {
  tasks: Task[];
  setTask: (task: Task) => void;
  startStopwatch: () => void;
}) {
  const now = Date.now();

  function groupForTask(task: Task) {
    if (!isRoutine(task)) return "TASKS";
    return dueTimestamp(task) < now ? "EARLIER TODAY" : "ROUTINES";
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const groupRank = (task: Task) => {
      const group = groupForTask(task);
      if (group === "TASKS") return 0;
      if (group === "ROUTINES") return 1;
      return 2;
    };

    const groupDifference = groupRank(a) - groupRank(b);
    if (groupDifference !== 0) return groupDifference;

    if (!isRoutine(a) && !isRoutine(b)) {
      const priorityDifference = (b.priority ?? 1) - (a.priority ?? 1);
      if (priorityDifference !== 0) return priorityDifference;

      const dueDifference = dueTimestamp(a) - dueTimestamp(b);
      if (dueDifference !== 0) return dueDifference;

      return (a.day_order ?? 0) - (b.day_order ?? 0);
    }

    const dueDifference = dueTimestamp(a) - dueTimestamp(b);
    if (groupForTask(a) === "EARLIER TODAY") return -dueDifference;
    return dueDifference;
  });

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
      onChange={(_, value, reason) => {
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
      options={sortedTasks}
      groupBy={groupForTask}
      renderGroup={(params) => (
        <li key={params.key}>
          <div className="px-4 pb-1 pt-3 text-[11px] font-semibold tracking-[0.12em] text-black/45">
            {params.group}
          </div>
          <ul className="p-0">{params.children}</ul>
        </li>
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const earlier = groupForTask(option) === "EARLIER TODAY";
        const time = isRoutine(option) ? formatTime(option) : undefined;

        return (
          <li
            key={key}
            {...optionProps}
            className={`${optionProps.className ?? ""} flex justify-between gap-4 ${
              earlier ? "opacity-50" : ""
            }`}
          >
            <span className="min-w-0 truncate">{option.content}</span>
            {time && (
              <span className="shrink-0 text-sm tabular-nums text-black/45">
                {time}
              </span>
            )}
          </li>
        );
      }}
      getOptionLabel={(task) => {
        if (typeof task === "string") return task;
        return task.content;
      }}
    />
  );
}
