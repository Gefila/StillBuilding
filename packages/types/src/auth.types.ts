import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Full name is required").optional(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.confirmPassword || data.password === data.confirmPassword,
    {
      message: "Confirm password does not match",
      path: ["confirmPassword"],
    },
  );

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token is required"),
});

export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;

export interface AuthUser {
  id: string;
  email?: string;
  username?: string;
  name?: string;
  full_name?: string;
  avatar?: string;
  current_strike?: number;
  longest_streak?: number;
  last_streak_date?: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  message?: string;
  data?: T;
}
