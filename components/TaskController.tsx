import { Task } from "@doist/todoist-api-typescript";
import EnterTaskName from "./EnterTaskName";
import TodoistTaskSelector from "./TodoistTaskSelector";

export default function TaskController({
  startTime,
  tasks,
  task,
  taskName,
  setTaskName,
  setTask,
  startStopwatch,
}: {
  startTime: number | undefined;
  tasks: Task[] | undefined;
  task: Task | undefined;
  taskName: string;
  setTaskName: (taskName: string) => void;
  setTask: (task: Task | undefined) => void;
  startStopwatch: () => void;
}) {
  if (startTime) {
    return (
      <div className="w-fit max-w-[700px] rounded-full bg-[#0000FF] p-5 text-center text-4xl font-bold text-white">
        {taskName || task?.content}
      </div>
    );
  }

  return (
    <div className="md:w-[700px] flex w-full justify-center">
      {!tasks && (
        <EnterTaskName
          taskName={taskName}
          setTaskName={setTaskName}
          startStopwatch={startStopwatch}
        />
      )}
      {tasks && (
        <TodoistTaskSelector
          tasks={tasks}
          setTaskName={setTaskName}
          setTask={setTask}
          startStopwatch={startStopwatch}
        />
      )}
    </div>
  );
}
