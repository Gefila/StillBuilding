import z from "zod";
import type { Project } from "../Projects/project.types";

export const createTaskSchema = z.object({
	body: z.object({
		project_id: z.string().optional(),
		title: z.string().min(1, "Title is required"),
		note: z.string().optional(),
		status: z.string().optional().default("todo"),
		priority: z.string().optional().default("medium"),
		completed_at: z.string().nullable().optional(),
	}),
});

export const updateTaskSchema = z.object({
	body: z.object({
		project_id: z.string().optional(),
		title: z.string().min(1, "Title is required").optional(),
		note: z.string().optional(),
		status: z.string().optional(),
		priority: z.string().optional(),
		completed_at: z.string().nullable().optional(),
	}),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>["body"];
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>["body"];

export interface Task {
	id: string;
	project_id: string;
	title: string;
	note?: string;
	status?: string;
	priority?: string;
	completed_at?: string | null;
	created_at: string;
	project?: Project;
}
