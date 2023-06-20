import { Task } from "utils/tasks";
import EnterTaskName from "./EnterTaskName";
import TodoistTaskSelector from "./TodoistTaskSelector";

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
      <div className="w-fit max-w-[700px] rounded-full bg-[#0000FF] p-5 text-center text-4xl font-bold text-white">
        {task.content}
      </div>
    );
  }

  return (
    <div className="md:w-[700px] flex w-full justify-center">
      {!tasks && (
        <EnterTaskName
          task={task}
          setTask={setTask}
          startStopwatch={startStopwatch}
        />
      )}
      {tasks && (
        <TodoistTaskSelector
          tasks={tasks}
          setTask={setTask}
          startStopwatch={startStopwatch}
        />
      )}
    </div>
  );
}
