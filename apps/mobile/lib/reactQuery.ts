import {
  DefaultOptions,
  MutationCache,
  QueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { Toast } from "toastify-react-native";

const getErrorMessage = (error: unknown): string => {
  if (!error) return "Terjadi kesalahan yang tidak terduga.";
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    if ("message" in error && typeof (error as any).message === "string") {
      return (error as any).message;
    }
    if ("error" in error && typeof (error as any).error === "string") {
      return (error as any).error;
    }
  }
  return "Terjadi kesalahan pada server.";
};

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  },
} satisfies DefaultOptions;

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const meta = mutation.meta as { skipGlobalErrorToast?: boolean } | undefined;
      if (meta?.skipGlobalErrorToast) return;

      const message = getErrorMessage(error);
      console.log("Mutation error:", message);
      Toast.error(message);
    },
  }),
});

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;

