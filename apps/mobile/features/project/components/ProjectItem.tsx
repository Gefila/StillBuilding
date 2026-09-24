import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Project } from "@/features/project/types/project.types";
import { getCategoryConfig } from "../constants/projectCategories";

export default function ProjectItem({ project }: { project: Project }) {
  const router = useRouter();
  const categoryConfig = getCategoryConfig(project.category);

  const statusStyles: Record<
    "Active" | "On Hold" | "Completed",
    { chip: string; text: string; dot: string; label: string }
  > = {
    Active: {
      chip: "bg-surface-subtle border-border",
      text: "text-foreground",
      dot: "bg-emerald-500",
      label: "Aktif",
    },
    "On Hold": {
      chip: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
      dot: "bg-amber-500",
      label: "On Hold",
    },
    Completed: {
      chip: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-800",
      dot: "bg-emerald-600",
      label: "Selesai",
    },
  };

  const currentStatus = (project.status || "Active") as
    | "Active"
    | "On Hold"
    | "Completed";
  const badge = statusStyles[currentStatus] || statusStyles.Active;

  const doneTasks = project.done_tasks || 0;
  const totalTasks = project.total_tasks || 0;
  const progressPercent =
    totalTasks > 0
      ? Math.min(100, Math.round((doneTasks / totalTasks) * 100))
      : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.navigate(`/project/${project.id}`)}
      className="flex-col bg-surface p-3.5 border border-border rounded-2xl mb-2.5 shadow-2xs"
    >
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 bg-surface-subtle border border-border rounded-xl justify-center items-center">
          <Ionicons
            name={(project.icon as any) || "folder-outline"}
            size={20}
            color="#18181b"
          />
        </View>
        <View className="flex-1">
          <Text
            className="text-[15px] font-semibold text-foreground tracking-tight"
            numberOfLines={1}
          >
            {project.name}
          </Text>
          {project.description ? (
            <Text className="text-xs text-muted mt-0.5" numberOfLines={1}>
              {project.description}
            </Text>
          ) : null}
        </View>
        <View className="flex-col items-end gap-1">
          <View
            className={`flex-row items-center px-2 py-0.5 rounded-full border ${badge.chip}`}
          >
            <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badge.dot}`} />
            <Text className={`text-[10px] font-bold ${badge.text}`}>
              {badge.label}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: categoryConfig.bgColor,
              borderColor: `${categoryConfig.color}33`,
            }}
            className="flex-row items-center px-1.5 py-0.5 rounded-full border"
          >
            <Ionicons
              name={categoryConfig.icon}
              size={9}
              color={categoryConfig.color}
              style={{ marginRight: 3 }}
            />
            <Text
              style={{ color: categoryConfig.color }}
              className="text-[9px] font-semibold"
            >
              {categoryConfig.label}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-3 pt-2.5 border-t border-divider">
        <View className="flex-row justify-between items-center w-full mb-1.5">
          <Text className="text-[11px] font-medium text-muted">
            Progres Tugas
          </Text>
          <Text className="text-[11px] font-semibold text-foreground">
            {doneTasks}/{totalTasks} ({progressPercent}%)
          </Text>
        </View>
        <View className="w-full h-1.5 bg-surface-subtle rounded-full overflow-hidden border border-border/40">
          <View
            className="h-full bg-primary rounded-full"
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
