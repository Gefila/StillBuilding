import z from "zod";

export const registerSchema = z.object({
	body: z.object({
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
	}),
});

export const refreshTokenSchema = z.object({
	body: z.object({
		refresh_token: z.string().min(1, "Refresh token is required"),
	}),
});

export type RegisterDTO = z.infer<typeof registerSchema>["body"];
export type LoginDTO = z.infer<typeof loginSchema>["body"];
export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>["body"];

export interface AuthUser {
	id: string;
	username?: string;
	full_name?: string;
	avatar?: string;
	current_strike?: number;
	longest_streak?: number;
	last_streak_date?: string;
}
