import { supabase } from "../../config/supabase";
import { AppError } from "../../utils/AppError";
import type { LoginDTO, RegisterDTO } from "./auth.types";

export const authService = {
	async register(payload: RegisterDTO) {
		const { data, error } = await supabase.auth.signUp({
			email: payload.email,
			password: payload.password,
			options: {
				data: {
					full_name: payload.email.split("@")[0],
					avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
						payload.email.split("@")[0],
					)}&background=random`,
				},
			},
		});
		if (error) {
			throw new AppError(`Failed to register user: ${error.message}`, 400);
		}
		return data;
	},
	async login(payload: LoginDTO) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: payload.email,
			password: payload.password,
		});

		if (error) {
			throw new AppError(`Failed to login user: ${error.message}`, 401);
		}

		const { data: profile, error: profileError } = await supabase
			.from("profiles")
			.select(
				"id, username, full_name, avatar, current_strike, longest_streak, last_streak_date",
			)
			.eq("id", data?.user?.id)
			.single();

		if (profileError) {
			throw new AppError(
				`Failed to fetch user profile: ${profileError.message}`,
				401,
			);
		}

		return {
			accessToken: data.session?.access_token,
			refreshToken: data.session?.refresh_token,
			expiresIn: data.session?.expires_in,
			user: {
				id: profile?.id,
				email: data.user?.email,
				username: profile?.username,
				name: profile?.full_name,
				avatar: profile?.avatar,
				current_strike: profile?.current_strike,
				longest_streak: profile?.longest_streak,
				last_streak_date: profile?.last_streak_date,
			},
		};
	},
	async logout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			throw new AppError(`Failed to logout user: ${error.message}`, 500);
		}
	},
	async refreshToken(refreshToken: string) {
		const { data, error } = await supabase.auth.refreshSession({
			refresh_token: refreshToken,
		});
		if (error) {
			throw new AppError(`Failed to refresh token: ${error.message}`, 401);
		}
		return {
			accessToken: data.session?.access_token,
			refreshToken: data.session?.refresh_token,
			expiresIn: data.session?.expires_in,
		};
	},
	async getCurrentUser(userId: string) {
		const { data: profile, error } = await supabase
			.from("profiles")
			.select(
				"id, username, full_name, avatar, current_strike, longest_streak, last_streak_date",
			)
			.eq("id", userId)
			.single();

		if (error || !profile) {
			throw new AppError(
				`Failed to fetch user profile: ${error?.message || "Profile not found"}`,
				404,
			);
		}

		return profile;
	},
};
