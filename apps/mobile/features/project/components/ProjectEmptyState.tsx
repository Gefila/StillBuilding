import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProjectEmptyStateProps {
  type: "no_projects" | "no_results";
  onResetFilter?: () => void;
}

export default function ProjectEmptyState({
  type,
  onResetFilter,
}: ProjectEmptyStateProps) {
  if (type === "no_projects") {
    return (
      <View className="bg-surface p-8 rounded-2xl border border-dashed border-border items-center justify-center my-2">
        <View className="w-12 h-12 rounded-full bg-surface-subtle border border-border items-center justify-center mb-3">
          <Ionicons name="folder-open-outline" size={24} color="#71717a" />
        </View>
        <Text className="text-sm font-semibold text-foreground text-center">
          Belum ada proyek
        </Text>
        <Text className="text-xs text-muted text-center mt-1">
          Buat proyek baru untuk mengelompokkan tugas-tugas Anda.
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-surface p-6 rounded-2xl border border-border items-center justify-center my-2">
      <View className="w-10 h-10 rounded-full bg-surface-subtle border border-border items-center justify-center mb-2.5">
        <Ionicons name="search-outline" size={20} color="#71717a" />
      </View>
      <Text className="text-sm font-semibold text-foreground text-center">
        Proyek tidak ditemukan
      </Text>
      <Text className="text-xs text-muted text-center mt-1 mb-3">
        Tidak ada proyek yang sesuai dengan pencarian atau filter yang dipilih.
      </Text>
      {onResetFilter && (
        <TouchableOpacity
          onPress={onResetFilter}
          className="px-3.5 py-1.5 bg-surface-subtle border border-border rounded-xl"
        >
          <Text className="text-xs font-semibold text-foreground">
            Reset Filter
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
