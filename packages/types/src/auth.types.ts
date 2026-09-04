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

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .max(50, "Nama lengkap maksimal 50 karakter"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(
      /^[a-z0-9_]+$/,
      "Username hanya boleh berisi huruf kecil, angka, dan underscore",
    ),
  avatar: z.string().url("Format URL avatar tidak valid").optional(),
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Kata sandi saat ini wajib diisi"),
    new_password: z
      .string()
      .min(8, "Kata sandi baru minimal 8 karakter")
      .regex(/[a-z]/, "Kata sandi harus mengandung huruf kecil")
      .regex(/[A-Z]/, "Kata sandi harus mengandung huruf besar")
      .regex(
        /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
        "Kata sandi harus mengandung minimal 1 angka atau simbol",
      ),
    confirm_password: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirm_password"],
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: "Kata sandi baru tidak boleh sama dengan kata sandi saat ini",
    path: ["new_password"],
  });

export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;

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
  is_email_verified?: boolean;
  created_at?: string;
  last_sign_in_at?: string;
  provider?: string;
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
