import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused, useRouter } from "expo-router";
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
import { useCreatePomodoro } from "@/features/pomodoro/hooks/usePomodoro";
import { ambientAudioService } from "@/features/pomodoro/services/ambientAudioService";
import { pomodoroNotificationService } from "@/features/pomodoro/services/pomodoroNotificationService";
import { useStreakCelebrationStore } from "@/features/task/stores/useStreakCelebrationStore";
import {
  TaskCompletionSummaryModal,
  type TaskCompletionSummaryData,
} from "@/features/pomodoro/components/TaskCompletionSummaryModal";
import type { Task } from "@/features/task/types/task.types";

export default function FocusTab() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [taskPickerVisible, setTaskPickerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isCompletingTask, setIsCompletingTask] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [summaryData, setSummaryData] =
    useState<TaskCompletionSummaryData | null>(null);
  const hasInitializedFromDb = useRef(false);

  const {
    activeTask,
    setActiveTask,
    isActive,
    isPaused,
    mode,
    time,
    total,
    startedAt,
    cycleIndex,
    pauseTimer,
    resumeTimer,
    taskInitialRemaining,
  } = usePomodoroStore();
  const setActiveTaskMutation = useSetActiveTask();
  const updateTaskMutation = useUpdateTask();
  const createPomodoroMutation = useCreatePomodoro();
  const { data: allTasks, refetch: refetchTasks } = useGetTasks({
    queryConfig: {
      subscribed: isFocused,
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchTasks();
    } finally {
      setRefreshing(false);
    }
  }, [refetchTasks]);

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

  // Sync if current activeTask in store was marked Done in DB (e.g. from task list or detail screen)
  useEffect(() => {
    if (activeTask && allTasks) {
      const matchingTask = allTasks.find((t) => t.id === activeTask.id);
      if (matchingTask && matchingTask.status === "Done") {
        const taskId = activeTask.id;
        const startRemaining = taskInitialRemaining ?? total;
        const elapsedSeconds = Math.max(0, startRemaining - time);
        if (elapsedSeconds > 0 && mode === "pomodoro") {
          createPomodoroMutation
            .mutateAsync({
              task_id: taskId,
              mode: "pomodoro",
              duration: elapsedSeconds,
              cycle_index: cycleIndex,
              session_num: Math.floor(cycleIndex / 2) + 1,
              started_at:
                startedAt ||
                new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
              ended_at: new Date().toISOString(),
              completed: true,
            })
            .catch((err) => {
              console.error("Gagal auto-save sesi pomodoro:", err);
            });
          ambientAudioService.pauseAmbient();
          pomodoroNotificationService.cancelScheduledNotifications();
          pauseTimer();
        }
        setActiveTask(null);
      }
    }
  }, [
    allTasks,
    activeTask,
    setActiveTask,
    total,
    time,
    taskInitialRemaining,
    mode,
    cycleIndex,
    startedAt,
    createPomodoroMutation,
    pauseTimer,
  ]);

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
    if (!activeTask?.id || isCompletingTask) return;

    // Jeda timer & audio ambient seketika saat dialog konfirmasi muncul
    const wasRunning = isActive && !isPaused;
    if (wasRunning) {
      ambientAudioService.pauseAmbient();
      pomodoroNotificationService.cancelScheduledNotifications();
      pauseTimer();
    }

    let actionTaken = false;
    const handleCancel = async () => {
      if (wasRunning) {
        resumeTimer();
        if (mode === "pomodoro") {
          const focusMinutes = Math.round(total / 60);
          await pomodoroNotificationService.scheduleSessionCompleteNotification(
            time,
            activeTask?.title,
            focusMinutes,
          );
          await ambientAudioService.playAmbient();
        } else {
          await pomodoroNotificationService.scheduleSessionCompleteNotification(
            time,
            "Waktu istirahat selesai! Mari kembali ke sesi fokus.",
          );
        }
      }
    };

    Alert.alert(
      "Tandai Selesai",
      `Apakah Anda yakin ingin menandai tugas "${activeTask.title}" sebagai selesai?`,
      [
        {
          text: "Batal",
          style: "cancel",
          onPress: () => {
            actionTaken = true;
            handleCancel();
          },
        },
        {
          text: "Tandai Selesai",
          style: "default",
          onPress: async () => {
            actionTaken = true;
            setIsCompletingTask(true);
            const taskId = activeTask.id;
            const startRemaining = taskInitialRemaining ?? total;
            const elapsedSeconds = Math.max(0, startRemaining - time);

            try {
              // 1. Simpan riwayat sesi Pomodoro jika waktu fokus sudah berjalan
              if (elapsedSeconds > 0 && mode === "pomodoro") {
                try {
                  await createPomodoroMutation.mutateAsync({
                    task_id: taskId,
                    mode: "pomodoro",
                    duration: elapsedSeconds,
                    cycle_index: cycleIndex,
                    session_num: Math.floor(cycleIndex / 2) + 1,
                    started_at:
                      startedAt ||
                      new Date(
                        Date.now() - elapsedSeconds * 1000,
                      ).toISOString(),
                    ended_at: new Date().toISOString(),
                    completed: true,
                  });
                } catch (err) {
                  console.error(
                    "Gagal menyimpan sesi pomodoro saat tugas diselesaikan lebih awal:",
                    err,
                  );
                }
              }

              // 2. Pause timer dan audio ambient (waktu tidak direset)
              ambientAudioService.pauseAmbient();
              pomodoroNotificationService.cancelScheduledNotifications();
              pauseTimer();

              // 3. Update status tugas menjadi 'Done'
              const updatedData = await updateTaskMutation.mutateAsync({
                id: taskId,
                data: {
                  status: "Done",
                  completed_at: new Date().toISOString(),
                },
              });

              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );

              const summary: TaskCompletionSummaryData = {
                taskTitle: activeTask.title,
                projectName: activeTask.projectName,
                elapsedSeconds,
                remainingSeconds: time,
                mode,
                sessionNum: Math.floor(cycleIndex / 2) + 1,
                streakIncreased: !!updatedData?.streak_update?.streakIncreased,
              };
              setSummaryData(summary);
              setActiveTask(null);

              if (updatedData?.streak_update?.streakIncreased) {
                useStreakCelebrationStore
                  .getState()
                  .setOnDismissCallback(() => {
                    setSummaryModalVisible(true);
                  });
              } else {
                setSummaryModalVisible(true);
              }
            } catch (err) {
              console.error("Gagal menyelesaikan tugas:", err);
            } finally {
              setIsCompletingTask(false);
            }
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          if (!actionTaken) {
            handleCancel();
          }
        },
      },
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#18181b"
            colors={["#18181b"]}
            enabled={!isActive}
          />
        }
      >
        {/* 1. Header */}
        <ScreenHeader
          title="Sesi Fokus"
          subtitle="Tingkatkan konsentrasi melalui interval Pomodoro"
          rightAction={
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                router.navigate("/profile/pomodoro" as any);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Pengaturan Pomodoro"
              className="p-2 rounded-xl bg-surface border border-border items-center justify-center shadow-2xs"
            >
              <Ionicons name="settings-outline" size={18} color="#18181b" />
            </TouchableOpacity>
          }
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

        <View style={{ height: activeTask ? 80 : 24 }} />
      </ScrollView>

      {/* Sticky Bottom Action (Mark Task Complete) */}
      {activeTask && (
        <View className="px-4 py-3 bg-surface border-t border-border shadow-md">
          <Button
            iconLeft={
              <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
            }
            label="Tandai Tugas Ini Selesai"
            variant="primary"
            isLoading={updateTaskMutation.isPending || isCompletingTask}
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

      {/* Task Completion Summary Modal */}
      <TaskCompletionSummaryModal
        visible={summaryModalVisible}
        data={summaryData}
        onClose={() => setSummaryModalVisible(false)}
        onPickNextTask={() => setTaskPickerVisible(true)}
      />
    </View>
  );
}
