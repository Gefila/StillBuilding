import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { statsService } from "./stats.service";

export const statsController = {
  getActivityHeatmap: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const weeksQuery = req.query.weeks
      ? parseInt(req.query.weeks as string, 10)
      : 16;
    const timeZone = (req.headers["x-timezone"] as string) || "Asia/Jakarta";

    const data = await statsService.getActivityHeatmap(
      userId,
      Number.isNaN(weeksQuery) ? 16 : weeksQuery,
      timeZone,
    );

    res.json({
      status: "success",
      data,
    });
  }),
};
