export const getPomodoroQueryKey = () => ["pomodoro"];
export const getPomodoroByIdQueryKey = (id: string) => ["pomodoro", id];
export const getTodayPomodoroStatsQueryKey = (date?: string) => [
  "pomodoro",
  "today-stats",
  ...(date ? [date] : []),
];
