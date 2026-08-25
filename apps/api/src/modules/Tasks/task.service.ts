import { supabase } from "../../config/supabase";
import { AppError } from "../../utils/AppError";
import type { CreateTaskDTO, Task, UpdateTaskDTO } from "./task.types";

const TABLE = "tasks";

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

    return (data || []) as Task[];
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

  async create(task: CreateTaskDTO, userId: string): Promise<Task> {
    if (task.project_id) {
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
    return data as Task;
  },

  async update(id: string, userId: string, task: UpdateTaskDTO): Promise<Task> {
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
        throw new AppError(`Task with id ${id} not found`, 404);
      }
      throw new AppError(
        `Failed to delete task with id ${id}: ${error.message}`,
        500,
      );
    }
    if (!data) {
      throw new AppError(`Task with id ${id} not found`, 404);
    }
    return data as Task;
  },
};
