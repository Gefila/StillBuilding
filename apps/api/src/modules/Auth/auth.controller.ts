import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import type { LoginDTO, RegisterDTO } from "./auth.types";

export const authController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as RegisterDTO;
    await authService.register(payload);
    res.json({ status: "success", message: "User registered successfully" });
  }),
  login: catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as LoginDTO;
    const login = await authService.login(payload);
    res.json({
      status: "success",
      message: "User logged in successfully",
      data: login,
    });
  }),
  logout: catchAsync(async (_req: Request, res: Response) => {
    await authService.logout();
    res.json({ status: "success", message: "User logged out successfully" });
  }),
  refreshToken: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.refreshToken(req.body.refresh_token);
    res.json({
      status: "success",
      message: "Token refreshed successfully",
      data: result,
    });
  }),
  me: catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }
    const user = await authService.getCurrentUser(req.user.id);
    res.json({ status: "success", data: user });
  }),
};
