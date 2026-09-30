import { Autocomplete, TextField } from "@mui/material";
import { Task, taskKey, taskSourceLabel } from "utils/tasks";

function hasTime(task: Task) {
  return Boolean(task.due?.date?.includes("T"));
}

function isRoutine(task: Task) {
  return (
    task.source !== "notion" && Boolean(task.due?.is_recurring && hasTime(task))
  );
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

export default function TaskSelector({
  tasks,
  task,
  setTask,
  startStopwatch,
}: {
  tasks: Task[];
  task: Task;
  setTask: (task: Task) => void;
  startStopwatch: () => void;
}) {
  const now = Date.now();

  function groupForTask(task: Task) {
    if (task.source === "notion")
      return task.active ? "NOTION · ACTIVE" : "NOTION · OTHER TASKS";
    if (!isRoutine(task)) return "TASKS";
    return dueTimestamp(task) < now ? "EARLIER TODAY" : "ROUTINES";
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const groupRank = (task: Task) => {
      const group = groupForTask(task);
      if (group === "TASKS") return 0;
      if (group === "NOTION · ACTIVE") return 1;
      if (group === "ROUTINES") return 2;
      if (group === "EARLIER TODAY") return 3;
      return 4;
    };

    const groupDifference = groupRank(a) - groupRank(b);
    if (groupDifference !== 0) return groupDifference;

    if (!isRoutine(a) && !isRoutine(b)) {
      const priorityDifference = (b.priority ?? 1) - (a.priority ?? 1);
      if (priorityDifference !== 0) return priorityDifference;

      const dueDifference = dueTimestamp(a) - dueTimestamp(b);
      if (!Number.isNaN(dueDifference) && dueDifference !== 0)
        return dueDifference;

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
      value={task.id ? task : null}
      inputValue={task.content}
      isOptionEqualToValue={(option, value) =>
        taskKey(option) === taskKey(value)
      }
      getOptionKey={(option) =>
        typeof option === "string" ? option : taskKey(option)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="what will you take the time to do?"
          inputProps={{
            ...params.inputProps,
            "aria-label": "Choose a task or enter a name",
          }}
        />
      )}
      onInputChange={(_, value, reason) => {
        if (reason === "input" || reason === "clear") {
          setTask({ content: value });
        }
      }}
      onChange={(_, value) => {
        if (value && typeof value !== "string") {
          setTask(value);
          startStopwatch();
        } else if (typeof value === "string" && value.trim()) {
          setTask({ content: value });
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
            className={`${
              optionProps.className ?? ""
            } flex justify-between gap-4 ${earlier ? "opacity-50" : ""}`}
          >
            <span className="min-w-0 truncate">{option.content}</span>
            {option.source === "notion" && (
              <span className="shrink-0 text-xs text-black/50">
                {option.estimatedMinutes
                  ? `${option.estimatedMinutes} min · `
                  : ""}
                {option.due?.date
                  ? `due ${option.due.date.slice(0, 10)}`
                  : taskSourceLabel(option)}
              </span>
            )}
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
