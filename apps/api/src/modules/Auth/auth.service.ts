import { supabase, supabaseAuth } from "../../config/supabase";
import { AppError } from "../../utils/AppError";
import type { LoginDTO, RegisterDTO, UpdateProfileDTO } from "./auth.types";

export const authService = {
  async register(payload: RegisterDTO) {
    const fullName = payload.name?.trim() || payload.email.split("@")[0];
    const username = fullName
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .slice(0, 30);

    const { data, error } = await supabaseAuth.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: fullName,
          username,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            fullName,
          )}&background=random`,
        },
      },
    });

    if (error) {
      throw new AppError(`Failed to register user: ${error.message}`, 400);
    }

    if (data.user?.id) {
      await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          username,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            fullName,
          )}&background=random`,
        })
        .eq("id", data.user.id);
    }

    return data;
  },
  async login(payload: LoginDTO) {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
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
  async logout(token?: string) {
    if (token) {
      const { error } = await supabase.auth.admin.signOut(token);
      if (error) {
        console.warn("Failed to revoke session on logout:", error.message);
      }
    }
  },
  async refreshToken(refreshToken: string) {
    const { data, error } = await supabaseAuth.auth.refreshSession({
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
  async updateProfile(userId: string, payload: UpdateProfileDTO) {
    if (payload.username) {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", payload.username)
        .neq("id", userId)
        .maybeSingle();

      if (existingUser) {
        throw new AppError("Username sudah digunakan oleh pengguna lain", 400);
      }
    }

    const updateData: {
      full_name: string;
      username: string;
      avatar?: string;
    } = {
      full_name: payload.full_name,
      username: payload.username,
    };

    if (payload.avatar) {
      updateData.avatar = payload.avatar;
    }

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select(
        "id, username, full_name, avatar, current_strike, longest_streak, last_streak_date",
      )
      .single();

    if (error || !updatedProfile) {
      throw new AppError(
        `Failed to update profile: ${error?.message || "Profile not found"}`,
        500,
      );
    }

    return updatedProfile;
  },
};
