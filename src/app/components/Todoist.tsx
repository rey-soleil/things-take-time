"use client";

import { Task, TodoistApi } from "@doist/todoist-api-typescript";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";
import styles from "../page.module.css";

const api = new TodoistApi(process.env.NEXT_PUBLIC_TODOIST_API_TOKEN!);

type TodoistTasksProps = {
  selectedTask: Task | undefined;
  setSelectedTask: (task: Task | undefined) => void;
};

export default function Todoist({
  selectedTask,
  setSelectedTask,
}: TodoistTasksProps) {
  const [tasks, setTasks] = useState<Task[]>();

  useEffect(() => {
    api.getTasks({ filter: "today" }).then((res) => setTasks(res));
  }, []);

  return (
    <div className={styles.todoistTasks}>
      {tasks?.map((task) => (
        <Chip
          size="large"
          sx={{ color: "white", fontSize: "20px" }}
          key={task.id}
          label={task.content}
          onClick={() => setSelectedTask(task)}
          variant={task.id === selectedTask?.id ? "filled" : "outlined"}
          color={task.id === selectedTask?.id ? "primary" : "default"}
        />
      ))}
    </div>
  );
}
