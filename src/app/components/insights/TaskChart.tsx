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

type TaskChartProps = {
  tasks?: Task[];
  selectedTasks: Set<string>;
};

// TODO: rethink colors
const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

export default function TaskChart({ tasks, selectedTasks }: TaskChartProps) {
  const tasksByDate = useMemo(() => convertToTasksByDate(tasks), [tasks]);

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
