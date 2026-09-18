import { create } from "zustand";
import NetInfo from "@react-native-community/netinfo";
import { Toast } from "toastify-react-native";
import { queryClient } from "@/lib/reactQuery";

export type NetworkErrorType = "offline" | "timeout" | "server_unreachable";

interface NetworkState {
  isOnline: boolean;
  isApiReachable: boolean;
  isReconnecting: boolean;
  lastErrorType: NetworkErrorType | null;
  showRestoredBanner: boolean;
  setDeviceOnline: (isOnline: boolean) => void;
  setApiReachable: (
    reachable: boolean,
    errorType?: NetworkErrorType | null,
  ) => void;
  triggerRetry: () => Promise<void>;
  dismissBanner: () => void;
}

let restoreTimeout: ReturnType<typeof setTimeout> | null = null;

const checkApiHealth = async (): Promise<boolean> => {
  const rawBaseURL = process.env.EXPO_PUBLIC_API_URL;
  if (!rawBaseURL) return false;
  const baseURL = rawBaseURL.replace(/\/$/, "");
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${baseURL}/`, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);
    return response.ok || response.status < 500;
  } catch (_err) {
    return false;
  }
};

const triggerRestoredFeedback = (
  set: (state: Partial<NetworkState>) => void,
) => {
  if (restoreTimeout) {
    clearTimeout(restoreTimeout);
  }
  set({ showRestoredBanner: true });
  restoreTimeout = setTimeout(() => {
    set({ showRestoredBanner: false });
    restoreTimeout = null;
  }, 2500);
};

export const useNetworkStore = create<NetworkState>((set, get) => ({
  isOnline: true,
  isApiReachable: true,
  isReconnecting: false,
  lastErrorType: null,
  showRestoredBanner: false,

  setDeviceOnline: (isOnline: boolean) => {
    const prevOnline = get().isOnline;

    if (!isOnline) {
      if (restoreTimeout) {
        clearTimeout(restoreTimeout);
        restoreTimeout = null;
      }
      set({
        isOnline: false,
        lastErrorType: "offline",
        showRestoredBanner: false,
      });
    } else {
      set({ isOnline: true });
      if (!prevOnline) {
        // Saat perangkat kembali online, verifikasi apakah API server juga dapat dijangkau
        checkApiHealth().then((alive) => {
          if (alive) {
            get().setApiReachable(true);
          } else {
            get().setApiReachable(false, "server_unreachable");
          }
        });
      }
    }
  },

  setApiReachable: (
    reachable: boolean,
    errorType: NetworkErrorType | null = null,
  ) => {
    const prevApi = get().isApiReachable;
    const isOnline = get().isOnline;

    if (!reachable) {
      if (restoreTimeout) {
        clearTimeout(restoreTimeout);
        restoreTimeout = null;
      }
      set({
        isApiReachable: false,
        lastErrorType:
          errorType || (isOnline ? "server_unreachable" : "offline"),
        showRestoredBanner: false,
      });
    } else {
      set({
        isApiReachable: true,
        lastErrorType: null,
      });
      // Hanya tampilkan feedback pulih jika sebelumnya pernah error (API unreachable atau offline)
      if ((!prevApi || !isOnline) && isOnline) {
        triggerRestoredFeedback(set);
      }
    }
  },

  triggerRetry: async () => {
    const { isReconnecting } = get();
    if (isReconnecting) return;

    set({ isReconnecting: true });

    try {
      // 1. Cek status konektivitas perangkat secara langsung
      const netState = await NetInfo.fetch();
      const isDeviceConnected =
        Boolean(netState.isConnected) && netState.isInternetReachable !== false;

      if (!isDeviceConnected) {
        set({
          isOnline: false,
          isApiReachable: false,
          lastErrorType: "offline",
          showRestoredBanner: false,
        });
        Toast.error("Tidak ada koneksi internet pada perangkat Anda.");
        return;
      }

      set({ isOnline: true });

      // 2. Ping server API untuk memastikan server benar-benar dapat dijangkau
      const isServerAlive = await checkApiHealth();

      if (!isServerAlive) {
        set({
          isApiReachable: false,
          lastErrorType: "server_unreachable",
          showRestoredBanner: false,
        });
        Toast.error("Masih tidak dapat terhubung ke server API.");
        return;
      }

      // 3. Jika koneksi perangkat dan server terbukti sehat, tandai reachable
      get().setApiReachable(true);

      // 4. Refetch semua query aktif di TanStack Query
      await queryClient.refetchQueries({
        type: "active",
      });
    } catch (_err) {
      set({
        isApiReachable: false,
        lastErrorType: "server_unreachable",
        showRestoredBanner: false,
      });
      Toast.error("Gagal menghubungkan kembali ke server.");
    } finally {
      set({ isReconnecting: false });
    }
  },

  dismissBanner: () => {
    set({
      showRestoredBanner: false,
    });
  },
}));
