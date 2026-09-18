import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetworkStore } from "@/lib/network/useNetworkStore";

export function NetworkBanner() {
  const insets = useSafeAreaInsets();
  const isOnline = useNetworkStore((state) => state.isOnline);
  const isApiReachable = useNetworkStore((state) => state.isApiReachable);
  const isReconnecting = useNetworkStore((state) => state.isReconnecting);
  const lastErrorType = useNetworkStore((state) => state.lastErrorType);
  const showRestoredBanner = useNetworkStore(
    (state) => state.showRestoredBanner,
  );
  const triggerRetry = useNetworkStore((state) => state.triggerRetry);
  const dismissBanner = useNetworkStore((state) => state.dismissBanner);

  const hasError = !isOnline || !isApiReachable;
  const isVisible = hasError || showRestoredBanner;

  const [translateY] = useState(() => new Animated.Value(-120));
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, translateY, opacity]);

  const topOffset = Math.max(insets.top, Platform.OS === "android" ? 12 : 8);

  const getTitle = () => {
    if (showRestoredBanner) {
      return "Koneksi terhubung kembali";
    }
    if (!isOnline || lastErrorType === "offline") {
      return "Koneksi internet terputus";
    }
    if (lastErrorType === "timeout") {
      return "Koneksi lambat / waktu habis";
    }
    return "Tidak dapat menjangkau server";
  };

  const getSubtitle = () => {
    if (showRestoredBanner) {
      return "Data Anda sedang diperbarui";
    }
    if (!isOnline || lastErrorType === "offline") {
      return "Periksa jaringan Wi-Fi atau data seluler Anda";
    }
    return "Server mungkin sedang sibuk atau tidak aktif";
  };

  return (
    <Animated.View
      pointerEvents={isVisible ? "auto" : "none"}
      style={{
        position: "absolute",
        top: topOffset,
        left: 16,
        right: 16,
        zIndex: 9999,
        transform: [{ translateY }],
        opacity,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 6,
      }}
    >
      <View
        className={`w-full rounded-2xl border px-3.5 py-2.5 flex-row items-center justify-between ${
          showRestoredBanner
            ? "bg-emerald-50 border-emerald-200"
            : "bg-surface border-border"
        }`}
      >
        {/* Left Section: Icon & Text */}
        <View className="flex-row items-center flex-1 mr-2">
          <View
            className={`w-8 h-8 rounded-xl items-center justify-center mr-2.5 ${
              showRestoredBanner
                ? "bg-emerald-100"
                : lastErrorType === "timeout"
                  ? "bg-amber-100"
                  : "bg-rose-100"
            }`}
          >
            {showRestoredBanner ? (
              <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
            ) : lastErrorType === "timeout" ? (
              <Ionicons name="timer-outline" size={18} color="#d97706" />
            ) : (
              <Ionicons
                name="cloud-offline-outline"
                size={18}
                color="#dc2626"
              />
            )}
          </View>

          <View className="flex-1 justify-center">
            <Text
              numberOfLines={1}
              className={`text-xs font-bold leading-tight ${
                showRestoredBanner ? "text-emerald-900" : "text-foreground"
              }`}
            >
              {getTitle()}
            </Text>
            <Text
              numberOfLines={1}
              className={`text-[10px] mt-0.5 leading-tight ${
                showRestoredBanner ? "text-emerald-700" : "text-muted"
              }`}
            >
              {getSubtitle()}
            </Text>
          </View>
        </View>

        {/* Right Section: Retry or Close */}
        {showRestoredBanner ? (
          <TouchableOpacity
            onPress={dismissBanner}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="p-1 rounded-lg active:bg-emerald-100"
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={16} color="#059669" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={triggerRetry}
            disabled={isReconnecting}
            activeOpacity={0.8}
            className="bg-primary px-3 py-1.5 rounded-xl flex-row items-center justify-center min-w-[76px]"
          >
            {isReconnecting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <View className="flex-row items-center gap-1">
                <Ionicons name="refresh" size={13} color="#ffffff" />
                <Text className="text-[11px] font-semibold text-primary-foreground">
                  Coba Lagi
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

export default NetworkBanner;
