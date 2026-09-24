import React, { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Modal } from "@/components/Modal";
import { formatSessionDuration } from "@/utils/dateHelpers";
import type { PomodoroMode } from "../store/usePomodoroStore";

export interface TaskCompletionSummaryData {
  taskTitle: string;
  projectName?: string;
  elapsedSeconds: number;
  remainingSeconds: number;
  mode: PomodoroMode;
  sessionNum: number;
  streakIncreased?: boolean;
}

interface TaskCompletionSummaryModalProps {
  visible: boolean;
  data: TaskCompletionSummaryData | null;
  onClose: () => void;
  onPickNextTask?: () => void;
}

export const TaskCompletionSummaryModal: React.FC<
  TaskCompletionSummaryModalProps
> = ({ visible, data, onClose, onPickNextTask }) => {
  const pendingActionRef = useRef<(() => void) | null>(null);

  if (!data) return null;

  const hasRemainingTime = data.remainingSeconds > 0;

  const handlePickNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    pendingActionRef.current = () => {
      onPickNextTask?.();
    };
    onClose();
  };

  const handleCloseOnly = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pendingActionRef.current = null;
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleCloseOnly}
      onBackButtonPress={handleCloseOnly}
      onModalHide={() => {
        if (pendingActionRef.current) {
          const action = pendingActionRef.current;
          pendingActionRef.current = null;
          action();
        }
      }}
      backdropOpacity={0.65}
      backdropColor="#000000"
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={250}
      animationOutTiming={200}
      backdropTransitionInTiming={250}
      backdropTransitionOutTiming={1}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      style={{ margin: 20, justifyContent: "center", alignItems: "center" }}
    >
      <View className="w-full max-w-sm bg-surface rounded-3xl p-6 border border-border items-center shadow-2xl">
        {/* Glowing Success Badge */}
        <View className="w-18 h-18 rounded-full bg-emerald-500/15 border border-emerald-500/30 items-center justify-center mb-3">
          <View className="w-12 h-12 rounded-full bg-emerald-500/20 items-center justify-center">
            <Ionicons name="checkmark-done" size={28} color="#10b981" />
          </View>
        </View>

        {/* Status Pill Tag */}
        <View className="flex-row items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2 gap-1.5">
          <Ionicons name="sparkles" size={12} color="#10b981" />
          <Text className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            Tugas Selesai! 🎉
          </Text>
        </View>

        {/* Task Title */}
        <Text
          className="text-lg font-bold text-foreground text-center"
          numberOfLines={2}
        >
          {data.taskTitle}
        </Text>

        {data.projectName && (
          <View className="flex-row items-center mt-1 gap-1">
            <Ionicons name="folder-outline" size={12} color="#71717a" />
            <Text className="text-xs text-muted" numberOfLines={1}>
              {data.projectName}
            </Text>
          </View>
        )}

        {/* Streak banner if increased */}
        {data.streakIncreased && (
          <View className="flex-row items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-xl mt-2.5">
            <Ionicons name="flame" size={13} color="#f59e0b" />
            <Text className="text-[11px] font-bold text-amber-700">
              Streak Harianmu Bertambah! 🔥
            </Text>
          </View>
        )}

        {/* Summary Stats Grid */}
        <View className="w-full bg-surface-subtle border border-border rounded-2xl p-3.5 my-4">
          <View className="flex-row items-center justify-between">
            {/* Waktu Fokus */}
            <View className="flex-1 items-center border-r border-border pr-2">
              <View className="flex-row items-center gap-1 mb-1">
                <Ionicons name="time-outline" size={12} color="#10b981" />
                <Text className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                  Waktu Fokus
                </Text>
              </View>
              <Text className="text-base font-extrabold text-foreground">
                {formatSessionDuration(data.elapsedSeconds)}
              </Text>
            </View>

            {/* Sisa Interval Pomodoro */}
            <View className="flex-1 items-center pl-2">
              <View className="flex-row items-center gap-1 mb-1">
                <Ionicons name="hourglass-outline" size={12} color="#6366f1" />
                <Text className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                  Sisa Waktu
                </Text>
              </View>
              <Text className="text-base font-extrabold text-foreground">
                {hasRemainingTime
                  ? formatSessionDuration(data.remainingSeconds)
                  : "0d"}
              </Text>
            </View>
          </View>

          {/* Motivational helper note */}
          <View className="mt-2.5 pt-2 border-t border-border flex-row items-center justify-center gap-1">
            <Text className="text-[11px] text-muted text-center leading-relaxed">
              {hasRemainingTime
                ? `Masih tersisa ${formatSessionDuration(
                    data.remainingSeconds,
                  )} dalam sesi ini. Lanjut tugas lain?`
                : "Sesi Pomodoro ini tuntas bersamaan dengan tugasmu!"}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="w-full gap-2">
          {hasRemainingTime && (
            <TouchableOpacity
              onPress={handlePickNext}
              activeOpacity={0.8}
              className="w-full py-3.5 bg-foreground rounded-2xl items-center flex-row justify-center gap-2 shadow-xs"
            >
              <Ionicons name="swap-vertical" size={16} color="#ffffff" />
              <Text className="text-sm font-bold text-background">
                Pilih Tugas Berikutnya
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleCloseOnly}
            activeOpacity={0.8}
            className={`w-full py-3 rounded-2xl items-center flex-row justify-center gap-1.5 ${
              hasRemainingTime
                ? "bg-surface-subtle border border-border"
                : "bg-foreground"
            }`}
          >
            <Ionicons
              name={hasRemainingTime ? "close-outline" : "checkmark-outline"}
              size={15}
              color={hasRemainingTime ? "#71717a" : "#ffffff"}
            />
            <Text
              className={`text-sm font-semibold ${
                hasRemainingTime
                  ? "text-foreground"
                  : "text-background font-bold"
              }`}
            >
              {hasRemainingTime ? "Cukup untuk Sekarang" : "Tutup"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
