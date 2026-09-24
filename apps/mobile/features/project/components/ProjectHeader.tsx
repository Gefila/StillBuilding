import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Project } from "@/features/project/types/project.types";
import { getCategoryConfig } from "../constants/projectCategories";

export default function ProjectHeader({ project }: { project: Project }) {
  const categoryConfig = getCategoryConfig(project.category);
  const tasks = project.tasks || [];
  const totalTasks = project.total_tasks ?? tasks.length;
  const doneTasks =
    project.done_tasks ?? tasks.filter((t) => t.status === "Done").length;
  const progressPercent =
    totalTasks > 0
      ? Math.min(100, Math.round((doneTasks / totalTasks) * 100))
      : 0;

  return (
    <View className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
      {/* Project Info */}
      <View className="flex-row items-center gap-3 mb-3">
        <View className="w-12 h-12 bg-surface-subtle rounded-xl flex-row items-center justify-center border border-border">
          <Ionicons
            name={(project.icon as any) || "folder-outline"}
            size={24}
            color="#18181b"
          />
        </View>

        <View className="flex-1">
          <Text className="text-foreground text-lg font-bold tracking-tight">
            {project.name}
          </Text>
          {project.description ? (
            <Text className="text-muted text-xs mt-0.5" numberOfLines={2}>
              {project.description}
            </Text>
          ) : null}

          <View className="flex-row items-center gap-2 mt-1.5">
            <View className="bg-surface-subtle border border-border px-2 py-0.5 rounded-full">
              <Text className="text-foreground text-[10px] font-bold">
                {project.status || "Active"}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: categoryConfig.bgColor,
                borderColor: `${categoryConfig.color}33`,
              }}
              className="flex-row items-center px-2 py-0.5 rounded-full border"
            >
              <Ionicons
                name={categoryConfig.icon}
                size={11}
                color={categoryConfig.color}
                style={{ marginRight: 3 }}
              />
              <Text
                style={{ color: categoryConfig.color }}
                className="text-[10px] font-semibold"
              >
                {categoryConfig.label}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Progress */}
      <View className="bg-surface-subtle rounded-xl p-3 border border-border mt-1">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="bar-chart-outline" size={14} color="#71717a" />
            <Text className="text-muted text-xs font-semibold">
              Progres Target
            </Text>
          </View>
          <Text className="text-foreground font-bold text-xs">
            {doneTasks}/{totalTasks} Tugas ({progressPercent}%)
          </Text>
        </View>

        <View className="w-full bg-surface rounded-full h-2 overflow-hidden border border-border">
          <View
            className="bg-primary h-2 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>
    </View>
  );
}
