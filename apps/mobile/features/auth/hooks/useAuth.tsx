import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Toast } from "toastify-react-native";
import { queryClient } from "@/lib/reactQuery";
import { authService } from "../service/authService";
import { useAuthStore } from "../store/useAuthStore";
import type { LoginDTO, RegisterDTO } from "../types/auth.types";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginDTO) => authService.login(payload),
    onSuccess: async (data) => {
      await setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      Toast.success("Berhasil masuk ke StillBuilding!");
      queryClient.invalidateQueries();
      router.replace("/(tabs)/home");
    },
    onError: (error: any) => {
      const message =
        error?.message ||
        error?.error ||
        "Email atau kata sandi tidak valid. Silakan coba lagi.";
      Toast.error(message);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterDTO) => authService.register(payload),
    onSuccess: () => {
      Toast.success("Pendaftaran berhasil! Silakan masuk ke akun Anda.");
      router.replace("/(auth)/login");
    },
    onError: (error: any) => {
      const message =
        error?.message ||
        error?.error ||
        "Gagal mendaftarkan akun. Silakan coba lagi.";
      Toast.error(message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: async () => {
      await logoutStore();
      queryClient.clear();
      Toast.info("Anda telah keluar dari aplikasi.");
      router.replace("/(auth)/login");
    },
  });
};

export const useCurrentUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authService.getMe(),
    enabled: isAuthenticated,
  });
};
