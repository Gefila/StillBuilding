import { Router } from "express";
import {
  validate,
  validateIdParam,
} from "../../middlewares/validate.middleware";
import { taskController } from "./task.controller";
import { createTaskSchema, updateTaskSchema } from "./task.types";

const router = Router();

router.get("/", taskController.getAll);
router.get("/:id", validateIdParam, taskController.getById);
router.post("/", validate(createTaskSchema), taskController.create);
router.put(
  "/:id",
  validateIdParam,
  validate(updateTaskSchema),
  taskController.update,
);
router.delete("/:id", validateIdParam, taskController.delete);

export default router;
