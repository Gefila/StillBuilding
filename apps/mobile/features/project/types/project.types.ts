import z from "zod";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "@/features/task/types/task.types";

export const createProjectSchema = z.object({
	name: z.string().min(1, "Name is required"),
	icon: z.string().optional(),
	description: z.string().optional(),
	last_activity: z.string().optional(),
	status: z.enum(["Active", "On Hold", "Completed"]).optional(),
});

export const updateProjectSchema = z.object({
	name: z.string().min(1, "Name is required").optional(),
	icon: z.string().optional(),
	description: z.string().optional(),
	last_activity: z.string().optional(),
	status: z.enum(["Active", "On Hold", "Completed"]).optional(),
});

export type CreateProjectDTO = z.infer<typeof createProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>;

type ProjectStatus = "Active" | "On Hold" | "Completed";

export interface Project {
	id: string;
	name: string;
	icon?: keyof typeof Ionicons.glyphMap;
	description?: string;
	last_activity?: string;
	status?: ProjectStatus;
	tasks?: Task[];
	total_tasks?: number;
	done_tasks?: number;
	created_at: string;
	updated_at: string;
}
