import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
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

export default function ActivitiesFromLastNDays({
  taskDurationByDate,
}: StackedBarCharProps) {
  const [numDays, setNumDays] = useState(DEFAULT_NUM_DAYS);
  const [data, setData] = useState<any[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    // durationByTask: dict from task => its duration
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
    const data = Array(numDays);
    const tasks = new Set<string>();

    for (let i = 0; i < numDays; i++) {
      const date = new Date(Date.now() - i * MS_PER_DAY).toDateString();
      data[i] = {
        name: date,
      };
      taskDurationByDate[date] &&
        Object.keys(taskDurationByDate[date]).forEach((task) => {
          tasks.add(task);
          selectedTasks.add(task);
          (data[i] as any)[task] = taskDurationByDate[date][task];
        });
    }
    data.reverse();
    setData(data);
    setTasks(Array.from(tasks));
  }, [taskDurationByDate, numDays]);

  // console.log({ data });

  return (
    <div className="flex h-96 max-w-full flex-row">
      <div className="flex flex-col">
        <div>
          Show me the last{" "}
          <input
            type="number"
            value={numDays}
            onChange={({ target }) =>
              setNumDays(target.value as unknown as number)
            }
            min="1"
            max="30"
          />{" "}
          days
        </div>
        <FormGroup>
          {tasks.map((task) => (
            <FormControlLabel
              key={task}
              control={<Checkbox defaultChecked />}
              label={task}
              checked={selectedTasks.has(task)}
              onChange={() => {
                if (selectedTasks.has(task)) {
                  selectedTasks.delete(task);
                } else {
                  selectedTasks.add(task);
                }
                setSelectedTasks(new Set(selectedTasks));
              }}
            />
          ))}
          <hr></hr>
          <FormControlLabel
            key={"form_control_deselect"}
            control={<Checkbox />}
            label="deselect all"
            checked={selectedTasks.size === 0}
            onChange={() => {
              setSelectedTasks(new Set());
            }}
          />
          <FormControlLabel
            key={"form_control_select"}
            control={<Checkbox />}
            label="select all"
            checked={selectedTasks.size === tasks.length}
            onChange={() => {
              setSelectedTasks(new Set(tasks));
            }}
          />
        </FormGroup>
      </div>
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
            labelStyle={{ color: "black" }}
            formatter={(value) =>
              (value as number) > 60
                ? `${Math.floor((value as number) / 60)}h ${
                    (value as number) % 60
                  }m`
                : `${value}m`
            }
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
    </div>
  );
}
