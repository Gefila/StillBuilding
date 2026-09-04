import { supabase, supabaseAuth } from "../../config/supabase";
import { AppError } from "../../utils/AppError";
import type {
  ChangePasswordDTO,
  LoginDTO,
  RegisterDTO,
  UpdateProfileDTO,
} from "./auth.types";

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
      const errorMsg = error.message.toLowerCase();
      if (
        errorMsg.includes("already registered") ||
        errorMsg.includes("already exists") ||
        errorMsg.includes("user already")
      ) {
        throw new AppError("Email tersebut sudah terdaftar di sistem.", 400);
      }
      throw new AppError(
        "Gagal mendaftarkan akun. Silakan periksa kembali data Anda.",
        400,
      );
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
      throw new AppError("Email atau kata sandi tidak valid", 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "id, username, full_name, avatar, current_strike, longest_streak, last_streak_date",
      )
      .eq("id", data?.user?.id)
      .single();

    if (profileError) {
      throw new AppError("Profil pengguna tidak ditemukan", 404);
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
        full_name: profile?.full_name,
        avatar: profile?.avatar,
        current_strike: profile?.current_strike,
        longest_streak: profile?.longest_streak,
        last_streak_date: profile?.last_streak_date,
        is_email_verified: !!data.user?.email_confirmed_at,
        created_at: data.user?.created_at,
        last_sign_in_at: data.user?.last_sign_in_at,
        provider: data.user?.app_metadata?.provider || "email",
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
      throw new AppError(
        "Sesi tidak valid atau telah kedaluwarsa. Silakan masuk kembali.",
        401,
      );
    }
    return {
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      expiresIn: data.session?.expires_in,
    };
  },
  async getCurrentUser(userId: string) {
    const [profileResult, authUserResult] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, username, full_name, avatar, current_strike, longest_streak, last_streak_date",
        )
        .eq("id", userId)
        .single(),
      supabase.auth.admin.getUserById(userId),
    ]);

    if (profileResult.error || !profileResult.data) {
      throw new AppError("Profil pengguna tidak ditemukan", 404);
    }

    const profile = profileResult.data;
    const authUser = authUserResult.data?.user;

    return {
      ...profile,
      name: profile.full_name,
      email: authUser?.email,
      is_email_verified: !!authUser?.email_confirmed_at,
      created_at: authUser?.created_at,
      last_sign_in_at: authUser?.last_sign_in_at,
      provider: authUser?.app_metadata?.provider || "email",
    };
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
      throw new AppError("Gagal memperbarui data profil pengguna", 500);
    }

    return updatedProfile;
  },
  async changePassword(
    userId: string,
    email: string,
    payload: ChangePasswordDTO,
  ) {
    if (!email) {
      throw new AppError("Email pengguna tidak ditemukan", 400);
    }

    const { error: verifyError } = await supabaseAuth.auth.signInWithPassword({
      email,
      password: payload.current_password,
    });

    if (verifyError) {
      throw new AppError("Kata sandi saat ini tidak valid", 400);
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        password: payload.new_password,
      },
    );

    if (updateError) {
      throw new AppError(
        "Gagal memperbarui kata sandi. Pastikan format kata sandi baru sesuai ketentuan.",
        400,
      );
    }

    return { message: "Kata sandi berhasil diperbarui" };
  },
};
