import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { projectService } from "./project.service";

export const projectController = {
	getAll: catchAsync(async (req: Request, res: Response) => {
		const userId = req.user?.id as string;
		const projects = await projectService.getAll(userId);
		res.json({ status: "success", data: projects });
	}),
	getById: catchAsync(async (req: Request, res: Response) => {
		const { id } = req.params as { id: string };
		const userId = req.user?.id as string;
		const project = await projectService.getById(id, userId);
		res.json({ status: "success", data: project });
	}),
	create: catchAsync(async (req: Request, res: Response) => {
		const userId = req.user?.id as string;
		const project = await projectService.create({
			...req.body,
			user_id: userId,
		});
		res.status(201).json({ status: "success", data: project });
	}),
	update: catchAsync(async (req: Request, res: Response) => {
		const { id } = req.params as { id: string };
		const userId = req.user?.id as string;
		const project = await projectService.update(id, userId, req.body);
		res.json({ status: "success", data: project });
	}),
	delete: catchAsync(async (req: Request, res: Response) => {
		const { id } = req.params as { id: string };
		const userId = req.user?.id as string;
		const project = await projectService.delete(id, userId);
		console.log("Deleted project:", project);
		res.status(200).json({ status: "success", data: project });
	}),
};
