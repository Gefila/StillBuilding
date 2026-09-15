import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Modal from "@/components/Modal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Task } from "@/features/task/types/task.types";
import { formatDateID } from "@/utils/dateHelpers";

interface TaskHeaderHeroProps {
  task: Task;
  onToggleStatus: () => void;
  onSelectStatus: (status: string) => void;
  isUpdating?: boolean;
}

type Priority = "High" | "Medium" | "Low";

const PRIORITY_STYLES: Record<
  Priority,
  { bg: string; border: string; text: string; dot: string; label: string }
> = {
  High: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    dot: "bg-red-500",
    label: "Tinggi",
  },
  Medium: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Sedang",
  },
  Low: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Rendah",
  },
};

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    bg: string;
    border: string;
    text: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
  }
> = {
  Pending: {
    label: "Pending",
    bg: "bg-surface-subtle",
    border: "border-border",
    text: "text-muted",
    icon: "hourglass-outline",
    iconColor: "#71717a",
  },
  Active: {
    label: "Sedang Dikerjakan",
    bg: "bg-primary",
    border: "border-primary",
    text: "text-primary-foreground",
    icon: "play-circle",
    iconColor: "#ffffff",
  },
  Done: {
    label: "Selesai",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    icon: "checkmark-circle",
    iconColor: "#16a34a",
  },
};

export default function TaskHeaderHero({
  task,
  onToggleStatus,
  onSelectStatus,
  isUpdating = false,
}: TaskHeaderHeroProps) {
  const router = useRouter();
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const isDone = task.status === "Done";
  const currentStatus = task.status || "Pending";
  const statusInfo = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.Pending;
  const priorityInfo =
    PRIORITY_STYLES[(task.priority as Priority) || "Medium"] ||
    PRIORITY_STYLES.Medium;

  const handleStatusSelect = (status: string) => {
    setStatusModalVisible(false);
    if (status !== currentStatus) {
      onSelectStatus(status);
    }
  };

  return (
    <View className="mb-3 bg-surface p-4 rounded-2xl border border-border shadow-xs">
      {/* Row 1: Status Pill (Interactive Dropdown Trigger) & Priority Badge */}
      <View className="flex-row items-center justify-between gap-2 mb-3">
        {/* Status Picker Pill */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setStatusModalVisible(true)}
          className={`flex-row items-center px-3 py-1.5 rounded-full border ${statusInfo.bg} ${statusInfo.border}`}
        >
          <Ionicons
            name={statusInfo.icon}
            size={13}
            color={statusInfo.iconColor}
          />
          <Text
            className={`text-xs font-semibold ml-1.5 mr-1 ${statusInfo.text}`}
          >
            {statusInfo.label}
          </Text>
          <Ionicons
            name="chevron-down"
            size={12}
            color={currentStatus === "Active" ? "#ffffff" : "#71717a"}
          />
        </TouchableOpacity>

        {/* Priority Badge */}
        <View
          className={`flex-row items-center px-2.5 py-1 rounded-full border ${priorityInfo.bg} ${priorityInfo.border}`}
        >
          <View
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priorityInfo.dot}`}
          />
          <Text className={`text-[11px] font-bold ${priorityInfo.text}`}>
            Prioritas {priorityInfo.label}
          </Text>
        </View>
      </View>

      {/* Row 2: Large Interactive Checkbox & Title */}
      <View className="flex-row items-start gap-3">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggleStatus}
          disabled={isUpdating}
          className="mt-0.5"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#18181b" />
          ) : (
            <Ionicons
              name={isDone ? "checkmark-circle" : "ellipse-outline"}
              size={26}
              color={isDone ? "#18181b" : "#a1a1aa"}
            />
          )}
        </TouchableOpacity>

        <Text
          className={`flex-1 text-lg font-bold tracking-tight leading-snug ${
            isDone ? "text-muted line-through" : "text-foreground"
          }`}
        >
          {task.title}
        </Text>
      </View>

      {/* Divider */}
      <View className="h-px bg-divider my-3.5" />

      {/* Row 3: Project Pill (Clickable) & Timestamps */}
      <View className="flex-row items-center justify-between gap-2 flex-wrap">
        {/* Project Pill */}
        {task.project ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push(`/project/${task.project_id || task.project?.id}`)
            }
            className="flex-row items-center bg-surface-subtle border border-border px-3 py-1.5 rounded-xl max-w-[65%]"
          >
            <Ionicons
              name={(task.project.icon as any) || "folder-outline"}
              size={13}
              color="#18181b"
            />
            <Text
              className="text-xs font-semibold text-foreground ml-1.5"
              numberOfLines={1}
            >
              {task.project.name}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={12}
              color="#71717a"
              className="ml-1"
            />
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center bg-surface-subtle border border-border px-3 py-1.5 rounded-xl">
            <Ionicons name="person-outline" size={13} color="#71717a" />
            <Text className="text-xs font-semibold text-muted ml-1.5">
              Personal Task
            </Text>
          </View>
        )}

        {/* Dates */}
        <View className="flex-col items-start gap-1">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={12} color="#a1a1aa" />
            <Text className="text-[11px] text-muted font-medium ml-1">
              {isDone ? "Dibuat: " : ""}
              {formatDateID(task.created_at)}
            </Text>
          </View>
          {isDone && task.completed_at ? (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-done" size={12} color="#16a34a" />
              <Text className="text-[11px] text-emerald-700 font-semibold ml-1">
                Selesai: {formatDateID(task.completed_at)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Status Selection Modal Sheet */}
      <Modal
        isVisible={statusModalVisible}
        onBackdropPress={() => setStatusModalVisible(false)}
        onBackButtonPress={() => setStatusModalVisible(false)}
        backdropOpacity={0.65}
        backdropColor="#000000"
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={250}
        animationOutTiming={200}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        backdropTransitionOutTiming={1}
        style={{ margin: 20, justifyContent: "center", alignItems: "center" }}
      >
        <View className="w-full max-w-sm bg-surface rounded-3xl p-5 border border-border shadow-xl">
          <View className="flex-row items-center justify-between pb-3 border-b border-divider mb-3">
            <Text className="text-base font-bold text-foreground">
              Ubah Status Tugas
            </Text>
            <TouchableOpacity
              onPress={() => setStatusModalVisible(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={20} color="#71717a" />
            </TouchableOpacity>
          </View>

          <View className="gap-2">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => {
              const isCurrent = currentStatus === key;
              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.7}
                  onPress={() => handleStatusSelect(key)}
                  className={`flex-row items-center justify-between p-3.5 rounded-2xl border ${
                    isCurrent
                      ? "bg-surface-subtle border-foreground"
                      : "bg-surface border-border"
                  }`}
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      className={`w-9 h-9 rounded-xl items-center justify-center ${
                        key === "Active"
                          ? "bg-zinc-900"
                          : key === "Done"
                            ? "bg-emerald-100"
                            : "bg-zinc-100"
                      }`}
                    >
                      <Ionicons
                        name={config.icon}
                        size={18}
                        color={
                          key === "Active"
                            ? "#ffffff"
                            : key === "Done"
                              ? "#16a34a"
                              : "#71717a"
                        }
                      />
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-foreground">
                        {config.label}
                      </Text>
                      <Text className="text-xs text-muted">
                        {key === "Pending"
                          ? "Tugas dalam antrean"
                          : key === "Active"
                            ? "Fokus dikerjakan"
                            : "Telah selesai"}
                      </Text>
                    </View>
                  </View>
                  {isCurrent && (
                    <Ionicons name="checkmark" size={18} color="#18181b" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}
