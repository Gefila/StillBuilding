import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { usePomodoroPreferencesStore } from "../store/usePomodoroPreferencesStore";
import { usePomodoroStore } from "../store/usePomodoroStore";
import PresetDurationModal from "./PresetDurationModal";
import {
  DEFAULT_CUSTOM_DURATIONS,
  PRESET_CONFIGS,
} from "../types/pomodoroPreferences";

export default function PresetChipSelector() {
  const [modalVisible, setModalVisible] = useState(false);
  const activePreset = usePomodoroPreferencesStore(
    (state) => state.activePreset,
  );
  const customDurations = usePomodoroPreferencesStore(
    (state) => state.customDurations,
  );
  const { isActive, isPaused } = usePomodoroStore();

  const isTimerRunning = isActive && !isPaused;

  const getBadgeLabel = () => {
    if (activePreset === "custom") {
      const mins =
        customDurations?.focusMinutes ?? DEFAULT_CUSTOM_DURATIONS.focusMinutes;
      return `Kustom · ${mins}m`;
    }
    const config = PRESET_CONFIGS[activePreset];
    return config ? `${config.label} · ${config.shortLabel}` : "25m Classic";
  };

  const handleOpenModal = () => {
    Haptics.selectionAsync();
    setModalVisible(true);
  };

  return (
    <View className="items-center justify-center my-2">
      {isTimerRunning ? (
        /* Read-only informative badge while timer is actively ticking */
        <View className="flex-row items-center px-3 py-1 rounded-full bg-surface-subtle border border-border opacity-70">
          <Ionicons
            name="flash-outline"
            size={12}
            color="#71717a"
            style={{ marginRight: 4 }}
          />
          <Text className="text-[11px] font-semibold text-muted">
            {getBadgeLabel()}
          </Text>
        </View>
      ) : (
        /* Interactive Pill Badge when timer is ready or paused */
        <TouchableOpacity
          onPress={handleOpenModal}
          activeOpacity={0.7}
          className="flex-row items-center px-3.5 py-1.5 rounded-full bg-surface-subtle border border-border shadow-2xs"
        >
          <Ionicons
            name="flash-outline"
            size={12}
            color="#18181b"
            style={{ marginRight: 4 }}
          />
          <Text className="text-xs font-semibold text-foreground mr-1.5">
            {getBadgeLabel()}
          </Text>
          <Ionicons name="chevron-down" size={12} color="#71717a" />
        </TouchableOpacity>
      )}

      {/* Preset Duration Bottom Sheet Modal */}
      <PresetDurationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
