"use client";

import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

type TaskSelectorProps = {
  taskLabels: string[];
  selectedTasks: Set<string>;
  setSelectedTasks: (tasks: Set<string>) => void;
};

export default function TaskSelector({
  taskLabels,
  selectedTasks,
  setSelectedTasks,
}: TaskSelectorProps) {
  return (
    <div className="hidden md:block">
      <h3 className="text-3xl">Tasks</h3>
      <FormGroup className="flex flex-row md:flex-col">
        {taskLabels.map((task) => (
          <FormControlLabel
            key={task}
            control={<Checkbox defaultChecked />}
            label={task}
            checked={selectedTasks.has(task)}
            onChange={() => {
              if (selectedTasks.has(task)) {
                selectedTasks.delete(task);
              } else {
                selectedTasks.add(task);
              }
              setSelectedTasks(new Set(selectedTasks));
            }}
          />
        ))}
        <hr></hr>
        <FormControlLabel
          key={"form_control_deselect"}
          control={<Checkbox />}
          label="deselect all"
          checked={selectedTasks.size === 0}
          onChange={() => {
            setSelectedTasks(new Set());
          }}
        />
        <FormControlLabel
          key={"form_control_select"}
          control={<Checkbox />}
          label="select all"
          checked={selectedTasks.size === taskLabels.length}
          onChange={() => {
            setSelectedTasks(new Set(taskLabels));
          }}
        />
      </FormGroup>
    </div>
  );
}
