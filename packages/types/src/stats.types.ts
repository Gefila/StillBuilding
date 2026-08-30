export interface ActivityDay {
  date: string; // "YYYY-MM-DD"
  day_of_week: number; // 1 (Mon) .. 7 (Sun)
  tasks_completed: number;
  pomodoro_sessions: number;
  focus_minutes: number;
  total_activities: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ActivitySummary {
  total_activities: number;
  total_tasks_completed: number;
  total_focus_minutes: number;
  most_productive_day?: string;
}

export interface ActivityHeatmapData {
  days: ActivityDay[];
  summary: ActivitySummary;
  start_date: string;
  end_date: string;
  weeks_count: number;
}
