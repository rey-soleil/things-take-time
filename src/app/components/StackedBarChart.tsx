import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StackedBarCharProps = {
  taskDurationByDate: any;
};

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

const DEFAULT_NUM_DAYS = 7;

export default function StackedBarChart({
  taskDurationByDate,
}: StackedBarCharProps) {
  const [data, setData] = useState<any[]>([]);
  const [mostCommonTasks, setMostCommonTasks] = useState<string[]>([]);

  useEffect(() => {
    const durationByTask = {};
    Object.keys(taskDurationByDate).forEach((date) => {
      Object.keys(taskDurationByDate[date]).forEach((task) => {
        (durationByTask as any)[task] =
          ((durationByTask as any)[task] || 0) + taskDurationByDate[date][task];
      });
    });
    const mostCommonTasks = Object.entries(durationByTask)
      .sort((a, b) => (a[1] as number) - (b[1] as number))
      .reverse()
      .map((a) => a[0])
      .slice(0, Math.min(5, Object.keys(durationByTask).length));
    setMostCommonTasks(mostCommonTasks);
    console.log({ taskDurationByDate, durationByTask, mostCommonTasks });

    const data = Array(DEFAULT_NUM_DAYS);
    for (let i = 0; i < DEFAULT_NUM_DAYS; i++) {
      const date = new Date(
        Date.now() - i * 24 * 60 * 60 * 1000
      ).toDateString();
      data[i] = {
        name: date,
      };
      mostCommonTasks.forEach((task) => {
        (data[i] as any)[task] = taskDurationByDate[date][task];
      });
    }
    data.reverse();
    setData(data);

    console.log({ data });
  }, [taskDurationByDate]);

  return (
    <>
      {/* <ResponsiveContainer width={500} height={300}> */}
      <BarChart width={1000} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value) =>
            (value as number) > 60
              ? `${Math.floor((value as number) / 60)}h ${
                  (value as number) % 60
                }m`
              : `${value}m`
          }
        />
        <Legend />
        {mostCommonTasks.map((task, i) => (
          <Bar key={task} dataKey={task} stackId="a" fill={colors[i]} />
        ))}
      </BarChart>
      {/* </ResponsiveContainer> */}
    </>
  );
}
