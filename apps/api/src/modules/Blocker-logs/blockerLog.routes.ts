import { Router } from "express";
import {
  validate,
  validateIdParam,
} from "../../middlewares/validate.middleware";
import { blockerLogController } from "./blockerLog.controller";
import {
  createBlockerLogSchema,
  updateBlockerLogSchema,
} from "./blockerLog.types";

const router = Router();

router.get("/", blockerLogController.getAll);
router.get("/:id", validateIdParam, blockerLogController.getById);
router.post("/", validate(createBlockerLogSchema), blockerLogController.create);
router.put(
  "/:id",
  validateIdParam,
  validate(updateBlockerLogSchema),
  blockerLogController.update,
);
router.delete("/:id", validateIdParam, blockerLogController.delete);

export default router;
