import { useAuthStore } from "@/features/auth/store/useAuthStore";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  create,
  isAxiosError,
} from "axios";
import { Toast } from "toastify-react-native";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const rawBaseURL = process.env.EXPO_PUBLIC_API_URL;

if (!rawBaseURL) {
  throw new Error(
    "Missing EXPO_PUBLIC_API_URL. Pastikan file .env atau EAS Environment Variables sudah dikonfigurasi.",
  );
}

const baseURL = rawBaseURL.replace(/\/$/, "");

const api = create({
  baseURL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

let refreshTokenPromise: Promise<string> | null = null;

const requestNewAccessToken = async (): Promise<string> => {
  const currentRefreshToken = useAuthStore.getState().refreshToken;

  if (!currentRefreshToken) {
    throw new Error("No refresh token available");
  }

  const refreshUrl = `${baseURL.replace(/\/$/, "")}/auth/refresh-token`;
  const response = await axios.post<
    ApiResponse<{
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }>
  >(
    refreshUrl,
    {
      refresh_token: currentRefreshToken,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  const tokens = response.data.data;
  if (!tokens?.accessToken || !tokens?.refreshToken) {
    throw new Error(response.data.message || "Gagal memperbarui token sesi");
  }

  // Simpan access token & refresh token baru ke SecureStore dan Zustand store
  await useAuthStore.getState().setAuth({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });

  return tokens.accessToken;
};

api.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  try {
    config.headers["x-timezone"] =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta";
  } catch (_e) {
    config.headers["x-timezone"] = "Asia/Jakarta";
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError | Error) => {
    if (isAxiosError(error)) {
      const originalRequest = error.config as
        | CustomAxiosRequestConfig
        | undefined;

      if (error.response) {
        const { status, data } = error.response as {
          status: number;
          data: any;
        };

        if (status === 401) {
          const requestUrl = originalRequest?.url || "";
          const isAuthEndpoint =
            requestUrl.includes("auth/login") ||
            requestUrl.includes("auth/register") ||
            requestUrl.includes("auth/refresh-token");

          // Jika error 401 berasal dari auth endpoint atau request sudah pernah di-retry
          if (isAuthEndpoint || originalRequest?._retry) {
            if (isAuthEndpoint && !requestUrl.includes("auth/refresh-token")) {
              return Promise.reject(data);
            }
            await useAuthStore.getState().logout();
            Toast.error("Sesi Anda telah berakhir. Silakan masuk kembali.");
            return Promise.reject(data);
          }

          if (originalRequest) {
            originalRequest._retry = true;
          }

          try {
            // Gunakan singleton promise agar hanya 1 request refresh token yang berjalan
            if (!refreshTokenPromise) {
              refreshTokenPromise = requestNewAccessToken().finally(() => {
                refreshTokenPromise = null;
              });
            }

            const newAccessToken = await refreshTokenPromise;

            if (originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            await useAuthStore.getState().logout();
            Toast.error("Sesi Anda telah berakhir. Silakan masuk kembali.");
            return Promise.reject(refreshError);
          }
        }

        switch (status) {
          case 400:
          case 403:
          case 404:
          case 500:
            return Promise.reject(data);
          default:
            return Promise.reject({
              message: data?.message || "Terjadi kesalahan pada server.",
            });
        }
      } else {
        return Promise.reject({
          message: error.message || "Masalah jaringan, silakan coba lagi.",
        });
      }
    }

    return Promise.reject(new Error("Terjadi kesalahan yang tidak terduga."));
  },
);

export default api;
