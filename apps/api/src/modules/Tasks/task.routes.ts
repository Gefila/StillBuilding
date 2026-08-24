import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { taskController } from "./task.controller";
import { createTaskSchema, updateTaskSchema } from "./task.types";

const router = Router();

router.get("/", taskController.getAll);
router.get("/:id", taskController.getById);
router.post("/", validate(createTaskSchema), taskController.create);
router.put("/:id", validate(updateTaskSchema), taskController.update);
router.delete("/:id", taskController.delete);

export default router;
