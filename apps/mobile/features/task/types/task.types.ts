import { PomodoroSession } from "@/features/pomodoro/types/pomodoro.types";
import { Project } from "@/features/project/types/project.types";
import z from "zod";

export const createTaskSchema = z.object({
	project_id: z.string().optional(),
	title: z.string().min(1, "Title is required"),
	note: z.string().optional(),
	priority: z.string().optional(),
	status: z.string().optional().default("Pending"),
	completed_at: z.string().nullable().optional(),
});

export const updateTaskSchema = z.object({
	project_id: z.string().optional(),
	title: z.string().min(1, "Title is required").optional(),
	note: z.string().optional(),
	status: z.string().optional().default("Pending"),
	priority: z.string().optional(),
	completed_at: z.string().nullable().optional(),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;

export interface Task {
	id: string;
	project_id: string;
	title: string;
	note?: string;
	status?: string;
	priority?: string;
	completed_at?: string | null;
	created_at: string;
	updated_at: string;
	project?: Project;
	pomodoro_sessions?: PomodoroSession[];
}
