import api from "@/lib/axios";
import type {
  ApiResponse,
  AuthUser,
  LoginDTO,
  LoginResponseData,
  RegisterDTO,
  UpdateProfileDTO,
} from "../types/auth.types";

export const authService = {
  register: async (payload: RegisterDTO): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>("auth/register", {
      email: payload.email,
      password: payload.password,
      name: payload.name,
    });
    return response.data;
  },

  login: async (payload: LoginDTO): Promise<LoginResponseData> => {
    const response = await api.post<ApiResponse<LoginResponseData>>(
      "auth/login",
      {
        email: payload.email,
        password: payload.password,
      },
    );
    if (!response.data.data) {
      throw new Error(response.data.message || "Gagal masuk ke akun");
    }
    return response.data.data;
  },

  refreshToken: async (
    refreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> => {
    const response = await api.post<
      ApiResponse<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }>
    >("auth/refresh-token", {
      refresh_token: refreshToken,
    });
    if (!response.data.data) {
      throw new Error("Gagal memperbarui token sesi");
    }
    return response.data.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>("auth/logout");
    return response.data;
  },

  getMe: async (): Promise<AuthUser> => {
    const response = await api.get<ApiResponse<AuthUser>>("auth/me");
    if (!response.data.data) {
      throw new Error("Gagal mengambil data pengguna");
    }
    return response.data.data;
  },

  updateProfile: async (payload: UpdateProfileDTO): Promise<AuthUser> => {
    const response = await api.put<ApiResponse<AuthUser>>(
      "auth/profile",
      payload,
    );
    if (!response.data.data) {
      throw new Error(response.data.message || "Gagal memperbarui profil");
    }
    return response.data.data;
  },
};
