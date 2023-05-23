import {
  Task,
  convertToTasksForASingleDay,
  formatAsHourAndMinutes,
} from "@/app/utils";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
export const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

export default function TaskChart({ tasks, selectedTasks }: TaskChartProps) {
  const tasksByDate = useMemo(
    () =>
      convertToTasksForASingleDay(tasks).map((bar, i) => ({
        ...bar,
        fill: colors[i % colors.length],
      })),
    [tasks]
  );

  return (
    <ResponsiveContainer width="100%" height={300} className="flex items-start">
      <BarChart data={tasksByDate}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="taskType" />
        <YAxis width={40} />
        <Tooltip
          labelStyle={{ color: "black" }}
          formatter={(value) => formatAsHourAndMinutes(Number(value))}
        />
        {/* <Legend /> */}
        <Bar dataKey="duration" fill={colors[0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
