"use client";

import { Task, TodoistApi } from "@doist/todoist-api-typescript";
import Chip from "@mui/material/Chip";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "src/app/page.module.css";

type TodoistTasksProps = {
  selectedTask: Task | undefined;
  setSelectedTask: (task: Task | undefined) => void;
};

export default function Todoist({
  selectedTask,
  setSelectedTask,
}: TodoistTasksProps) {
  const [tasks, setTasks] = useState<Task[]>();
  const { data: session } = useSession({ required: true });

  useEffect(() => {
    if (!session?.user?.todoistAPIToken) return;
    const todoistApi = new TodoistApi(session.user.todoistAPIToken);
    todoistApi.getTasks({ filter: "today" }).then((res) => setTasks(res));
  }, [session]);

  return (
    <div className={styles.todoistTasks}>
      {tasks?.map((task) => (
        <Chip
          size="medium"
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
