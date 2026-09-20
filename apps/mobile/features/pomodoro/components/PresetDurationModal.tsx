import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Modal from "@/components/Modal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { usePomodoroPreferencesStore } from "../store/usePomodoroPreferencesStore";
import { usePomodoroStore } from "../store/usePomodoroStore";
import {
  DEFAULT_CUSTOM_DURATIONS,
  PRESET_CONFIGS,
  type FocusPresetKey,
} from "../types/pomodoroPreferences";

interface PresetDurationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PresetDurationModal({
  visible,
  onClose,
}: PresetDurationModalProps) {
  const router = useRouter();
  const activePreset = usePomodoroPreferencesStore(
    (state) => state.activePreset,
  );
  const customDurations = usePomodoroPreferencesStore(
    (state) => state.customDurations,
  );

  const { isActive, isPaused, time, total, applyPreset } = usePomodoroStore();
  const isPartiallyElapsed = isActive || time < total;

  const handleSelectPreset = (presetKey: FocusPresetKey) => {
    if (activePreset === presetKey) {
      onClose();
      return;
    }

    if (isPartiallyElapsed) {
      Alert.alert(
        "Ganti Durasi Sesi?",
        "Mengganti preset akan mereset waktu sesi fokus saat ini ke durasi preset baru.",
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Ganti & Reset",
            style: "destructive",
            onPress: () => {
              Haptics.selectionAsync();
              applyPreset(presetKey);
              onClose();
            },
          },
        ],
      );
      return;
    }

    Haptics.selectionAsync();
    applyPreset(presetKey);
    onClose();
  };

  const handleOpenCustomSettings = () => {
    onClose();
    router.navigate("/profile/pomodoro" as any);
  };

  const curatedPresets: {
    key: "quickSprint" | "classic" | "deepFlow";
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { key: "quickSprint", icon: "flash-outline" },
    { key: "classic", icon: "timer-outline" },
    { key: "deepFlow", icon: "water-outline" },
  ];

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropTransitionOutTiming={1}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View className="bg-surface rounded-t-3xl border-t border-border p-6 max-h-[85%]">
        {/* Drag Indicator */}
        <View className="items-center mb-4">
          <View className="w-12 h-1.5 bg-border rounded-full" />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-surface-subtle border border-border items-center justify-center">
              <Ionicons name="timer-outline" size={20} color="#18181b" />
            </View>
            <View>
              <Text className="text-foreground text-lg font-bold">
                Preset Durasi Fokus
              </Text>
              <Text className="text-muted text-xs">
                Pilih ritme kerja untuk sesi fokus ini
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="w-8 h-8 rounded-full bg-surface-subtle border border-border items-center justify-center"
          >
            <Ionicons name="close" size={16} color="#71717a" />
          </TouchableOpacity>
        </View>

        {/* Presets List */}
        <ScrollView showsVerticalScrollIndicator={false} className="gap-2.5">
          {curatedPresets.map(({ key, icon }) => {
            const config = PRESET_CONFIGS[key];
            const isSelected = activePreset === key;

            return (
              <TouchableOpacity
                key={key}
                onPress={() => handleSelectPreset(key)}
                activeOpacity={0.75}
                className={`p-4 rounded-2xl border mb-2.5 ${
                  isSelected
                    ? "bg-surface border-foreground shadow-xs"
                    : "bg-surface-subtle border-border"
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1 mr-2">
                    <View
                      className={`w-9 h-9 rounded-xl items-center justify-center ${
                        isSelected
                          ? "bg-foreground"
                          : "bg-surface border border-border"
                      }`}
                    >
                      <Ionicons
                        name={icon}
                        size={18}
                        color={isSelected ? "#ffffff" : "#71717a"}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-foreground">
                        {config.label}
                      </Text>
                      <Text className="text-xs text-muted mt-0.5">
                        {config.tagline}
                      </Text>
                    </View>
                  </View>

                  {/* Radio check indicator */}
                  <View
                    className={`w-5 h-5 rounded-full border items-center justify-center ${
                      isSelected
                        ? "border-foreground bg-foreground"
                        : "border-muted"
                    }`}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={12} color="#ffffff" />
                    )}
                  </View>
                </View>

                {/* Duration spec badge */}
                <View className="mt-3 pt-2.5 border-t border-border flex-row items-center gap-1.5">
                  <Ionicons
                    name="hourglass-outline"
                    size={12}
                    color="#71717a"
                  />
                  <Text className="text-[11px] font-mono font-medium text-muted">
                    {config.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Custom Duration Option Card */}
          <TouchableOpacity
            onPress={() => handleSelectPreset("custom")}
            activeOpacity={0.75}
            className={`p-4 rounded-2xl border mb-4 ${
              activePreset === "custom"
                ? "bg-surface border-foreground shadow-xs"
                : "bg-surface-subtle border-border"
            }`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1 mr-2">
                <View
                  className={`w-9 h-9 rounded-xl items-center justify-center ${
                    activePreset === "custom"
                      ? "bg-foreground"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Ionicons
                    name="options-outline"
                    size={18}
                    color={activePreset === "custom" ? "#ffffff" : "#71717a"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-foreground">
                    Durasi Kustom
                  </Text>
                  <Text className="text-xs text-muted mt-0.5">
                    Atur durasi menit sesuai preferensi Anda
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                {/* Edit Button */}
                <TouchableOpacity
                  onPress={handleOpenCustomSettings}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="p-1.5 rounded-lg bg-surface border border-border items-center justify-center"
                >
                  <Ionicons name="pencil" size={14} color="#71717a" />
                </TouchableOpacity>

                {/* Radio check indicator */}
                <View
                  className={`w-5 h-5 rounded-full border items-center justify-center ${
                    activePreset === "custom"
                      ? "border-foreground bg-foreground"
                      : "border-muted"
                  }`}
                >
                  {activePreset === "custom" && (
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                  )}
                </View>
              </View>
            </View>

            {/* Custom spec badge */}
            <View className="mt-3 pt-2.5 border-t border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="hourglass-outline" size={12} color="#71717a" />
                <Text className="text-[11px] font-mono font-medium text-muted">
                  {customDurations?.focusMinutes ??
                    DEFAULT_CUSTOM_DURATIONS.focusMinutes}
                  m Fokus ·{" "}
                  {customDurations?.shortBreakMinutes ??
                    DEFAULT_CUSTOM_DURATIONS.shortBreakMinutes}
                  m Rehat ·{" "}
                  {customDurations?.longBreakMinutes ??
                    DEFAULT_CUSTOM_DURATIONS.longBreakMinutes}
                  m Rehat Panjang
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
