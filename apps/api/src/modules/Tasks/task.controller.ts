import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { taskService } from "./task.service";

export const taskController = {
  getAll: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const tasks = await taskService.getAll(userId);
    res.json({ status: "success", data: tasks });
  }),
  getById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user?.id as string;
    const task = await taskService.getById(id, userId);
    res.json({ status: "success", data: task });
  }),
  create: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const task = await taskService.create(
      {
        ...req.body,
      },
      userId,
    );
    res.status(201).json({ status: "success", data: task });
  }),
  update: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user?.id as string;
    const task = await taskService.update(id, userId, req.body);
    res.json({ status: "success", data: task });
  }),
  delete: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user?.id as string;
    const task = await taskService.delete(id, userId);
    res.status(200).json({ status: "success", data: task });
  }),
};
