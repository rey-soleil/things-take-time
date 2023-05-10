import { useEffect, useState } from "react";
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

type StackedBarCharProps = {
  // TODO: specify taskDurationByDate type
  taskDurationByDate: any;
};

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

const DEFAULT_NUM_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export default function ActivitiesFromLast7Days({
  taskDurationByDate,
}: StackedBarCharProps) {
  const [data, setData] = useState<any[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);

  useEffect(() => {
    // durationByTask: array of (activity, duration) pairs
    const durationByTask = {};
    Object.keys(taskDurationByDate).forEach((date) => {
      Object.keys(taskDurationByDate[date]).forEach((task) => {
        (durationByTask as any)[task] =
          ((durationByTask as any)[task] || 0) + taskDurationByDate[date][task];
      });
    });

    // mostCommonTasks: the 5 tasks with the most cumulative duration
    // const mostCommonTasks = Object.entries(durationByTask)
    //   .sort((a, b) => (a[1] as number) - (b[1] as number))
    //   .reverse()
    //   .map((a) => a[0])
    //   .slice(0, Math.min(5, Object.keys(durationByTask).length));
    // setMostCommonTasks(mostCommonTasks);

    // data: array of bar chart data for rechart
    // eg. data[0] = { "name": "Wed May 03 2023", "meditate": 66, "read": 91, "walk": 97}
    const data = Array(DEFAULT_NUM_DAYS);
    const tasks = new Set<string>();

    for (let i = 0; i < DEFAULT_NUM_DAYS; i++) {
      const date = new Date(Date.now() - i * MS_PER_DAY).toDateString();
      data[i] = {
        name: date,
      };
      taskDurationByDate[date] &&
        Object.keys(taskDurationByDate[date]).forEach((task) => {
          tasks.add(task);
          (data[i] as any)[task] = taskDurationByDate[date][task];
        });
    }
    data.reverse();
    setData(data);
    setTasks(Array.from(tasks));
  }, [taskDurationByDate]);

  console.log({ data });

  return (
    <div className="h-96 max-w-full">
      <ResponsiveContainer
        minWidth={350}
        minHeight={100}
        width="100%"
        height="100%"
      >
        <BarChart data={data}>
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
          {tasks.map((task, i) => (
            <Bar key={task} dataKey={task} stackId="a" fill={colors[i]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
