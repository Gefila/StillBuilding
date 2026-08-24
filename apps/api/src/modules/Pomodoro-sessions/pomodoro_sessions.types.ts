import z from "zod";
import type { Task } from "../Tasks/task.types";

export const createPomodoroSessionSchema = z.object({
	body: z.object({
		task_id: z.string().uuid("Invalid task ID format"),
		mode: z.enum(["pomodoro", "shortBreak", "longBreak"]),
		duration: z.number().int().positive(),
		cycle_index: z.number().int().min(0).max(7),
		session_num: z.number().int().min(1).max(4),
		started_at: z.string(),
		ended_at: z.string().optional(),
		completed: z.boolean(),
	}),
});

export const updatePomodoroSessionSchema = z.object({
	body: z.object({
		ended_at: z.string().optional(),
		elapsed: z.number().int().min(0).optional(),
		completed: z.boolean().optional(),
	}),
});

export type CreatePomodoroSessionDTO = z.infer<
	typeof createPomodoroSessionSchema
>["body"];
export type UpdatePomodoroSessionDTO = z.infer<
	typeof updatePomodoroSessionSchema
>["body"];

export interface PomodoroSession {
	id: string;
	task_id: string;
	mode: "pomodoro" | "shortBreak" | "longBreak";
	cycle_index: number;
	session_num: number;
	started_at: string;
	ended_at?: string;
	duration: number;
	completed: boolean;
	elapsed?: number;
	task?: Task;
}
