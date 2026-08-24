import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { projectController } from "./project.controller";
import { createProjectSchema, updateProjectSchema } from "./project.types";

const router = Router();

router.get("/", projectController.getAll);
router.get("/:id", projectController.getById);
router.post("/", validate(createProjectSchema), projectController.create);
router.put("/:id", validate(updateProjectSchema), projectController.update);
router.delete("/:id", projectController.delete);

export default router;
