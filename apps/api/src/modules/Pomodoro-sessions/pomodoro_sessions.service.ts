import { supabase } from "../../config/supabase";
import { AppError } from "../../utils/AppError";
import { taskService } from "../Tasks/task.service";
import type {
  CreatePomodoroSessionDTO,
  PomodoroSession,
  UpdatePomodoroSessionDTO,
} from "./pomodoro_sessions.types";

const TABLE = "pomodoro_sessions";

export const pomodoroSessionService = {
  async getAll(userId: string): Promise<PomodoroSession[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select(
        `
				*,
				task:tasks!inner (
					*,
					project:projects!inner (
						*
					)
				)
			`,
      )
      .eq("task.project.user_id", userId)
      .order("started_at", { ascending: false });

    if (error) {
      throw new AppError(
        `Failed to fetch Pomodoro sessions: ${error.message}`,
        500,
      );
    }

    return (data || []) as PomodoroSession[];
  },

  async getById(id: string, userId: string): Promise<PomodoroSession> {
    const { data, error } = await supabase
      .from(TABLE)
      .select(
        `
				*,
				task:tasks!inner (
					*,
					project:projects!inner (
						*
					)
				)
			`,
      )
      .eq("id", id)
      .eq("task.project.user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new AppError(`Pomodoro session with id ${id} not found`, 404);
      }
      throw new AppError(
        `Failed to fetch Pomodoro session with id ${id}: ${error.message}`,
        500,
      );
    }
    if (!data) {
      throw new AppError(`Pomodoro session with id ${id} not found`, 404);
    }
    return data as PomodoroSession;
  },

  async create(
    pomodoroSession: CreatePomodoroSessionDTO,
    userId: string,
  ): Promise<PomodoroSession> {
    // 1. Verifikasi bahwa task_id milik user yang sedang login
    await taskService.getById(pomodoroSession.task_id, userId);

    const { data, error } = await supabase
      .from(TABLE)
      .insert(pomodoroSession)
      .select(
        `
				*,
				task:tasks (
					*,
					project:projects (
						*
					)
				)
			`,
      )
      .single();

    if (error) {
      throw new AppError(
        `Failed to create Pomodoro session: ${error.message}`,
        500,
      );
    }
    return data as PomodoroSession;
  },

  async update(
    id: string,
    userId: string,
    pomodoroSession: UpdatePomodoroSessionDTO,
  ): Promise<PomodoroSession> {
    // 1. Verifikasi kepemilikan sesi sebelum update
    await pomodoroSessionService.getById(id, userId);

    const { data, error } = await supabase
      .from(TABLE)
      .update(pomodoroSession)
      .eq("id", id)
      .select(
        `
				*,
				task:tasks (
					*,
					project:projects (
						*
					)
				)
			`,
      )
      .single();

    if (error) {
      throw new AppError(
        `Failed to update Pomodoro session with id ${id}: ${error.message}`,
        500,
      );
    }
    if (!data) {
      throw new AppError(`Pomodoro session with id ${id} not found`, 404);
    }
    return data as PomodoroSession;
  },

  async delete(id: string, userId: string): Promise<PomodoroSession> {
    // 1. Verifikasi kepemilikan sesi sebelum delete
    await pomodoroSessionService.getById(id, userId);

    const { data, error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id)
      .select(
        `
				*,
				task:tasks (
					*,
					project:projects (
						*
					)
				)
			`,
      )
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new AppError("Sesi Pomodoro tidak ditemukan", 404);
      }
      throw error;
    }
    if (!data) {
      throw new AppError("Sesi Pomodoro tidak ditemukan", 404);
    }
    return data as PomodoroSession;
  },
};
