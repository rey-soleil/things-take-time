"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import HeatMap from "../components/HeatMap";
import RecentTasks from "../components/RecentTasks";

/*
 * The Insights page allows the user to see when they tend to do each activity on their calendar.
 * Users select an activity from a dropdown, and the page displays a heatmap of when they tend to do that activity.
 */
export default function Insights() {
  const [activity, setActivity] = useState<string>("");

  if (typeof window === "undefined") return <div>Loading...</div>;

  // TODO: After the UI is implemented, think of how to efficiently
  // 1. Get events from /api/insights
  // 2. Group events by activity
  // 3. Convert each group of events to a heatmap
  const heatmaps = JSON.parse(window.localStorage.getItem("heatmaps") || "{}");

  // An array of activities sorted by descending frequency
  const activities: string[] = JSON.parse(
    window.localStorage.getItem("activities") || "[]"
  );

  console.log({ heatmaps, activities, activity });

  return (
    <div className="flex flex-col items-center m-6">
      <div className="items-center w-2/4">
        <FormControl fullWidth>
          <InputLabel>Activity</InputLabel>
          <Select
            value={activity}
            label="Activity"
            onChange={({ target }) => setActivity(target.value as string)}
            sx={{ backgroundColor: "white", margin: "1rem 0" }}
          >
            {activities.map((activity) => (
              <MenuItem key={activity} value={activity}>
                {activity}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {activity !== "" && (
          <HeatMap activity={activity} heatmap={heatmaps[activity]} />
        )}
        <RecentTasks />
      </div>
    </div>
  );
}
