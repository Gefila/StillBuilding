import { Router } from "express";
import { statsController } from "./stats.controller";

const router = Router();

router.get("/activity-heatmap", statsController.getActivityHeatmap);

export default router;
