export type Task = {
  id?: string;
  content: string;
  description?: string;
  priority?: number;
  day_order?: number;
  due?: {
    date: string;
    is_recurring: boolean;
    string: string;
    timezone?: string | null;
  } | null;
};
