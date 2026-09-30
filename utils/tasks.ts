export type Task = {
  id?: string;
  source?: "todoist" | "notion";
  content: string;
  description?: string;
  url?: string;
  active?: boolean;
  estimatedMinutes?: number | null;
  priority?: number;
  day_order?: number;
  due?: {
    date: string;
    is_recurring: boolean;
    string: string;
    timezone?: string | null;
  } | null;
};

export function taskKey(task: Task) {
  return `${task.source ?? "todoist"}:${task.id ?? task.content}`;
}

export function taskSourceLabel(task: Task) {
  return task.source === "notion" ? "Notion" : "Todoist";
}
