import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useGetTaskById, useUpdateTask } from "@/features/task/hooks/useTask";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/Button";
import PomodoroTimer from "@/features/pomodoro/components/PomodoroTimer";
import TaskPickerModal from "@/features/pomodoro/components/TaskPickerModal";
import { usePomodoroStore } from "@/features/pomodoro/store/usePomodoroStore";
import { Task } from "@/features/task/types/task.types";

export default function FocusTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [taskPickerVisible, setTaskPickerVisible] = useState(false);

  const { activeTask, setActiveTask, isActive, isPaused, pauseTimer } =
    usePomodoroStore();
  const updateTaskMutation = useUpdateTask();

  const taskQuery = useGetTaskById({
    id: (id as string) || "",
    queryConfig: {
      enabled: !!id && id !== "",
      staleTime: 0,
    },
  });

  // Sync task param and mark active when opened via route param ?id=...
  useEffect(() => {
    if (id && taskQuery.data) {
      if (taskQuery.data.status === "Done") {
        setActiveTask(null);
        router.setParams({ id: "" });
      } else {
        setActiveTask({
          id: taskQuery.data.id,
          title: taskQuery.data.title,
          project_id: taskQuery.data.project_id || taskQuery.data.project?.id,
          projectName: taskQuery.data.project?.name,
        });

        // Ensure task status is marked Active in database
        if (taskQuery.data.status !== "Active") {
          updateTaskMutation.mutate({
            id: taskQuery.data.id,
            data: { status: "Active" },
          });
        }
      }
    }
  }, [id, taskQuery.data]);

  const handleSelectTask = (task: Task | null) => {
    if (task) {
      setActiveTask({
        id: task.id,
        title: task.title,
        project_id: task.project_id || task.project?.id,
        projectName: task.project?.name,
      });
      router.setParams({ id: task.id });

      // Mark the selected task as Active
      if (task.status !== "Active") {
        updateTaskMutation.mutate({
          id: task.id,
          data: { status: "Active" },
        });
      }
    } else {
      // User chose Standalone Focus (Quick Focus) without specific task
      const prevTaskId = activeTask?.id;
      setActiveTask(null);
      router.setParams({ id: "" });

      if (prevTaskId) {
        updateTaskMutation.mutate({
          id: prevTaskId,
          data: { status: "Pending" },
        });
      }
    }
  };

  const handleMarkTaskComplete = () => {
    if (!activeTask?.id) return;

    Alert.alert(
      "Tandai Selesai",
      `Apakah Anda yakin ingin menandai tugas "${activeTask.title}" sebagai selesai?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Tandai Selesai",
          style: "default",
          onPress: () => {
            const taskId = activeTask.id;

            // Pause running timer so user doesn't lose focus time while selecting next task
            if (isActive && !isPaused) {
              pauseTimer();
            }

            updateTaskMutation.mutate(
              {
                id: taskId,
                data: {
                  status: "Done",
                  completed_at: new Date().toISOString(),
                },
              },
              {
                onSuccess: () => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                  );
                  setActiveTask(null);
                  router.setParams({ id: "" });
                  // Open task picker so user can pick their next target task
                  setTaskPickerVisible(true);
                },
              },
            );
          },
        },
      ],
    );
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header */}
        <ScreenHeader
          title="Sesi Fokus"
          subtitle="Tingkatkan konsentrasi melalui interval Pomodoro"
        />

        {/* 2. Target Task Selector Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setTaskPickerVisible(true)}
          className="bg-surface p-4 rounded-2xl flex-row items-center my-3 border border-border shadow-xs"
        >
          <View className="w-10 h-10 rounded-xl bg-surface-subtle border border-border items-center justify-center mr-3">
            <Ionicons
              name={activeTask ? "flash" : "flash-outline"}
              size={18}
              color="#18181b"
            />
          </View>
          <View className="flex-1 mr-2">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-muted text-[11px] font-semibold uppercase tracking-wider">
                Target Fokus
              </Text>
              {activeTask && (
                <View className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                  <Text className="text-[9px] font-bold text-emerald-700">
                    Aktif
                  </Text>
                </View>
              )}
            </View>
            <Text
              className="text-foreground text-sm font-bold mt-0.5"
              numberOfLines={1}
            >
              {activeTask?.title || "Pilih Tugas yang Ingin Difokuskan"}
            </Text>
          </View>

          <View className="flex-row items-center bg-surface-subtle px-2.5 py-1.5 rounded-xl border border-border">
            <Text className="text-foreground font-semibold text-xs mr-1">
              {activeTask ? "Ganti" : "Pilih"}
            </Text>
            <Ionicons name="swap-vertical" size={13} color="#18181b" />
          </View>
        </TouchableOpacity>

        {/* 3. Pomodoro Timer Component */}
        <View className="bg-surface p-5 rounded-2xl border border-border my-1 items-center shadow-xs">
          <PomodoroTimer />
        </View>

        <View style={{ height: Math.max(insets.bottom + 80, 90) }} />
      </ScrollView>

      {/* Sticky Bottom Action (Mark Task Complete) */}
      {activeTask && (
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          className="px-4 pt-3 bg-surface border-t border-border shadow-md"
        >
          <Button
            iconLeft={
              <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
            }
            label="Tandai Tugas Ini Selesai"
            variant="primary"
            isLoading={updateTaskMutation.isPending}
            onPress={handleMarkTaskComplete}
          />
        </View>
      )}

      {/* Task Picker Modal */}
      <TaskPickerModal
        visible={taskPickerVisible}
        onClose={() => setTaskPickerVisible(false)}
        onSelectTask={handleSelectTask}
        selectedTaskId={activeTask?.id}
      />
    </View>
  );
}
