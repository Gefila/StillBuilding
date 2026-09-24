import { supabase } from "../../config/supabase";
import { AppError } from "../../utils/AppError";
import { getLocalDateString } from "../../utils/date.utils";
import type {
  ActivityDay,
  ActivityHeatmapData,
  ActivitySummary,
} from "./stats.types";

export const statsService = {
  async getActivityHeatmap(
    userId: string,
    weeks = 16,
    timeZone = "Asia/Jakarta",
  ): Promise<ActivityHeatmapData> {
    const clampedWeeks = Math.max(4, Math.min(52, weeks));
    const now = new Date();

    // 1. Determine Monday of current week and the range (Monday-first: 1=Mon .. 7=Sun)
    const currentJsDay = now.getDay();
    const currentDayOfWeek = currentJsDay === 0 ? 7 : currentJsDay;
    const daysSinceMonday = currentDayOfWeek - 1;

    const currentMonday = new Date(now);
    currentMonday.setDate(now.getDate() - daysSinceMonday);
    currentMonday.setHours(0, 0, 0, 0);

    const startMonday = new Date(currentMonday);
    startMonday.setDate(currentMonday.getDate() - (clampedWeeks - 1) * 7);
    startMonday.setHours(0, 0, 0, 0);

    const endSunday = new Date(currentMonday);
    endSunday.setDate(currentMonday.getDate() + 6);
    endSunday.setHours(23, 59, 59, 999);

    const startDateStr = getLocalDateString(timeZone, startMonday);
    const endDateStr = getLocalDateString(timeZone, endSunday);

    // 2. Initialize map for all days in the range
    const daysMap = new Map<string, ActivityDay>();
    const totalDays = clampedWeeks * 7;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startMonday);
      d.setDate(startMonday.getDate() + i);
      const dateKey = getLocalDateString(timeZone, d);
      const jsDay = d.getDay();
      const dayOfWeek = jsDay === 0 ? 7 : jsDay;

      daysMap.set(dateKey, {
        date: dateKey,
        day_of_week: dayOfWeek,
        tasks_completed: 0,
        pomodoro_sessions: 0,
        focus_minutes: 0,
        total_activities: 0,
        level: 0,
      });
    }

    // 3. Query completed tasks in the range
    const { data: tasksData, error: tasksError } = await supabase
      .from("tasks")
      .select(
        `
        id,
        completed_at,
        project:projects!inner (
          user_id
        )
      `,
      )
      .eq("project.user_id", userId)
      .eq("status", "Done")
      .not("completed_at", "is", null)
      .gte("completed_at", startMonday.toISOString())
      .lte("completed_at", endSunday.toISOString());

    if (tasksError) {
      throw new AppError(
        `Failed to fetch task activities: ${tasksError.message}`,
        500,
      );
    }

    // 4. Query completed pomodoro sessions in the range
    const { data: sessionsData, error: sessionsError } = await supabase
      .from("pomodoro_sessions")
      .select(
        `
        id,
        duration,
        mode,
        completed,
        started_at,
        created_at,
        task:tasks!inner (
          project:projects!inner (
            user_id
          )
        )
      `,
      )
      .eq("task.project.user_id", userId)
      .eq("completed", true)
      .gte("started_at", startMonday.toISOString())
      .lte("started_at", endSunday.toISOString());

    if (sessionsError) {
      throw new AppError(
        `Failed to fetch pomodoro activities: ${sessionsError.message}`,
        500,
      );
    }

    // 5. Aggregate tasks into daysMap
    for (const task of tasksData || []) {
      if (task.completed_at) {
        const dateKey = getLocalDateString(
          timeZone,
          new Date(task.completed_at),
        );
        const entry = daysMap.get(dateKey);
        if (entry) {
          entry.tasks_completed += 1;
        }
      }
    }

    // 6. Aggregate pomodoro sessions into daysMap
    for (const session of sessionsData || []) {
      const sessionDate = session.started_at || session.created_at;
      if (sessionDate) {
        const dateKey = getLocalDateString(timeZone, new Date(sessionDate));
        const entry = daysMap.get(dateKey);
        if (entry) {
          entry.pomodoro_sessions += 1;
          const rawDuration = session.duration || 0;
          const mins = Math.round(rawDuration / 60);
          entry.focus_minutes += mins;
        }
      }
    }

    // 7. Calculate levels and summary statistics
    let totalActivities = 0;
    let totalTasksCompleted = 0;
    let totalFocusMinutes = 0;
    const weekdayActivityCounts: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
    };

    const days: ActivityDay[] = Array.from(daysMap.values()).map((day) => {
      const total = day.tasks_completed + day.pomodoro_sessions;
      day.total_activities = total;

      // PRD 3.7: Level 0 (0), Level 1 (1), Level 2 (2-3), Level 3 (4-5), Level 4 (6+)
      if (total === 0) {
        day.level = 0;
      } else if (total === 1) {
        day.level = 1;
      } else if (total >= 2 && total <= 3) {
        day.level = 2;
      } else if (total >= 4 && total <= 5) {
        day.level = 3;
      } else {
        day.level = 4;
      }

      totalActivities += total;
      totalTasksCompleted += day.tasks_completed;
      totalFocusMinutes += day.focus_minutes;
      weekdayActivityCounts[day.day_of_week] =
        (weekdayActivityCounts[day.day_of_week] || 0) + total;

      return day;
    });

    // Find most productive day of week
    let maxCount = -1;
    let bestDayNumber = 1;
    for (let dayNum = 1; dayNum <= 7; dayNum++) {
      const count = weekdayActivityCounts[dayNum] || 0;
      if (count > maxCount) {
        maxCount = count;
        bestDayNumber = dayNum;
      }
    }

    // Map 1..7 to Indonesian name (1=Senin, ..., 7=Minggu)
    const dayNames = [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
      "Minggu",
    ];
    const mostProductiveDay =
      maxCount > 0 ? dayNames[bestDayNumber - 1] : undefined;

    const summary: ActivitySummary = {
      total_activities: totalActivities,
      total_tasks_completed: totalTasksCompleted,
      total_focus_minutes: totalFocusMinutes,
      most_productive_day: mostProductiveDay,
    };

    return {
      days,
      summary,
      start_date: startDateStr,
      end_date: endDateStr,
      weeks_count: clampedWeeks,
    };
  },
};
