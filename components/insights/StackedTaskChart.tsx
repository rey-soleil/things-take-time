import {
  Task,
  convertToTasksByDate,
  formatAsHourAndMinutes,
} from "@/app/utils";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colors } from "./TaskChart";

type TaskChartProps = {
  tasks?: Task[];
  selectedTasks: Set<string>;
};

export default function StackedTaskChart({
  tasks,
  selectedTasks,
}: TaskChartProps) {
  const tasksByDate = useMemo(() => convertToTasksByDate(tasks), [tasks]);

  console.log({ tasksByDate });

  return (
    <ResponsiveContainer width="100%" height={400} className="flex items-start">
      <BarChart data={tasksByDate}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis width={40} />
        <Tooltip
          labelStyle={{ color: "black" }}
          formatter={(value) => formatAsHourAndMinutes(Number(value))}
        />
        <Legend />
        {Array.from(selectedTasks).map((task, i) => (
          <Bar
            key={task}
            dataKey={task}
            stackId="a"
            fill={colors[i % colors.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
