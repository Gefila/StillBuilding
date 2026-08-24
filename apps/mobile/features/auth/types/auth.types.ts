import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email wajib diisi")
		.email("Format email tidak valid"),
	password: z
		.string()
		.min(1, "Kata sandi wajib diisi")
		.min(6, "Kata sandi minimal 6 karakter"),
	rememberMe: z.boolean(),
});

export const registerSchema = z
	.object({
		name: z.string().min(1, "Nama lengkap wajib diisi"),
		email: z
			.string()
			.min(1, "Email wajib diisi")
			.email("Format email tidak valid"),
		password: z
			.string()
			.min(1, "Kata sandi wajib diisi")
			.min(6, "Kata sandi minimal 6 karakter"),
		confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Konfirmasi kata sandi tidak cocok",
		path: ["confirmPassword"],
	});

export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;

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

export interface ApiResponse<T = any> {
	status: "success" | "error";
	message?: string;
	data?: T;
}
