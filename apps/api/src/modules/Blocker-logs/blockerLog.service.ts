import { supabase } from "../../config/supabase";
import { AppError } from "../../utils/AppError";
import type {
  BlockerLog,
  CreateBlockerLogDTO,
  UpdateBlockerLogDTO,
} from "./blockerLog.types";

const TABLE = "blocker_logs";

export const blockerLogService = {
  async getAll(userId: string): Promise<BlockerLog[]> {
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
      throw new AppError(`Failed to fetch blocker logs: ${error.message}`, 500);
    }

    return (data || []) as BlockerLog[];
  },

  async getById(id: string, userId: string): Promise<BlockerLog> {
    const { data, error } = await supabase
      .from(TABLE)
      .select(
        `*,
				project: projects!inner (
					*
				)
			`,
      )
      .eq("id", id)
      .eq("projects.user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new AppError(`Blocker log with id ${id} not found`, 404);
      }
      throw new AppError(
        `Failed to fetch blocker log with id ${id}: ${error.message}`,
        500,
      );
    }
    if (!data) {
      throw new AppError(`Blocker log with id ${id} not found`, 404);
    }
    return data as BlockerLog;
  },

  async create(
    blockerLog: CreateBlockerLogDTO,
    userId: string,
  ): Promise<BlockerLog> {
    // 1. Verifikasi project kepemilikan user
    const { data: project, error: projError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", blockerLog.project_id)
      .eq("user_id", userId)
      .single();

    if (projError || !project) {
      throw new AppError("Project not found or unauthorized", 404);
    }

    const { data, error } = await supabase
      .from(TABLE)
      .insert(blockerLog)
      .select(
        `*,
				project: projects (
					*
				)
			`,
      )
      .single();

    if (error) {
      throw new AppError(`Failed to create blocker log: ${error.message}`, 500);
    }
    return data as BlockerLog;
  },

  async update(
    id: string,
    userId: string,
    blockerLog: UpdateBlockerLogDTO,
  ): Promise<BlockerLog> {
    // 1. Verifikasi kepemilikan blocker log sebelum update
    await blockerLogService.getById(id, userId);

    // 2. Jika project_id diubah, verifikasi kepemilikan project tujuan
    if (blockerLog.project_id) {
      const { data: project, error: projError } = await supabase
        .from("projects")
        .select("id")
        .eq("id", blockerLog.project_id)
        .eq("user_id", userId)
        .single();

      if (projError || !project) {
        throw new AppError("Target project not found or unauthorized", 404);
      }
    }

    const { data, error } = await supabase
      .from(TABLE)
      .update(blockerLog)
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
        `Failed to update blocker log with id ${id}: ${error.message}`,
        500,
      );
    }
    if (!data) {
      throw new AppError(`Blocker log with id ${id} not found`, 404);
    }
    return data as BlockerLog;
  },

  async delete(id: string, userId: string): Promise<BlockerLog> {
    // 1. Verifikasi kepemilikan blocker log sebelum delete
    await blockerLogService.getById(id, userId);

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
        throw new AppError(`Blocker log with id ${id} not found`, 404);
      }
      throw new AppError(
        `Failed to delete blocker log with id ${id}: ${error.message}`,
        500,
      );
    }
    if (!data) {
      throw new AppError(`Blocker log with id ${id} not found`, 404);
    }
    return data as BlockerLog;
  },
};
