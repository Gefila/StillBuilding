import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authLimiter } from "../../middlewares/rateLimiter.middleware";
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

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register,
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post(
  "/refresh-token",
  authLimiter,
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
  authLimiter,
  validate(changePasswordSchema),
  authController.changePassword,
);
router.post("/logout", authMiddleware, authController.logout);

export default router;
