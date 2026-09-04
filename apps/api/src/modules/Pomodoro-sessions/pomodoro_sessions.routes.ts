import { Router } from "express";
import {
  validate,
  validateIdParam,
} from "../../middlewares/validate.middleware";
import { pomodoroSessionController } from "./pomodoro_sessions.controller";
import {
  createPomodoroSessionSchema,
  updatePomodoroSessionSchema,
} from "./pomodoro_sessions.types";

const router = Router();

router.get("/", pomodoroSessionController.getAll);
router.get("/today-stats", pomodoroSessionController.getTodayStats);
router.get("/:id", validateIdParam, pomodoroSessionController.getById);
router.post(
  "/",
  validate(createPomodoroSessionSchema),
  pomodoroSessionController.create,
);
router.put(
  "/:id",
  validateIdParam,
  validate(updatePomodoroSessionSchema),
  pomodoroSessionController.update,
);
router.delete("/:id", validateIdParam, pomodoroSessionController.delete);

export default router;
