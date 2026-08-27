import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyFocusStateProps {
  onStart: () => void;
}

export default function EmptyFocusState({ onStart }: EmptyFocusStateProps) {
  return (
    <View className="py-2.5 px-3 items-center justify-center bg-surface-subtle border border-dashed border-border rounded-xl">
      <View className="flex-row items-center gap-2 mb-1">
        <Ionicons name="timer-outline" size={15} color="#71717a" />
        <Text className="text-xs font-semibold text-foreground">
          Belum ada riwayat sesi fokus
        </Text>
      </View>
      <TouchableOpacity
        onPress={onStart}
        activeOpacity={0.8}
        className="flex-row items-center bg-primary px-3 py-1.5 rounded-lg mt-1"
      >
        <Ionicons name="play" size={12} color="#ffffff" />
        <Text className="text-xs font-semibold text-primary-foreground ml-1">
          Mulai Sesi Fokus
        </Text>
      </TouchableOpacity>
    </View>
  );
}
