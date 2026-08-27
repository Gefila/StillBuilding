import { supabase } from "../../config/supabase";
import { AppError } from "../../utils/AppError";
import { sortTasks } from "../../utils/taskSorter";
import type { Task } from "../Tasks/task.types";
import type {
  CreateProjectDTO,
  Project,
  UpdateProjectDTO,
} from "./project.types";

const TABLE = "projects";

export const projectService = {
  async getAll(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects_with_task_stats")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback ke tabel dasar projects jika view projects_with_task_stats belum tersedia
      const { data: fallbackData, error: fallbackError } = await supabase
        .from(TABLE)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fallbackError) {
        throw new AppError(
          `Failed to fetch projects: ${fallbackError.message}`,
          500,
        );
      }
      return (fallbackData || []) as Project[];
    }

    return (data || []) as Project[];
  },

  async getById(id: string, userId: string): Promise<Project> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*, tasks(*), blocker_logs(*)")
      .eq("id", id)
      .eq("user_id", userId)
      .order("created_at", { ascending: false, referencedTable: "tasks" })
      .order("created_at", {
        ascending: false,
        referencedTable: "blocker_logs",
      })
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new AppError(`Project with id ${id} not found`, 404);
      }
      throw new AppError(
        `Failed to fetch project with id ${id}: ${error.message}`,
        500,
      );
    }
    if (!data) {
      throw new AppError(`Project with id ${id} not found`, 404);
    }
    const rawTasks = (data.tasks || []) as Task[];
    const tasks = sortTasks(rawTasks);
    const total_tasks = tasks.length;
    const done_tasks = tasks.filter((t) => t.status === "Done").length;

    return {
      ...data,
      tasks,
      total_tasks,
      done_tasks,
    } as Project;
  },

  async create(project: CreateProjectDTO): Promise<Project> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(project)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to create project: ${error.message}`, 500);
    }
    return data as Project;
  },

  async update(
    id: string,
    userId: string,
    project: UpdateProjectDTO,
  ): Promise<Project> {
    const { data, error } = await supabase
      .from(TABLE)
      .update(project)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new AppError(`Project with id ${id} not found`, 404);
      }
      throw new AppError(
        `Failed to update project with id ${id}: ${error.message}`,
        500,
      );
    }
    if (!data) {
      throw new AppError(`Project with id ${id} not found`, 404);
    }
    return data as Project;
  },

  async delete(id: string, userId: string): Promise<Project> {
    const { data, error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new AppError(`Project with id ${id} not found`, 404);
      }
      throw new AppError(
        `Failed to delete project with id ${id}: ${error.message}`,
        500,
      );
    }
    if (!data) {
      throw new AppError(`Project with id ${id} not found`, 404);
    }

    return data as Project;
  },
};
