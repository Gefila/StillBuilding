import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NetworkErrorPlaceholderProps {
  title?: string;
  message?: string;
  onRetry?: () => void | Promise<any>;
  isLoading?: boolean;
}

export function NetworkErrorPlaceholder({
  title = "Gagal Memuat Data",
  message = "Terjadi gangguan pada koneksi internet atau server tidak dapat dijangkau. Periksa koneksi Anda dan coba lagi.",
  onRetry,
  isLoading = false,
}: NetworkErrorPlaceholderProps) {
  return (
    <View className="py-10 px-6 items-center justify-center">
      {/* Icon Badge */}
      <View className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border items-center justify-center mb-3">
        <Ionicons name="cloud-offline-outline" size={28} color="#71717a" />
      </View>

      {/* Title & Message */}
      <Text className="text-base font-bold text-foreground text-center">
        {title}
      </Text>
      <Text className="text-xs text-muted text-center mt-1.5 leading-relaxed max-w-[280px]">
        {message}
      </Text>

      {/* Retry Button */}
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          disabled={isLoading}
          activeOpacity={0.8}
          className="mt-4 bg-primary px-4 py-2.5 rounded-xl flex-row items-center gap-2"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Ionicons name="refresh" size={15} color="#ffffff" />
              <Text className="text-xs font-semibold text-primary-foreground">
                Coba Muat Ulang
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

export default NetworkErrorPlaceholder;
