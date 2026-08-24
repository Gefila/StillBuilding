import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { pomodoroSessionService } from "./pomodoro_sessions.service";

export const pomodoroSessionController = {
	getAll: catchAsync(async (req: Request, res: Response) => {
		const userId = req.user?.id as string;
		const pomodoroSessions = await pomodoroSessionService.getAll(userId);
		res.json({ status: "success", data: pomodoroSessions });
	}),
	getById: catchAsync(async (req: Request, res: Response) => {
		const { id } = req.params as { id: string };
		const userId = req.user?.id as string;
		const pomodoroSession = await pomodoroSessionService.getById(id, userId);
		res.json({ status: "success", data: pomodoroSession });
	}),
	create: catchAsync(async (req: Request, res: Response) => {
		const userId = req.user?.id as string;
		const pomodoroSession = await pomodoroSessionService.create(
			req.body,
			userId,
		);
		res.status(201).json({ status: "success", data: pomodoroSession });
	}),
	update: catchAsync(async (req: Request, res: Response) => {
		const { id } = req.params as { id: string };
		const userId = req.user?.id as string;
		const pomodoroSession = await pomodoroSessionService.update(
			id,
			userId,
			req.body,
		);
		res.json({ status: "success", data: pomodoroSession });
	}),
	delete: catchAsync(async (req: Request, res: Response) => {
		const { id } = req.params as { id: string };
		const userId = req.user?.id as string;
		const pomodoroSession = await pomodoroSessionService.delete(id, userId);
		res.status(200).json({ status: "success", data: pomodoroSession });
	}),
};
