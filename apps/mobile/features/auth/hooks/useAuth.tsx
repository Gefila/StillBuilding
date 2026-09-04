import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Toast } from "toastify-react-native";
import { MutationConfig, queryClient, QueryConfig } from "@/lib/reactQuery";
import { authService } from "../service/authService";
import { useAuthStore } from "../store/useAuthStore";
import type {
  ChangePasswordDTO,
  LoginDTO,
  RegisterDTO,
  UpdateProfileDTO,
} from "../types/auth.types";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginDTO) => authService.login(payload),
    meta: { skipGlobalErrorToast: true },
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
    meta: { skipGlobalErrorToast: true },
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

export const getCurrentUserQueryOptions = () => {
  return queryOptions({
    queryKey: authKeys.me(),
    queryFn: () => authService.getMe(),
  });
};

type UseCurrentUserOptions = {
  queryConfig?: QueryConfig<typeof getCurrentUserQueryOptions>;
};

export const useCurrentUser = ({
  queryConfig = {},
}: UseCurrentUserOptions = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    ...getCurrentUserQueryOptions(),
    enabled: isAuthenticated,
    ...queryConfig,
  });
};

type UseUpdateProfileOptions = {
  mutationConfig?: MutationConfig<typeof authService.updateProfile>;
};

export const useUpdateProfile = ({
  mutationConfig = {},
}: UseUpdateProfileOptions = {}) => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: UpdateProfileDTO) =>
      authService.updateProfile(payload),
    ...mutationConfig,
    onSuccess: async (updatedUser, variables, onMutateResult, context) => {
      // 1. Update query cache
      queryClient.setQueryData(authKeys.me(), updatedUser);
      queryClient.invalidateQueries({
        queryKey: authKeys.me(),
        exact: true,
      });

      // 2. Update local auth store (Zustand & SecureStore)
      await setUser(updatedUser);

      Toast.success("Profil berhasil diperbarui!");
      router.back();

      mutationConfig.onSuccess?.(
        updatedUser,
        variables,
        onMutateResult,
        context,
      );
    },
    onError: (error: any, variables, onMutateResult, context) => {
      const message =
        error?.message ||
        error?.error ||
        "Gagal memperbarui profil. Silakan coba lagi.";
      Toast.error(message);
      mutationConfig.onError?.(error, variables, onMutateResult, context);
    },
  });
};

type UseChangePasswordOptions = {
  mutationConfig?: MutationConfig<typeof authService.changePassword>;
};

export const useChangePassword = ({
  mutationConfig = {},
}: UseChangePasswordOptions = {}) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ChangePasswordDTO) =>
      authService.changePassword(payload),
    ...mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      Toast.success(data?.message || "Kata sandi berhasil diperbarui!");
      router.back();
      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error: any, variables, onMutateResult, context) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal memperbarui kata sandi. Silakan coba lagi.";
      Toast.error(message);
      mutationConfig.onError?.(error, variables, onMutateResult, context);
    },
  });
};
