import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Haptics from "expo-haptics";
import {
  CYCLE,
  MODE_LABELS,
  type PomodoroMode,
  usePomodoroStore,
} from "../store/usePomodoroStore";
import { useCreatePomodoro } from "../hooks/usePomodoro";
import { useUpdateTask } from "@/features/task/hooks/useTask";
import { ambientAudioService } from "../services/ambientAudioService";
import { pomodoroNotificationService } from "../services/pomodoroNotificationService";
import {
  useVibeModeStore,
  type LandscapeDisplayMode,
} from "../store/useVibeModeStore";
import { VibePlayerBackground } from "./VibePlayerBackground";
import VibeVideoPickerModal from "./VibeVideoPickerModal";

interface ZenDeskModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenBlocker: () => void;
  onStart: (mode?: PomodoroMode) => Promise<void>;
  onPauseResume: () => Promise<void>;
  onRequestOpenTaskPicker?: () => void;
}

const ZEN_THEME = {
  bg: "#09090b", // AMOLED deep black
  cardBg: "#18181b", // Zinc 900
  cardBorder: "#27272a", // Zinc 800
  subtleBg: "#18181b",
  textPrimary: "#fafafa", // Zinc 50 crisp white
  textSecondary: "#a1a1aa", // Zinc 400
  textMuted: "#71717a", // Zinc 500
  modes: {
    pomodoro: {
      accent: "#10b981", // Emerald 500
      badgeBg: "rgba(16, 185, 129, 0.15)",
      badgeBorder: "rgba(16, 185, 129, 0.35)",
      textOnAccent: "#09090b",
    },
    shortBreak: {
      accent: "#3b82f6", // Blue 500
      badgeBg: "rgba(59, 130, 246, 0.15)",
      badgeBorder: "rgba(59, 130, 246, 0.35)",
      textOnAccent: "#09090b",
    },
    longBreak: {
      accent: "#818cf8", // Indigo 400
      badgeBg: "rgba(129, 140, 248, 0.15)",
      badgeBorder: "rgba(129, 140, 248, 0.35)",
      textOnAccent: "#09090b",
    },
  },
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export default function ZenDeskModal({
  visible,
  onClose,
  onOpenBlocker,
  onStart,
  onPauseResume,
  onRequestOpenTaskPicker,
}: ZenDeskModalProps) {
  const insets = useSafeAreaInsets();
  const updateTaskMutation = useUpdateTask();
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
    setActiveTask,
    advanceNextMode,
    stopTimer,
    pauseTimer,
    resumeTimer,
    taskInitialRemaining,
  } = usePomodoroStore();

  const [transitionFinishedMode, setTransitionFinishedMode] =
    useState<PomodoroMode | null>(null);

  const {
    displayMode,
    dimmerOpacity,
    videoFit,
    isInitialized: isVibeInitialized,
    setDisplayMode,
    initializeVibePreferences,
    getActiveVideoId,
  } = useVibeModeStore();

  const [vibePickerVisible, setVibePickerVisible] = useState(false);
  const [isTimerMinimized, setIsTimerMinimized] = useState(false);

  useEffect(() => {
    if (visible && !isVibeInitialized) {
      initializeVibePreferences();
    }
  }, [visible, isVibeInitialized]);

  // Audio coordination: if Vibe Mode is active, pause ambient audio service so YouTube audio plays clean
  useEffect(() => {
    if (visible && displayMode === "vibe") {
      ambientAudioService.pauseAmbient();
    }
  }, [visible, displayMode]);

  const handleSetDisplayMode = async (nextMode: LandscapeDisplayMode) => {
    Haptics.selectionAsync();
    await setDisplayMode(nextMode);
    if (nextMode === "vibe") {
      ambientAudioService.pauseAmbient();
    } else if (
      nextMode === "zen" &&
      isActive &&
      !isPaused &&
      mode === "pomodoro"
    ) {
      await ambientAudioService.playAmbient();
    }
  };

  // Screen orientation, Navigation Bar & Keep-Awake lifecycle management
  useEffect(() => {
    if (visible) {
      // Lock to landscape and hide system status bar
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      ).catch((err) => {
        console.warn("Failed to lock landscape orientation:", err);
      });
      StatusBar.setHidden(true, "fade");

      // Hide Android system navigation bar
      if (Platform.OS === "android") {
        try {
          NavigationBar.setVisibilityAsync("hidden").catch(() => {});
          NavigationBar.setStyle("dark");
        } catch (err) {
          console.warn("Failed to hide navigation bar:", err);
        }
      }

      // Keep screen awake while in Zen Desk Mode
      activateKeepAwakeAsync("zen-desk-mode").catch((err) => {
        console.warn("Failed to activate keep awake:", err);
      });
    } else {
      // Revert to portrait and restore system status bar & navigation bar
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      ).catch((err) => {
        console.warn("Failed to lock portrait orientation:", err);
      });
      StatusBar.setHidden(false, "fade");

      if (Platform.OS === "android") {
        try {
          NavigationBar.setVisibilityAsync("visible").catch(() => {});
          NavigationBar.setStyle("auto");
        } catch (err) {
          console.warn("Failed to restore navigation bar:", err);
        }
      }

      deactivateKeepAwake("zen-desk-mode");
      setTransitionFinishedMode(null);
    }

    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      ).catch(() => {});
      StatusBar.setHidden(false, "fade");

      if (Platform.OS === "android") {
        try {
          NavigationBar.setVisibilityAsync("visible").catch(() => {});
          NavigationBar.setStyle("auto");
        } catch {}
      }

      deactivateKeepAwake("zen-desk-mode");
    };
  }, [visible]);

  // Catch when timer finishes while in Zen Mode
  useEffect(() => {
    if (visible && isActive && time === 0) {
      setTransitionFinishedMode(mode);
    }
  }, [visible, isActive, time, mode]);

  const activeTheme = ZEN_THEME.modes[mode] || ZEN_THEME.modes.pomodoro;
  const progressPercent =
    total > 0 ? Math.min(100, Math.max(0, ((total - time) / total) * 100)) : 0;

  const handleStartNext = async (targetMode: PomodoroMode) => {
    setTransitionFinishedMode(null);
    await onStart(targetMode);
  };

  const handleMarkTaskComplete = async () => {
    if (!activeTask?.id) return;
    const taskId = activeTask.id;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const startRemaining = taskInitialRemaining ?? total;
    const elapsedSeconds = Math.max(0, startRemaining - time);
    // Simpan riwayat jika timer berjalan sebelum selesai secara natural (bukan dari transitionFinishedMode)
    if (!transitionFinishedMode && elapsedSeconds > 0 && mode === "pomodoro") {
      try {
        await createPomodoroMutation.mutateAsync({
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
        });
      } catch (err) {
        console.error(
          "Failed to save pomodoro session on early task completion in zen mode:",
          err,
        );
      }
      ambientAudioService.pauseAmbient();
      pomodoroNotificationService.cancelScheduledNotifications();
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
          setActiveTask(null);
          setTransitionFinishedMode(null);
          onRequestOpenTaskPicker?.();
        },
      },
    );
  };

  const nextMode = CYCLE[(cycleIndex + 1) % CYCLE.length];
  const currentSessionNum = Math.min(4, Math.floor(cycleIndex / 2) + 1);
  const cycleLabel =
    mode === "pomodoro"
      ? `Sesi ${currentSessionNum}/4`
      : mode === "shortBreak"
        ? `Rehat Singkat (${currentSessionNum}/3)`
        : "Rehat Panjang";

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

  const handleConfirmMarkTaskComplete = () => {
    if (!activeTask?.id) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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
          onPress: () => {
            actionTaken = true;
            handleMarkTaskComplete();
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

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      hardwareAccelerated={true}
      supportedOrientations={["landscape", "landscape-left", "landscape-right"]}
      onRequestClose={onClose}
    >
      <NavigationBar.NavigationBar hidden={true} style="dark" />

      {/* Vibe Mode Background YouTube Video Player */}
      {displayMode === "vibe" && (
        <VibePlayerBackground
          videoId={getActiveVideoId()}
          dimmerOpacity={dimmerOpacity}
          videoFit={videoFit}
        />
      )}

      {/* Tap-outside backdrop: when card is maximized in Vibe mode, tap anywhere outside automatically minimizes */}
      {displayMode === "vibe" && !isTimerMinimized && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            Haptics.selectionAsync();
            setIsTimerMinimized(true);
          }}
          style={StyleSheet.absoluteFill}
        />
      )}

      <View
        pointerEvents="box-none"
        style={{
          flex: 1,
          backgroundColor:
            displayMode === "vibe" ? "transparent" : ZEN_THEME.bg,
          justifyContent: "space-between",
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 16),
          paddingLeft: Math.max(insets.left, 24),
          paddingRight: Math.max(insets.right, 24),
        }}
      >
        {/* 1. Header Row */}
        <View
          pointerEvents="box-none"
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Mode Badge & Task Context */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              marginRight: 16,
              gap: 12,
            }}
          >
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: activeTheme.badgeBg,
                borderWidth: 1,
                borderColor: activeTheme.badgeBorder,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: activeTheme.accent,
                }}
              >
                {MODE_LABELS[mode]}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: ZEN_THEME.textMuted,
                  fontSize: 11,
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
                numberOfLines={1}
              >
                {activeTask?.projectName || "Sesi Mandiri"}
              </Text>
              <Text
                style={{
                  color: ZEN_THEME.textPrimary,
                  fontSize: 14,
                  fontWeight: "700",
                  marginTop: 1,
                }}
                numberOfLines={1}
              >
                {activeTask?.title || "Fokus Tanpa Tugas Tertentu"}
              </Text>
            </View>
          </View>

          {/* Right: Mode Switcher, Vibe Controls, Keep-Awake Pill, Blocker Button & Close */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {/* Vibe Specific Controls: Video Preset Picker (Icon Only, 34x34) */}
            {displayMode === "vibe" && (
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  setVibePickerVisible(true);
                }}
                activeOpacity={0.8}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: ZEN_THEME.subtleBg,
                  borderWidth: 1,
                  borderColor: ZEN_THEME.cardBorder,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="film-outline"
                  size={15}
                  color={ZEN_THEME.textPrimary}
                />
              </TouchableOpacity>
            )}

            {/* Mode Switcher: Zen vs Vibe (placed immediately to the left of Blocker) */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor:
                  displayMode === "vibe"
                    ? "rgba(24, 24, 27, 0.75)"
                    : ZEN_THEME.subtleBg,
                borderRadius: 999,
                padding: 3,
                borderWidth: 1,
                borderColor:
                  displayMode === "vibe"
                    ? "rgba(63, 63, 70, 0.6)"
                    : ZEN_THEME.cardBorder,
              }}
            >
              <TouchableOpacity
                onPress={() => handleSetDisplayMode("zen")}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor:
                    displayMode === "zen" ? "#27272a" : "transparent",
                }}
              >
                <Ionicons
                  name="leaf-outline"
                  size={11}
                  color={displayMode === "zen" ? "#10b981" : "#a1a1aa"}
                />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: displayMode === "zen" ? "700" : "500",
                    color: displayMode === "zen" ? "#fafafa" : "#a1a1aa",
                  }}
                >
                  Zen
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSetDisplayMode("vibe")}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor:
                    displayMode === "vibe"
                      ? "rgba(244, 63, 94, 0.25)"
                      : "transparent",
                  borderWidth: displayMode === "vibe" ? 1 : 0,
                  borderColor:
                    displayMode === "vibe"
                      ? "rgba(244, 63, 94, 0.4)"
                      : "transparent",
                }}
              >
                <Ionicons
                  name="sparkles"
                  size={11}
                  color={displayMode === "vibe" ? "#fb7185" : "#a1a1aa"}
                />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: displayMode === "vibe" ? "700" : "500",
                    color: displayMode === "vibe" ? "#fb7185" : "#a1a1aa",
                  }}
                >
                  Vibe
                </Text>
              </TouchableOpacity>
            </View>

            {/* Compact Blocker Button (Icon Only) */}
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                onOpenBlocker();
              }}
              activeOpacity={0.8}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: "rgba(220, 38, 38, 0.15)",
                borderWidth: 1,
                borderColor: "rgba(220, 38, 38, 0.35)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="warning-outline" size={15} color="#f87171" />
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                onClose();
              }}
              activeOpacity={0.8}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: ZEN_THEME.subtleBg,
                borderWidth: 1,
                borderColor: ZEN_THEME.cardBorder,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="close"
                size={18}
                color={ZEN_THEME.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Center Area: True Horizontal & Vertical Centering */}
        <View
          pointerEvents="box-none"
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {displayMode === "zen" ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                  fontSize: 96,
                  fontWeight: "900",
                  letterSpacing: 2,
                  color:
                    isActive && !isPaused
                      ? ZEN_THEME.textPrimary
                      : ZEN_THEME.textMuted,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {formatTime(time)}
              </Text>

              {/* Ambient Progress Bar */}
              <View
                style={{
                  width: "100%",
                  maxWidth: 460,
                  height: 6,
                  backgroundColor: ZEN_THEME.subtleBg,
                  borderRadius: 999,
                  overflow: "hidden",
                  marginTop: 12,
                  borderWidth: 1,
                  borderColor: ZEN_THEME.cardBorder,
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    backgroundColor: activeTheme.accent,
                    borderRadius: 999,
                  }}
                />
              </View>

              {/* Center Action Controls: Mulai, Lewati & Tugas Selesai */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginTop: 22,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (!isActive) {
                      onStart(mode);
                    } else {
                      onPauseResume();
                    }
                  }}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 22,
                    paddingVertical: 9,
                    borderRadius: 16,
                    backgroundColor:
                      isActive && !isPaused ? "#27272a" : activeTheme.accent,
                    borderWidth: 1,
                    borderColor:
                      isActive && !isPaused ? "#3f3f46" : activeTheme.accent,
                    gap: 8,
                  }}
                >
                  <Ionicons
                    name={!isActive || isPaused ? "play" : "pause"}
                    size={16}
                    color={
                      isActive && !isPaused
                        ? "#ffffff"
                        : activeTheme.textOnAccent
                    }
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color:
                        isActive && !isPaused
                          ? "#ffffff"
                          : activeTheme.textOnAccent,
                    }}
                  >
                    {!isActive ? "Mulai" : isPaused ? "Lanjutkan" : "Jeda"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSkip}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 9,
                    borderRadius: 16,
                    backgroundColor: ZEN_THEME.subtleBg,
                    borderWidth: 1,
                    borderColor: ZEN_THEME.cardBorder,
                    gap: 6,
                  }}
                >
                  <Ionicons
                    name="play-skip-forward-outline"
                    size={14}
                    color={ZEN_THEME.textSecondary}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: ZEN_THEME.textSecondary,
                    }}
                  >
                    Lewati
                  </Text>
                </TouchableOpacity>

                {/* Mark Task Complete Button */}
                {activeTask && (
                  <TouchableOpacity
                    onPress={handleConfirmMarkTaskComplete}
                    activeOpacity={0.8}
                    disabled={updateTaskMutation.isPending}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 16,
                      paddingVertical: 9,
                      borderRadius: 16,
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      borderWidth: 1,
                      borderColor: "rgba(16, 185, 129, 0.35)",
                      gap: 6,
                    }}
                  >
                    <Ionicons name="checkmark-done" size={15} color="#10b981" />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#10b981",
                      }}
                    >
                      Tugas Selesai
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : !isTimerMinimized ? (
            /* Vibe Mode: Maximized Timer Card centered in the screen */
            <View
              onStartShouldSetResponder={() => true}
              onTouchEnd={(e) => {
                e.stopPropagation?.();
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                backgroundColor: "rgba(18, 18, 22, 0.88)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 24,
                paddingVertical: 18,
                paddingHorizontal: 32,
                maxWidth: 450,
                width: "100%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.6,
                shadowRadius: 14,
                elevation: 10,
              }}
            >
              {/* Header row in center card: Mode + Cycle + Minimize button */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: 4,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <View
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 3.5,
                      backgroundColor: activeTheme.accent,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      color: activeTheme.accent,
                    }}
                  >
                    {MODE_LABELS[mode]}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "500",
                      color: ZEN_THEME.textMuted,
                    }}
                  >
                    · {cycleLabel}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    Haptics.selectionAsync();
                    setIsTimerMinimized(true);
                  }}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Ionicons
                    name="contract-outline"
                    size={14}
                    color={ZEN_THEME.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Typography Countdown */}
              <Text
                style={{
                  fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                  fontSize: 68,
                  fontWeight: "900",
                  letterSpacing: 1.5,
                  color:
                    isActive && !isPaused
                      ? ZEN_THEME.textPrimary
                      : ZEN_THEME.textMuted,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {formatTime(time)}
              </Text>

              {/* Ambient Progress Bar */}
              <View
                style={{
                  width: "100%",
                  height: 5,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  borderRadius: 999,
                  overflow: "hidden",
                  marginTop: 8,
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    backgroundColor: activeTheme.accent,
                    borderRadius: 999,
                  }}
                />
              </View>

              {/* Action Buttons: Mulai, Lewati & Tugas Selesai */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (!isActive) {
                      onStart(mode);
                    } else {
                      onPauseResume();
                    }
                  }}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 9,
                    borderRadius: 14,
                    backgroundColor:
                      isActive && !isPaused ? "#27272a" : activeTheme.accent,
                    borderWidth: 1,
                    borderColor:
                      isActive && !isPaused ? "#3f3f46" : activeTheme.accent,
                    gap: 6,
                  }}
                >
                  <Ionicons
                    name={!isActive || isPaused ? "play" : "pause"}
                    size={15}
                    color={
                      isActive && !isPaused
                        ? "#ffffff"
                        : activeTheme.textOnAccent
                    }
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color:
                        isActive && !isPaused
                          ? "#ffffff"
                          : activeTheme.textOnAccent,
                    }}
                  >
                    {!isActive ? "Mulai" : isPaused ? "Lanjutkan" : "Jeda"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSkip}
                  activeOpacity={0.8}
                  style={{
                    paddingVertical: 9,
                    paddingHorizontal: 14,
                    borderRadius: 14,
                    backgroundColor: ZEN_THEME.subtleBg,
                    borderWidth: 1,
                    borderColor: ZEN_THEME.cardBorder,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Ionicons
                    name="play-skip-forward-outline"
                    size={13}
                    color={ZEN_THEME.textSecondary}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: ZEN_THEME.textSecondary,
                    }}
                  >
                    Lewati
                  </Text>
                </TouchableOpacity>

                {activeTask && (
                  <TouchableOpacity
                    onPress={handleConfirmMarkTaskComplete}
                    activeOpacity={0.8}
                    disabled={updateTaskMutation.isPending}
                    style={{
                      paddingVertical: 9,
                      paddingHorizontal: 14,
                      borderRadius: 14,
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      borderWidth: 1,
                      borderColor: "rgba(16, 185, 129, 0.35)",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons name="checkmark-done" size={14} color="#10b981" />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#10b981",
                      }}
                    >
                      Selesai
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : null}
        </View>

        {/* 3. Bottom Row: Zen Mode Centered Status OR Vibe Mode Minimized Pill / Cycle Status */}
        {displayMode === "vibe" ? (
          <View
            pointerEvents="box-none"
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: isTimerMinimized ? "space-between" : "center",
              width: "100%",
            }}
          >
            {isTimerMinimized ? (
              /* Minimized Floating Pill at Bottom-Left */
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  setIsTimerMinimized(false);
                }}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(18, 18, 22, 0.92)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.18)",
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 999,
                  gap: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 6,
                  elevation: 6,
                }}
              >
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 3.5,
                    backgroundColor: activeTheme.accent,
                  }}
                />
                <Text
                  style={{
                    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                    fontSize: 13,
                    fontWeight: "800",
                    color: "#fafafa",
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {formatTime(time)}
                </Text>

                {/* Quick Pause/Resume button inside pill */}
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    if (!isActive) {
                      onStart(mode);
                    } else {
                      onPauseResume();
                    }
                  }}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor:
                      isActive && !isPaused
                        ? "rgba(255, 255, 255, 0.15)"
                        : activeTheme.accent,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={!isActive || isPaused ? "play" : "pause"}
                    size={11}
                    color={
                      isActive && !isPaused
                        ? "#ffffff"
                        : activeTheme.textOnAccent
                    }
                  />
                </TouchableOpacity>

                <Ionicons
                  name="expand-outline"
                  size={13}
                  color={ZEN_THEME.textSecondary}
                />
              </TouchableOpacity>
            ) : null}

            {/* Cycle Status info */}
            <View
              pointerEvents="none"
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ionicons
                name="repeat-outline"
                size={14}
                color={ZEN_THEME.textMuted}
              />
              <Text
                style={{
                  color: ZEN_THEME.textMuted,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                {cycleLabel} · {sessionsCount}/4 fokus tuntas
              </Text>
            </View>
          </View>
        ) : (
          /* Zen Mode Centered Cycle Status */
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Ionicons
              name="repeat-outline"
              size={14}
              color={ZEN_THEME.textMuted}
            />
            <Text
              style={{
                color: ZEN_THEME.textMuted,
                fontSize: 12,
                fontWeight: "500",
              }}
            >
              {cycleLabel} · {sessionsCount}/4 fokus tuntas
            </Text>
          </View>
        )}

        {/* 4. Minimalist In-Desk Completion Overlay (if session ends in Zen Mode) */}
        {transitionFinishedMode && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(9, 9, 11, 0.96)",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              zIndex: 50,
            }}
          >
            <View
              style={{
                backgroundColor: ZEN_THEME.cardBg,
                borderWidth: 1,
                borderColor: ZEN_THEME.cardBorder,
                borderRadius: 24,
                padding: 24,
                maxWidth: 420,
                width: "100%",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  backgroundColor:
                    transitionFinishedMode === "pomodoro"
                      ? "rgba(16, 185, 129, 0.2)"
                      : "rgba(59, 130, 246, 0.2)",
                }}
              >
                <Ionicons
                  name={
                    transitionFinishedMode === "pomodoro"
                      ? "checkmark-circle"
                      : "sparkles"
                  }
                  size={26}
                  color={
                    transitionFinishedMode === "pomodoro"
                      ? "#10b981"
                      : "#3b82f6"
                  }
                />
              </View>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: ZEN_THEME.textPrimary,
                  textAlign: "center",
                }}
              >
                {transitionFinishedMode === "pomodoro"
                  ? "Sesi Fokus Tuntas! 🎉"
                  : "Waktu Istirahat Selesai!"}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: ZEN_THEME.textSecondary,
                  textAlign: "center",
                  marginTop: 4,
                  marginBottom: 20,
                }}
              >
                {transitionFinishedMode === "pomodoro"
                  ? `${total < 60 ? `${total} detik` : `${Math.round(total / 60)} menit`} fokus tercatat. Saatnya rehat sejenak.`
                  : "Pikiran kembali segar. Siap lanjut deep work?"}
              </Text>

              <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
                {transitionFinishedMode === "pomodoro" ? (
                  <>
                    <TouchableOpacity
                      onPress={() => handleStartNext("shortBreak")}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        backgroundColor: "#10b981",
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        gap: 6,
                      }}
                    >
                      <Ionicons name="cafe-outline" size={15} color="#09090b" />
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "700",
                          color: "#09090b",
                        }}
                      >
                        Mulai Istirahat
                      </Text>
                    </TouchableOpacity>

                    {activeTask && (
                      <TouchableOpacity
                        onPress={handleMarkTaskComplete}
                        disabled={updateTaskMutation.isPending}
                        style={{
                          flex: 1,
                          paddingVertical: 12,
                          backgroundColor: ZEN_THEME.cardBorder,
                          borderRadius: 12,
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row",
                          gap: 6,
                        }}
                      >
                        <Ionicons
                          name="checkmark-done"
                          size={15}
                          color="#ffffff"
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: "#ffffff",
                          }}
                        >
                          Tugas Selesai
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleStartNext("pomodoro")}
                    style={{
                      width: "100%",
                      paddingVertical: 12,
                      backgroundColor: "#3b82f6",
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      gap: 6,
                    }}
                  >
                    <Ionicons name="play" size={15} color="#09090b" />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#09090b",
                      }}
                    >
                      Lanjut Fokus
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                onPress={() => setTransitionFinishedMode(null)}
                style={{ marginTop: 12, paddingVertical: 6 }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: ZEN_THEME.textMuted,
                  }}
                >
                  Tutup Notifikasi
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* 5. Vibe Mode Video / Preset Picker Modal */}
        <VibeVideoPickerModal
          visible={vibePickerVisible}
          onClose={() => setVibePickerVisible(false)}
        />
      </View>
    </Modal>
  );
}
