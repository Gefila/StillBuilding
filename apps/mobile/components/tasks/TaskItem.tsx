import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Task } from "@/features/task/types/task.types";
import { formatDateID } from "@/utils/dateHelpers";
import { useUpdateTask } from "@/features/task/hooks/useTask";

export type Priority = "High" | "Medium" | "Low";

export interface PriorityStyle {
  chip: string;
  label: string;
  dot: string;
}

const PRIORITY_STYLES: Record<Priority, PriorityStyle> = {
  High: {
    chip: "bg-red-50 border-red-200",
    label: "text-red-700",
    dot: "bg-red-500",
  },
  Medium: {
    chip: "bg-amber-50 border-amber-200",
    label: "text-amber-700",
    dot: "bg-amber-500",
  },
  Low: {
    chip: "bg-emerald-50 border-emerald-200",
    label: "text-emerald-700",
    dot: "bg-emerald-500",
  },
};

const getPriorityStyle = (priority?: Priority): PriorityStyle =>
  PRIORITY_STYLES[priority ?? "Medium"] ?? PRIORITY_STYLES.Medium;

export function TaskItem({
  task,
  projectName,
}: {
  task: Task;
  projectName?: string;
}) {
  const router = useRouter();
  const updateTaskMutation = useUpdateTask();
  const style = getPriorityStyle(task.priority as Priority);
  const isDone = task.status === "Done";
  const currentProjectName = task.project?.name || projectName;

  const handleToggleStatus = (e: any) => {
    e.stopPropagation?.();
    const nextStatus = isDone ? "Pending" : "Done";
    updateTaskMutation.mutate({
      id: task.id,
      data: {
        status: nextStatus,
        completed_at: nextStatus === "Done" ? new Date().toISOString() : null,
      },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`flex-row items-center mb-2.5 bg-surface p-3.5 rounded-2xl border border-border shadow-xs ${
        isDone ? "opacity-60 bg-surface-subtle" : ""
      }`}
      onPress={() => router.push(`/task/${task.id}`)}
    >
      {/* Checkbox / Status Toggle */}
      <TouchableOpacity
        onPress={handleToggleStatus}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className="mr-3 p-0.5"
        disabled={updateTaskMutation.isPending}
      >
        {updateTaskMutation.isPending ? (
          <ActivityIndicator size="small" color="#18181b" />
        ) : (
          <Ionicons
            name={isDone ? "checkmark-circle" : "ellipse-outline"}
            size={22}
            color={isDone ? "#18181b" : "#a1a1aa"}
          />
        )}
      </TouchableOpacity>

      {/* Main Content: Structured 2-Row Layout */}
      <View className="flex-1 flex-col justify-center">
        {/* Row 1: Title (left) & Priority Chip (right) */}
        <View className="flex-row items-center justify-between gap-2">
          <Text
            className={`text-sm font-semibold flex-1 ${
              isDone ? "text-muted line-through" : "text-foreground"
            }`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {task.title}
          </Text>

          <View
            className={`flex-row items-center px-2 py-0.5 rounded-full border shrink-0 ${style.chip}`}
          >
            <View className={`w-1.5 h-1.5 rounded-full mr-1 ${style.dot}`} />
            <Text className={`text-[10px] font-bold ${style.label}`}>
              {task.priority || "Normal"}
            </Text>
          </View>
        </View>

        {/* Row 2: Project Badge (left) & Date Info (right) */}
        <View className="flex-row items-center justify-between gap-2 mt-1.5">
          {currentProjectName ? (
            <View className="flex-row items-center bg-surface-subtle px-2 py-0.5 rounded-full border border-border max-w-[58%]">
              <Ionicons name="folder-outline" size={10} color="#71717a" />
              <Text
                className="text-[10px] font-semibold text-foreground ml-1"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentProjectName}
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center bg-surface-subtle px-2 py-0.5 rounded-full border border-border max-w-[58%]">
              <Ionicons name="person-outline" size={10} color="#71717a" />
              <Text
                className="text-[10px] font-semibold text-muted ml-1"
                numberOfLines={1}
              >
                Personal
              </Text>
            </View>
          )}

          <View className="flex-row items-center shrink-0">
            <Ionicons name="time-outline" size={11} color="#a1a1aa" />
            <Text className="text-[11px] text-muted font-medium ml-1">
              {formatDateID(task.created_at)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
