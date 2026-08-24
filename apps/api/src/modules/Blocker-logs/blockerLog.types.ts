import z from "zod";
import type { Project } from "../Projects/project.types";

export const createBlockerLogSchema = z.object({
	body: z.object({
		project_id: z.string().min(1, "Project ID is required"),
		reason: z.string().min(1, "Reason is required"),
		solution: z.string().optional(),
		is_resolved: z.boolean().optional().default(false),
		created_at: z.string().optional(),
	}),
});

export const updateBlockerLogSchema = z.object({
	body: z.object({
		project_id: z.string().optional(),
		reason: z.string().min(1, "Reason is required").optional(),
		solution: z.string().optional(),
		is_resolved: z.boolean().optional(),
	}),
});

export type CreateBlockerLogDTO = z.infer<
	typeof createBlockerLogSchema
>["body"];
export type UpdateBlockerLogDTO = z.infer<
	typeof updateBlockerLogSchema
>["body"];

export interface BlockerLog {
	id: string;
	project_id: string;
	reason: string;
	solution?: string;
	is_resolved: boolean;
	created_at: string;
	project?: Project;
}
