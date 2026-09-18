import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import { useNetworkStore } from "./useNetworkStore";

let isInitialized = false;

export function setupNetworkMonitoring() {
  if (isInitialized) return;
  isInitialized = true;

  // 1. Integrasikan TanStack Query onlineManager dengan NetInfo
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      const isOnline =
        Boolean(state.isConnected) && state.isInternetReachable !== false;
      setOnline(isOnline);
    });
  });

  // 2. Pantau perubahan status jaringan untuk useNetworkStore
  NetInfo.addEventListener((state) => {
    const isOnline =
      Boolean(state.isConnected) && state.isInternetReachable !== false;
    useNetworkStore.getState().setDeviceOnline(isOnline);
  });

  // 3. Periksa status awal saat pertama kali aplikasi dibuka
  NetInfo.fetch().then((state) => {
    const isOnline =
      Boolean(state.isConnected) && state.isInternetReachable !== false;
    useNetworkStore.getState().setDeviceOnline(isOnline);
  });
}
