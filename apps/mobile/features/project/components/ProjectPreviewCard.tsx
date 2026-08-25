import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const STATUS_CONFIG: Record<
  "Active" | "On Hold" | "Completed",
  { bg: string; text: string; label: string; border: string; dot: string }
> = {
  Active: {
    bg: "bg-surface-subtle",
    border: "border-border",
    text: "text-foreground",
    label: "Active",
    dot: "bg-foreground",
  },
  "On Hold": {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    label: "On Hold",
    dot: "bg-amber-500",
  },
  Completed: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    label: "Completed",
    dot: "bg-emerald-500",
  },
};

interface ProjectPreviewCardProps {
  name?: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  status?: "Active" | "On Hold" | "Completed";
}

export default function ProjectPreviewCard({
  name,
  description,
  icon = "folder",
  status = "Active",
}: ProjectPreviewCardProps) {
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.Active;
  const displayName = name?.trim() ? name : "Nama Proyek Baru";
  const displayDescription = description?.trim()
    ? description
    : "Deskripsi singkat proyek akan muncul di sini...";

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2 ml-0.5">
        <View className="flex-row items-center">
          <Ionicons name="eye-outline" size={13} color="#71717a" />
          <Text className="text-xs font-semibold text-muted ml-1 uppercase tracking-wider">
            Preview Kartu
          </Text>
        </View>
        <Text className="text-[11px] text-muted font-medium">
          Tampilan di daftar proyek
        </Text>
      </View>

      <View className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
        {/* Top row: Icon + Name/Desc + Status */}
        <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-xl bg-surface-subtle border border-border items-center justify-center">
            <Ionicons
              name={icon || "folder-outline"}
              size={22}
              color="#18181b"
            />
          </View>

          <View className="flex-1">
            <Text
              className={`text-base font-bold ${
                name?.trim() ? "text-foreground" : "text-muted italic"
              }`}
              numberOfLines={1}
            >
              {displayName}
            </Text>
            <Text
              className={`text-xs mt-0.5 ${
                description?.trim() ? "text-muted" : "text-muted/60 italic"
              }`}
              numberOfLines={2}
            >
              {displayDescription}
            </Text>
          </View>

          <View
            className={`flex-row items-center px-2 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.border}`}
          >
            <View
              className={`w-1.5 h-1.5 rounded-full mr-1 ${statusInfo.dot}`}
            />
            <Text className={`text-[10px] font-bold ${statusInfo.text}`}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {/* Bottom row: Progress Simulation */}
        <View className="mt-3 pt-3 border-t border-divider">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-xs font-medium text-muted">
              Progres Tugas
            </Text>
            <Text className="text-xs font-semibold text-foreground">
              0 / 0 (0%)
            </Text>
          </View>
          <View className="w-full h-1.5 bg-surface-subtle rounded-full overflow-hidden border border-border/50">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: "15%" }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
