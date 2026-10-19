import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { mcpTokenService } from "../Mcp/mcp.service";
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
  logout: catchAsync(async (req: Request, res: Response) => {
    await authService.logout(req.token);
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
  updateProfile: catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }
    const updatedUser = await authService.updateProfile(req.user.id, req.body);
    res.json({
      status: "success",
      message: "Profil berhasil diperbarui",
      data: updatedUser,
    });
  }),
  changePassword: catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }
    const result = await authService.changePassword(
      req.user.id,
      req.user.email || "",
      req.body,
    );
    res.json({
      status: "success",
      message: result.message,
    });
  }),
  // Personal Access Token untuk AI agent (MCP)
  getApiToken: catchAsync(async (req: Request, res: Response) => {
    const data = await mcpTokenService.status(req.user?.id as string);
    res.json({ status: "success", data });
  }),
  generateApiToken: catchAsync(async (req: Request, res: Response) => {
    const data = await mcpTokenService.generate(req.user?.id as string);
    res.status(201).json({ status: "success", data });
  }),
  revokeApiToken: catchAsync(async (req: Request, res: Response) => {
    await mcpTokenService.revoke(req.user?.id as string);
    res.json({ status: "success", message: "API token dicabut" });
  }),
};
