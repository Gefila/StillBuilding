import type { NextFunction, Request, Response } from "express";
import { supabase } from "../config/supabase";
import type { AuthUser } from "../modules/Auth/auth.types";
import { AppError } from "../utils/AppError";

// Extend Express Request agar bisa menyimpan user dan token
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      token?: string;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized: No token provided", 401));
    }

    const token = authHeader.split(" ")[1];

    // Verifikasi token ke Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return next(new AppError("Unauthorized: Invalid or expired token", 401));
    }
    // Ambil profile dari table profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, full_name")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      return next(new AppError("Unauthorized: Profile not found", 401));
    }

    req.user = {
      ...profile,
      email: data.user.email,
    } as AuthUser;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
};
