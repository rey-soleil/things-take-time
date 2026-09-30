import { Task } from "utils/tasks";
import EnterTaskName from "./EnterTaskName";
import TaskSelector from "./TaskSelector";

export default function TaskController({
  startTime,
  tasks,
  task,
  setTask,
  startStopwatch,
}: {
  startTime: number | undefined;
  tasks: Task[] | undefined;
  task: Task;
  setTask: (task: Task) => void;
  startStopwatch: () => void;
}) {
  if (startTime) {
    return (
      <div className="max-h-[120px] w-fit max-w-[700px] overflow-y-auto rounded-full bg-[#0000FF] p-5 text-center text-4xl font-bold text-white">
        {task.content}
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center md:w-[700px]">
      {!tasks && (
        <EnterTaskName
          task={task}
          setTask={setTask}
          startStopwatch={startStopwatch}
        />
      )}
      {tasks && (
        <TaskSelector
          tasks={tasks}
          task={task}
          setTask={setTask}
          startStopwatch={startStopwatch}
        />
      )}
    </div>
  );
}
