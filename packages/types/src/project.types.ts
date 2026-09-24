import { z } from "zod";
import type { Task } from "./task.types";
import type { BlockerLog } from "./blocker.types";

export type ProjectStatus = "Active" | "On Hold" | "Completed";

export const projectCategorySchema = z.enum([
  "coding",
  "learning",
  "work",
  "fitness",
  "personal",
]);
export type ProjectCategory = z.infer<typeof projectCategorySchema>;

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  description: z.string().optional(),
  category: projectCategorySchema.optional().default("coding"),
  last_activity: z.string().optional(),
  status: z
    .enum(["Active", "On Hold", "Completed"])
    .optional()
    .default("Active"),
  is_active: z.boolean().optional().default(false),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  category: projectCategorySchema.optional(),
  last_activity: z.string().optional(),
  status: z.enum(["Active", "On Hold", "Completed"]).optional(),
  is_active: z.boolean().optional(),
});

export type CreateProjectDTO = z.infer<typeof createProjectSchema> & {
  user_id?: string;
};
export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>;

export interface Project {
  id: string;
  user_id?: string;
  name: string;
  icon?: string;
  description?: string;
  category?: ProjectCategory;
  status?: ProjectStatus;
  is_active?: boolean;
  last_activity?: string;
  total_tasks?: number;
  done_tasks?: number;
  created_at: string;
  updated_at?: string;
  tasks?: Task[];
  blocker_logs?: BlockerLog[];
}
