import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { authController } from "./auth.controller";
import {
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  updateProfileSchema,
} from "./auth.types";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  authController.refreshToken,
);

router.get("/me", authMiddleware, authController.me);
router.put(
  "/profile",
  authMiddleware,
  validate(updateProfileSchema),
  authController.updateProfile,
);
router.put(
  "/password",
  authMiddleware,
  validate(changePasswordSchema),
  authController.changePassword,
);
router.post("/logout", authMiddleware, authController.logout);

export default router;
