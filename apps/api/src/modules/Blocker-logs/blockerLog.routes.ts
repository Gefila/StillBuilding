import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { blockerLogController } from "./blockerLog.controller";
import {
	createBlockerLogSchema,
	updateBlockerLogSchema,
} from "./blockerLog.types";

const router = Router();

router.get("/", blockerLogController.getAll);
router.get("/:id", blockerLogController.getById);
router.post("/", validate(createBlockerLogSchema), blockerLogController.create);
router.put(
	"/:id",
	validate(updateBlockerLogSchema),
	blockerLogController.update,
);
router.delete("/:id", blockerLogController.delete);

export default router;
