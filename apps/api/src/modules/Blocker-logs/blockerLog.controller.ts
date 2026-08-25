import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { blockerLogService } from "./blockerLog.service";

export const blockerLogController = {
  getAll: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const blockerLogs = await blockerLogService.getAll(userId);
    res.json({ status: "success", data: blockerLogs });
  }),
  getById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user?.id as string;
    const blockerLog = await blockerLogService.getById(id, userId);
    res.json({ status: "success", data: blockerLog });
  }),
  create: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const blockerLog = await blockerLogService.create(req.body, userId);
    res.status(201).json({ status: "success", data: blockerLog });
  }),
  update: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user?.id as string;
    const blockerLog = await blockerLogService.update(id, userId, req.body);
    res.json({ status: "success", data: blockerLog });
  }),
  delete: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user?.id as string;
    const blockerLog = await blockerLogService.delete(id, userId);
    res.status(200).json({ status: "success", data: blockerLog });
  }),
};
