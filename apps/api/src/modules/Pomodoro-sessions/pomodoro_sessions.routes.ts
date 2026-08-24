import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { pomodoroSessionController } from "./pomodoro_sessions.controller";
import {
	createPomodoroSessionSchema,
	updatePomodoroSessionSchema,
} from "./pomodoro_sessions.types";

const router = Router();

router.get("/", pomodoroSessionController.getAll);
router.get("/:id", pomodoroSessionController.getById);
router.post(
	"/",
	validate(createPomodoroSessionSchema),
	pomodoroSessionController.create,
);
router.put(
	"/:id",
	validate(updatePomodoroSessionSchema),
	pomodoroSessionController.update,
);
router.delete("/:id", pomodoroSessionController.delete);

export default router;
