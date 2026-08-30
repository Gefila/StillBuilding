import { supabase } from "../../config/supabase";
import { AppError } from "../../utils/AppError";
import {
  getLocalDateString,
  getYesterdayLocalDateString,
} from "../../utils/date.utils";
import { sortTasks } from "../../utils/taskSorter";
import type { CreateTaskDTO, Task, UpdateTaskDTO } from "./task.types";

const TABLE = "tasks";

async function evaluateUserStreak(
  userId: string,
  timeZone = "Asia/Jakarta",
): Promise<void> {
  try {
    const todayStr = getLocalDateString(timeZone, new Date());
    const yesterdayStr = getYesterdayLocalDateString(timeZone, new Date());

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("current_strike, longest_streak, last_streak_date")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return;
    }

    const lastStreakDate = profile.last_streak_date as string | null;
    let currentStreak = profile.current_strike || 0;
    let longestStreak = profile.longest_streak || 0;

    // Case 1: Already recorded today -> no-op
    if (lastStreakDate === todayStr) {
      return;
    }

    // Case 2: Consecutive streak from yesterday
    if (lastStreakDate === yesterdayStr) {
      currentStreak += 1;
    } else {
      // Case 3: Broken streak or first time completion
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    await supabase
      .from("profiles")
      .update({
        current_strike: currentStreak,
        longest_streak: longestStreak,
        last_streak_date: todayStr,
      })
      .eq("id", userId);
  } catch (err) {
    console.error("Failed to evaluate user streak:", err);
  }
}

export const taskService = {
  async getAll(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select(
        `*,
				project: projects!inner (
					*
				)
			`,
      )
      .eq("projects.user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch tasks: ${error.message}`, 500);
    }

    return sortTasks((data || []) as Task[]);
  },

  async getById(id: string, userId: string): Promise<Task> {
    const { data, error } = await supabase
      .from(TABLE)
      .select(
        `*,
				project: projects!inner (*),
				pomodoro_sessions: pomodoro_sessions(*)
			`,
      )
      .eq("id", id)
      .eq("projects.user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new AppError(`Task with id ${id} not found`, 404);
      }
      throw new AppError(
        `Failed to fetch task with id ${id}: ${error.message}`,
        500,
      );
    }
    if (!data) {
      throw new AppError(`Task with id ${id} not found`, 404);
    }
    return data as Task;
  },

  async create(
    task: CreateTaskDTO,
    userId: string,
    timeZone = "Asia/Jakarta",
  ): Promise<Task> {
    if (!task.project_id) {
      throw new AppError("Proyek wajib dipilih", 400);
    }

    // Verifikasi bahwa project milik user yang bersangkutan
    const { data: project, error: projError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", task.project_id)
      .eq("user_id", userId)
      .single();

    if (projError || !project) {
      throw new AppError("Project not found or unauthorized", 404);
    }

    // Single Active Task Rule: jika task berstatus "Active", demote task aktif lainnya milik user menjadi "Pending"
    if (task.status === "Active") {
      const { data: userProjects } = await supabase
        .from("projects")
        .select("id")
        .eq("user_id", userId);

      if (userProjects && userProjects.length > 0) {
        const projectIds = userProjects.map((p) => p.id);
        await supabase
          .from(TABLE)
          .update({ status: "Pending" })
          .in("project_id", projectIds)
          .eq("status", "Active");
      }
    }

    const { data, error } = await supabase
      .from(TABLE)
      .insert(task)
      .select(
        `*,
				project: projects (
					*
				)
			`,
      )
      .single();

    if (error) {
      throw new AppError(`Failed to create task: ${error.message}`, 500);
    }

    if (task.status === "Done") {
      await evaluateUserStreak(userId, timeZone);
    }

    return data as Task;
  },

  async update(
    id: string,
    userId: string,
    task: UpdateTaskDTO,
    timeZone = "Asia/Jakarta",
  ): Promise<Task> {
    // 1. Verifikasi kepemilikan task sebelum update
    await taskService.getById(id, userId);

    // 2. Jika project_id diubah, verifikasi kepemilikan project tujuan
    if (task.project_id) {
      const { data: project, error: projError } = await supabase
        .from("projects")
        .select("id")
        .eq("id", task.project_id)
        .eq("user_id", userId)
        .single();

      if (projError || !project) {
        throw new AppError("Target project not found or unauthorized", 404);
      }
    }

    // 3. Single Active Task Rule: jika status diubah ke "Active", demote task aktif lainnya milik user menjadi "Pending"
    if (task.status === "Active") {
      const { data: userProjects } = await supabase
        .from("projects")
        .select("id")
        .eq("user_id", userId);

      if (userProjects && userProjects.length > 0) {
        const projectIds = userProjects.map((p) => p.id);
        await supabase
          .from(TABLE)
          .update({ status: "Pending" })
          .in("project_id", projectIds)
          .eq("status", "Active")
          .neq("id", id);
      }
    }

    const { data, error } = await supabase
      .from(TABLE)
      .update(task)
      .eq("id", id)
      .select(
        `*,
				project: projects (
					*
				)
			`,
      )
      .single();

    if (error) {
      throw new AppError(
        `Failed to update task with id ${id}: ${error.message}`,
        500,
      );
    }
    if (!data) {
      throw new AppError(`Task with id ${id} not found`, 404);
    }

    // 4. Evaluasi streak harian jika status diubah menjadi "Done"
    if (task.status === "Done") {
      await evaluateUserStreak(userId, timeZone);
    }

    return data as Task;
  },

  async delete(id: string, userId: string): Promise<Task> {
    // 1. Verifikasi kepemilikan task sebelum delete
    await taskService.getById(id, userId);

    const { data, error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id)
      .select(
        `*,
				project: projects (
					*
				)
			`,
      )
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new AppError("Tugas tidak ditemukan", 404);
      }
      throw error;
    }
    if (!data) {
      throw new AppError("Tugas tidak ditemukan", 404);
    }
    return data as Task;
  },
};
