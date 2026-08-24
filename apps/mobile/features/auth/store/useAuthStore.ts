import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import type { AuthUser } from "../types/auth.types";

const TOKEN_KEY = "stillbuilding_access_token";
const REFRESH_TOKEN_KEY = "stillbuilding_refresh_token";
const USER_KEY = "stillbuilding_user";

interface AuthState {
	token: string | null;
	refreshToken: string | null;
	user: AuthUser | null;
	isAuthenticated: boolean;
	isInitialized: boolean;

	// Actions
	setAuth: (data: {
		accessToken?: string;
		refreshToken?: string;
		user?: AuthUser;
	}) => Promise<void>;
	setUser: (user: AuthUser) => Promise<void>;
	logout: () => Promise<void>;
	initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	token: null,
	refreshToken: null,
	user: null,
	isAuthenticated: false,
	isInitialized: false,

	setAuth: async ({ accessToken, refreshToken, user }) => {
		try {
			if (accessToken) {
				await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
			}
			if (refreshToken) {
				await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
			}
			if (user) {
				await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
			}

			set({
				token: accessToken ?? get().token,
				refreshToken: refreshToken ?? get().refreshToken,
				user: user ?? get().user,
				isAuthenticated: Boolean(accessToken ?? get().token),
			});
		} catch (error) {
			console.error("Error setting auth state in SecureStore:", error);
		}
	},

	setUser: async (user: AuthUser) => {
		try {
			await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
			set({ user });
		} catch (error) {
			console.error("Error saving user profile to SecureStore:", error);
		}
	},

	logout: async () => {
		try {
			await SecureStore.deleteItemAsync(TOKEN_KEY);
			await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
			await SecureStore.deleteItemAsync(USER_KEY);
		} catch (error) {
			console.error("Error clearing SecureStore:", error);
		} finally {
			set({
				token: null,
				refreshToken: null,
				user: null,
				isAuthenticated: false,
			});
		}
	},

	initializeAuth: async () => {
		try {
			const token = await SecureStore.getItemAsync(TOKEN_KEY);
			const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
			const userStr = await SecureStore.getItemAsync(USER_KEY);
			let user: AuthUser | null = null;
			if (userStr) {
				try {
					user = JSON.parse(userStr);
				} catch {
					user = null;
				}
			}

			set({
				token,
				refreshToken,
				user,
				isAuthenticated: Boolean(token),
				isInitialized: true,
			});
		} catch (error) {
			console.error("Error initializing auth state from SecureStore:", error);
			set({ isInitialized: true });
		}
	},
}));
