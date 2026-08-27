import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  useGetTasks,
  useSetActiveTask,
  useUpdateTask,
} from "@/features/task/hooks/useTask";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/Button";
import PomodoroTimer from "@/features/pomodoro/components/PomodoroTimer";
import TaskPickerModal from "@/features/pomodoro/components/TaskPickerModal";
import { usePomodoroStore } from "@/features/pomodoro/store/usePomodoroStore";
import type { Task } from "@/features/task/types/task.types";

export default function FocusTab() {
  const insets = useSafeAreaInsets();
  const [taskPickerVisible, setTaskPickerVisible] = useState(false);
  const hasInitializedFromDb = useRef(false);

  const { activeTask, setActiveTask, isActive, isPaused, pauseTimer } =
    usePomodoroStore();
  const setActiveTaskMutation = useSetActiveTask();
  const updateTaskMutation = useUpdateTask();
  const { data: allTasks } = useGetTasks();

  // Default target focus to task with status "Active" once on initial load (if none is active in store)
  useEffect(() => {
    if (allTasks && !hasInitializedFromDb.current) {
      hasInitializedFromDb.current = true;
      if (!activeTask) {
        const activeDbTask = allTasks.find((t) => t.status === "Active");
        if (activeDbTask) {
          setActiveTask({
            id: activeDbTask.id,
            title: activeDbTask.title,
            project_id: activeDbTask.project_id || activeDbTask.project?.id,
            projectName: activeDbTask.project?.name,
          });
        }
      }
    }
  }, [allTasks, activeTask, setActiveTask]);

  // Sync if current activeTask in store was marked Done in DB
  useEffect(() => {
    if (activeTask && allTasks) {
      const matchingTask = allTasks.find((t) => t.id === activeTask.id);
      if (matchingTask && matchingTask.status === "Done") {
        setActiveTask(null);
      }
    }
  }, [allTasks, activeTask, setActiveTask]);

  const handleSelectTask = (task: Task | null) => {
    hasInitializedFromDb.current = true;
    const prevTaskId = activeTask?.id;

    setActiveTask(
      task
        ? {
            id: task.id,
            title: task.title,
            project_id: task.project_id || task.project?.id,
            projectName: task.project?.name,
          }
        : null,
    );

    const prevTaskInDb = allTasks?.find((t) => t.id === prevTaskId);
    const newTaskInDb = task
      ? allTasks?.find((t) => t.id === task.id) || task
      : null;

    const shouldRevertPrev = !!(
      prevTaskId &&
      prevTaskId !== task?.id &&
      prevTaskInDb?.status === "Active"
    );
    const shouldActivateNew = !!(task && newTaskInDb?.status !== "Active");

    if (shouldRevertPrev || shouldActivateNew) {
      setActiveTaskMutation.mutate({
        prevTaskId: shouldRevertPrev ? prevTaskId : null,
        newTaskId: shouldActivateNew && task ? task.id : null,
      });
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
          <PomodoroTimer
            onRequestOpenTaskPicker={() => setTaskPickerVisible(true)}
          />
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
