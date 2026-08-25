import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  AppStateStatus,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "@/components/Modal";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useQueryClient } from "@tanstack/react-query";
import {
  COLORS,
  CYCLE,
  DURATIONS,
  MODE_LABELS,
  PomodoroMode,
  usePomodoroStore,
} from "../store/usePomodoroStore";
import { getPomodoroQueryKey, useCreatePomodoro } from "../hooks/usePomodoro";
import {
  getTaskByIdQueryKey,
  getTaskQueryKey,
} from "@/features/task/hooks/useTask";
import QuickBlockerModal from "./QuickBlockerModal";

const TABS: { key: PomodoroMode; label: string }[] = [
  { key: "pomodoro", label: "Fokus" },
  { key: "shortBreak", label: "Short Break" },
  { key: "longBreak", label: "Long Break" },
];

const CIRCUMFERENCE = 2 * Math.PI * 100;

export default function PomodoroTimer() {
  const queryClient = useQueryClient();
  const createPomodoroMutation = useCreatePomodoro();

  const {
    mode,
    time,
    total,
    isActive,
    isPaused,
    sessionsCount,
    cycleIndex,
    activeTask,
    startedAt,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetCycle,
    tick,
    recalcTime,
    advanceNextMode,
  } = usePomodoroStore();

  const [blockerModalVisible, setBlockerModalVisible] = useState(false);
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [lastCompletedMode, setLastCompletedMode] =
    useState<PomodoroMode>("pomodoro");

  // Interval & Wall-Clock Countdown management
  useEffect(() => {
    let intervalId: any = null;

    if (isActive && !isPaused) {
      intervalId = setInterval(async () => {
        const { isFinished } = tick();
        if (isFinished) {
          clearInterval(intervalId);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          const result = advanceNextMode();
          setLastCompletedMode(result.finishedMode);
          setCompletionModalVisible(true);

          // Save to database if a task is attached (for pomodoro, shortBreak, and longBreak)
          if (activeTask?.id) {
            try {
              await createPomodoroMutation.mutateAsync({
                task_id: activeTask.id,
                mode: result.finishedMode,
                duration: result.finishedDuration,
                cycle_index: result.finishedCycleIndex,
                session_num: result.finishedSessionNum,
                started_at: startedAt || new Date().toISOString(),
                ended_at: new Date().toISOString(),
                completed: true,
              });

              // Invalidate queries so task stats and pomodoro history update immediately
              queryClient.invalidateQueries({
                queryKey: getTaskByIdQueryKey(activeTask.id),
              });
              queryClient.invalidateQueries({
                queryKey: getTaskQueryKey(),
              });
              queryClient.invalidateQueries({
                queryKey: getPomodoroQueryKey(),
              });
            } catch (err) {
              console.error("Failed to save pomodoro session:", err);
            }
          }
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    isActive,
    isPaused,
    tick,
    advanceNextMode,
    activeTask,
    startedAt,
    createPomodoroMutation,
    queryClient,
  ]);

  // AppState Listener: Resync accurate time when app comes back to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState: AppStateStatus) => {
        if (nextAppState === "active" && isActive && !isPaused) {
          const { isFinished } = recalcTime();
          if (isFinished) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            const result = advanceNextMode();
            setLastCompletedMode(result.finishedMode);
            setCompletionModalVisible(true);

            if (activeTask?.id) {
              try {
                await createPomodoroMutation.mutateAsync({
                  task_id: activeTask.id,
                  mode: result.finishedMode,
                  duration: result.finishedDuration,
                  cycle_index: result.finishedCycleIndex,
                  session_num: result.finishedSessionNum,
                  started_at: startedAt || new Date().toISOString(),
                  ended_at: new Date().toISOString(),
                  completed: true,
                });

                queryClient.invalidateQueries({
                  queryKey: getTaskByIdQueryKey(activeTask.id),
                });
                queryClient.invalidateQueries({
                  queryKey: getTaskQueryKey(),
                });
                queryClient.invalidateQueries({
                  queryKey: getPomodoroQueryKey(),
                });
              } catch (err) {
                console.error("Failed to save pomodoro session:", err);
              }
            }
          }
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [
    isActive,
    isPaused,
    recalcTime,
    advanceNextMode,
    activeTask,
    startedAt,
    createPomodoroMutation,
    queryClient,
  ]);

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startTimer();
  };

  const handlePauseResume = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  const handleResetCycle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Reset Siklus Pomodoro",
      "Apakah Anda yakin ingin mengulang seluruh siklus Pomodoro dari awal (Sesi 1)?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Reset Siklus",
          style: "destructive",
          onPress: () => resetCycle(),
        },
      ],
    );
  };

  const handleStop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Reset Timer",
      "Apakah Anda yakin ingin mengatur ulang waktu sesi ini?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => stopTimer() },
      ],
    );
  };

  const nextMode = CYCLE[(cycleIndex + 1) % CYCLE.length];
  const nextLabel = `${MODE_LABELS[nextMode]} · ${Math.round(DURATIONS[nextMode] / 60)}m`;

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Lewati Sesi",
      `Apakah Anda yakin ingin melewati "${MODE_LABELS[mode]}" dan lanjut ke "${MODE_LABELS[nextMode]}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Lewati",
          style: "default",
          onPress: () => {
            advanceNextMode();
          },
        },
      ],
    );
  };

  const progress = total > 0 ? ((total - time) / total) * 100 : 0;
  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100;

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const modeColor =
    mode === "pomodoro"
      ? "#18181b"
      : mode === "shortBreak"
        ? "#16a34a"
        : "#2563eb";

  return (
    <View className="items-center w-full">
      {/* Mode Segmented Indicator & Reset Cycle Button */}
      <View className="relative w-full flex-row items-center justify-center mb-4">
        <View className="flex-row bg-surface-subtle p-1 rounded-xl border border-border">
          {TABS.map(({ key, label }) => {
            const isSelected = mode === key;
            return (
              <View
                key={key}
                className={`px-3.5 py-1.5 rounded-lg border ${
                  isSelected
                    ? "bg-surface border-border shadow-xs"
                    : "bg-transparent border-transparent"
                }`}
              >
                <Text
                  className={`text-xs ${
                    isSelected
                      ? "text-foreground font-bold"
                      : "text-muted font-medium"
                  }`}
                >
                  {label}
                </Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleResetCycle}
          activeOpacity={0.7}
          accessibilityLabel="Reset Siklus"
          className="absolute right-0 p-2 rounded-xl bg-surface-subtle border border-border items-center justify-center shadow-2xs"
        >
          <Ionicons name="refresh-outline" size={16} color="#71717a" />
        </TouchableOpacity>
      </View>

      {/* Circular Timer Ring */}
      <View className="relative w-64 h-64 items-center justify-center my-2">
        <Svg
          className="absolute w-full h-full"
          viewBox="0 0 240 240"
          style={{ transform: [{ rotate: "-90deg" }] }}
        >
          <Circle
            cx="120"
            cy="120"
            r={100}
            strokeWidth={7}
            fill="none"
            stroke="#f4f4f5"
          />
          <Circle
            cx="120"
            cy="120"
            r={100}
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            stroke={modeColor}
          />
        </Svg>

        <View className="absolute items-center gap-1">
          <Text className="text-[11px] uppercase tracking-widest font-semibold text-muted">
            {MODE_LABELS[mode]}
          </Text>
          <Text
            className="font-bold tabular-nums text-foreground"
            style={{ fontSize: 52, letterSpacing: -2, lineHeight: 56 }}
          >
            {formatTime(time)}
          </Text>
          <Text className="text-[11px] font-mono text-muted">
            {Math.round(progress)}% · {Math.ceil(time / 60)}m tersisa
          </Text>

          {/* 4-Session Dots Indicator */}
          <View className="flex-row gap-1.5 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <View
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < sessionsCount
                    ? "bg-foreground"
                    : i === sessionsCount && mode === "pomodoro"
                      ? "bg-zinc-400"
                      : "bg-border"
                }`}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Control Buttons */}
      <View className="flex-row items-center gap-2 mt-4">
        {!isActive ? (
          <>
            <ControlButton
              label={mode === "pomodoro" ? "Mulai Fokus" : "Mulai Istirahat"}
              icon="play"
              variant="primary"
              onPress={handleStart}
            />
            <ControlButton
              label="Lewati"
              icon="play-skip-forward-outline"
              variant="outline"
              onPress={handleSkip}
            />
          </>
        ) : (
          <>
            <ControlButton
              label={isPaused ? "Lanjutkan" : "Jeda"}
              icon={isPaused ? "play" : "pause"}
              variant="secondary"
              onPress={handlePauseResume}
            />
            <ControlButton
              label="Reset"
              icon="refresh-outline"
              variant="outline"
              onPress={handleStop}
            />
            <ControlButton
              label="Lewati"
              icon="play-skip-forward-outline"
              variant="outline"
              onPress={handleSkip}
            />
          </>
        )}
      </View>

      {/* Deep Work Actions: Blocker Logger Trigger */}
      {isActive && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setBlockerModalVisible(true)}
          className="flex-row items-center mt-3.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200"
        >
          <Ionicons name="alert-circle-outline" size={13} color="#dc2626" />
          <Text className="text-[11px] font-bold text-red-700 ml-1">
            Ada Distraksi / Hambatan? Catat di Sini
          </Text>
        </TouchableOpacity>
      )}

      {/* Next Mode Indicator */}
      <View className="flex-row items-center mt-4 gap-1.5">
        <Ionicons name="arrow-forward-outline" size={12} color="#71717a" />
        <Text className="text-[11px] text-muted">Berikutnya:</Text>
        <View className="rounded-md px-2 py-0.5 bg-surface-subtle border border-border">
          <Text className="text-[11px] font-semibold text-foreground">
            {nextLabel}
          </Text>
        </View>
      </View>

      {/* Quick Blocker Modal */}
      <QuickBlockerModal
        visible={blockerModalVisible}
        onClose={() => setBlockerModalVisible(false)}
        taskTitle={activeTask?.title}
        projectId={activeTask?.project_id}
      />
      {/* Session Completion Transition Modal */}
      <Modal
        isVisible={completionModalVisible}
        onBackdropPress={() => setCompletionModalVisible(false)}
        onBackButtonPress={() => setCompletionModalVisible(false)}
        backdropOpacity={0.65}
        backdropColor="#000000"
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={250}
        animationOutTiming={200}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        backdropTransitionOutTiming={1}
        style={{ margin: 20, justifyContent: "center", alignItems: "center" }}
      >
        <View className="w-full max-w-sm bg-surface rounded-3xl p-6 border border-border items-center shadow-2xl">
          <View className="w-14 h-14 rounded-2xl bg-emerald-100 items-center justify-center mb-3">
            <Ionicons name="checkmark-circle" size={32} color="#16a34a" />
          </View>
          <Text className="text-lg font-bold text-foreground text-center">
            {lastCompletedMode === "pomodoro"
              ? "Sesi Fokus Tuntas! 🎉"
              : "Waktu Istirahat Selesai!"}
          </Text>
          <Text className="text-xs text-muted text-center mt-1 mb-5 leading-relaxed">
            {lastCompletedMode === "pomodoro"
              ? `Kerja bagus! 25 menit fokus telah dicatat.${
                  activeTask ? ` Progres '${activeTask.title}' bertambah.` : ""
                } Saatnya rehat sejenak.`
              : "Pikiran Anda telah segar kembali. Siap melanjutkan deep work?"}
          </Text>

          <TouchableOpacity
            onPress={() => {
              setCompletionModalVisible(false);
              startTimer();
            }}
            activeOpacity={0.8}
            className="w-full py-3 bg-foreground rounded-2xl items-center mb-2"
          >
            <Text className="text-sm font-bold text-background">
              {lastCompletedMode === "pomodoro"
                ? "Mulai Istirahat Sekarang"
                : "Mulai Sesi Fokus Berikutnya"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCompletionModalVisible(false)}
            className="py-2"
          >
            <Text className="text-xs font-semibold text-muted">Tutup</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

type ControlButtonProps = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  variant: "primary" | "secondary" | "outline";
  onPress: () => void;
};

function ControlButton({ label, icon, variant, onPress }: ControlButtonProps) {
  const styles = {
    primary: "bg-primary border-primary",
    secondary: "bg-surface-subtle border-border",
    outline: "bg-surface border-border",
  };

  const textColor =
    variant === "primary" ? "text-primary-foreground" : "text-foreground";
  const iconColor = variant === "primary" ? "#ffffff" : "#18181b";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`flex-row items-center rounded-xl px-3.5 py-2.5 border ${styles[variant]} shadow-xs`}
    >
      <Ionicons
        name={icon}
        size={15}
        color={iconColor}
        style={{ marginRight: 4 }}
      />
      <Text className={`text-xs font-bold ${textColor}`}>{label}</Text>
    </TouchableOpacity>
  );
}
