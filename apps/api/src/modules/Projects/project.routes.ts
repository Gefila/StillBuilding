import { Router } from "express";
import {
  validate,
  validateIdParam,
} from "../../middlewares/validate.middleware";
import { projectController } from "./project.controller";
import { createProjectSchema, updateProjectSchema } from "./project.types";

const router = Router();

router.get("/", projectController.getAll);
router.get("/:id", validateIdParam, projectController.getById);
router.post("/", validate(createProjectSchema), projectController.create);
router.put(
  "/:id",
  validateIdParam,
  validate(updateProjectSchema),
  projectController.update,
);
router.delete("/:id", validateIdParam, projectController.delete);

export default router;
