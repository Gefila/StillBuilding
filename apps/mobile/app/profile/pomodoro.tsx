import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ScreenHeader } from "@/components/ScreenHeader";
import { usePomodoroPreferencesStore } from "@/features/pomodoro/store/usePomodoroPreferencesStore";
import { usePomodoroStore } from "@/features/pomodoro/store/usePomodoroStore";
import {
  DEFAULT_CUSTOM_DURATIONS,
  PRESET_CONFIGS,
  type FocusPresetKey,
} from "@/features/pomodoro/types/pomodoroPreferences";

export default function PomodoroPreferencesScreen() {
  const insets = useSafeAreaInsets();
  const activePreset = usePomodoroPreferencesStore(
    (state) => state.activePreset,
  );
  const customDurations = usePomodoroPreferencesStore(
    (state) => state.customDurations,
  );
  const setActivePreset = usePomodoroPreferencesStore(
    (state) => state.setActivePreset,
  );
  const setCustomDurations = usePomodoroPreferencesStore(
    (state) => state.setCustomDurations,
  );
  const initializePreferences = usePomodoroPreferencesStore(
    (state) => state.initializePreferences,
  );
  const syncWithPreferences = usePomodoroStore(
    (state) => state.syncWithPreferences,
  );

  const [focusInput, setFocusInput] = useState(
    String(
      customDurations?.focusMinutes || DEFAULT_CUSTOM_DURATIONS.focusMinutes,
    ),
  );
  const [shortBreakInput, setShortBreakInput] = useState(
    String(
      customDurations?.shortBreakMinutes ||
        DEFAULT_CUSTOM_DURATIONS.shortBreakMinutes,
    ),
  );
  const [longBreakInput, setLongBreakInput] = useState(
    String(
      customDurations?.longBreakMinutes ||
        DEFAULT_CUSTOM_DURATIONS.longBreakMinutes,
    ),
  );
  const [isSavingCustom, setIsSavingCustom] = useState(false);

  useEffect(() => {
    initializePreferences().then(() => {
      const loaded = usePomodoroPreferencesStore.getState().customDurations;
      if (loaded) {
        setFocusInput(String(loaded.focusMinutes));
        setShortBreakInput(String(loaded.shortBreakMinutes));
        setLongBreakInput(String(loaded.longBreakMinutes));
      }
    });
  }, [initializePreferences]);

  const handleSelectPreset = async (presetKey: FocusPresetKey) => {
    Haptics.selectionAsync();
    await setActivePreset(presetKey);
    syncWithPreferences();
  };

  const handleSaveCustom = async () => {
    const focus = parseInt(focusInput, 10);
    const shortBreak = parseInt(shortBreakInput, 10);
    const longBreak = parseInt(longBreakInput, 10);

    if (isNaN(focus) || focus < 1 || focus > 120) {
      Alert.alert(
        "Validasi Gagal",
        "Durasi fokus harus berupa angka antara 1 hingga 120 menit.",
      );
      return;
    }

    if (isNaN(shortBreak) || shortBreak < 1 || shortBreak > 30) {
      Alert.alert(
        "Validasi Gagal",
        "Durasi rehat singkat harus berupa angka antara 1 hingga 30 menit.",
      );
      return;
    }

    if (isNaN(longBreak) || longBreak < 1 || longBreak > 60) {
      Alert.alert(
        "Validasi Gagal",
        "Durasi rehat panjang harus berupa angka antara 1 hingga 60 menit.",
      );
      return;
    }

    setIsSavingCustom(true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await setCustomDurations({
        focusMinutes: focus,
        shortBreakMinutes: shortBreak,
        longBreakMinutes: longBreak,
      });
      await setActivePreset("custom");
      syncWithPreferences();
      Alert.alert(
        "Preferensi Tersimpan",
        `Durasi kustom (${focus}m / ${shortBreak}m / ${longBreak}m) berhasil diterapkan.`,
      );
    } finally {
      setIsSavingCustom(false);
    }
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
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <ScreenHeader
            title="Preferensi Pomodoro"
            subtitle="Pilih preset ritme fokus atau tentukan durasi kustom"
            showBackButton={true}
          />

          {/* Curated Presets Section */}
          <View className="mt-2 mb-4">
            <Text className="text-xs uppercase font-bold text-muted tracking-wider mb-2.5">
              Preset Ritme Kerja
            </Text>

            <View className="gap-2.5">
              {curatedPresets.map(({ key, icon }) => {
                const config = PRESET_CONFIGS[key];
                const isSelected = activePreset === key;

                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => handleSelectPreset(key)}
                    activeOpacity={0.8}
                    className={`p-4 rounded-2xl border will-change-variable ${
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

                      {/* Selection Radio Circle */}
                      <View
                        className={`w-5 h-5 rounded-full border items-center justify-center ${
                          isSelected
                            ? "border-foreground bg-foreground"
                            : "border-muted"
                        }`}
                      >
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={12}
                            color="#ffffff"
                          />
                        )}
                      </View>
                    </View>

                    {/* Duration specs badge */}
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

              {/* Custom Preset Option Card */}
              <TouchableOpacity
                onPress={() => handleSelectPreset("custom")}
                activeOpacity={0.8}
                className={`p-4 rounded-2xl border will-change-variable ${
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
                        color={
                          activePreset === "custom" ? "#ffffff" : "#71717a"
                        }
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-foreground">
                        Durasi Kustom
                      </Text>
                      <Text className="text-xs text-muted mt-0.5">
                        Tentukan sendiri durasi kerja dan rehat sesuai ritme
                        Anda
                      </Text>
                    </View>
                  </View>

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

                {/* Custom active duration indicator */}
                <View className="mt-3 pt-2.5 border-t border-border flex-row items-center gap-1.5">
                  <Ionicons
                    name="hourglass-outline"
                    size={12}
                    color="#71717a"
                  />
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
              </TouchableOpacity>
            </View>
          </View>

          {/* Custom Duration Form Section (Inlined) */}
          <View className="bg-surface rounded-2xl border border-border p-4 mb-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="pencil-outline" size={16} color="#18181b" />
              <Text className="text-sm font-bold text-foreground">
                Atur Nilai Durasi Kustom
              </Text>
            </View>

            <View className="gap-3">
              {/* Focus Minutes Input */}
              <View className="flex-row items-center justify-between py-1">
                <View className="flex-1 mr-4">
                  <Text className="text-xs font-semibold text-foreground">
                    Sesi Fokus
                  </Text>
                  <Text className="text-[11px] text-muted">
                    Rentang: 1 – 120 menit
                  </Text>
                </View>
                <View className="flex-row items-center bg-surface-subtle border border-border rounded-xl px-3 py-1.5">
                  <TextInput
                    value={focusInput}
                    onChangeText={setFocusInput}
                    keyboardType="number-pad"
                    maxLength={3}
                    textAlign="center"
                    className="w-12 text-sm font-mono font-bold text-foreground p-0"
                  />
                  <Text className="text-xs text-muted ml-1">m</Text>
                </View>
              </View>

              {/* Short Break Minutes Input */}
              <View className="flex-row items-center justify-between py-1 border-t border-border/50">
                <View className="flex-1 mr-4">
                  <Text className="text-xs font-semibold text-foreground">
                    Rehat Singkat
                  </Text>
                  <Text className="text-[11px] text-muted">
                    Rentang: 1 – 30 menit
                  </Text>
                </View>
                <View className="flex-row items-center bg-surface-subtle border border-border rounded-xl px-3 py-1.5">
                  <TextInput
                    value={shortBreakInput}
                    onChangeText={setShortBreakInput}
                    keyboardType="number-pad"
                    maxLength={2}
                    textAlign="center"
                    className="w-12 text-sm font-mono font-bold text-foreground p-0"
                  />
                  <Text className="text-xs text-muted ml-1">m</Text>
                </View>
              </View>

              {/* Long Break Minutes Input */}
              <View className="flex-row items-center justify-between py-1 border-t border-border/50">
                <View className="flex-1 mr-4">
                  <Text className="text-xs font-semibold text-foreground">
                    Rehat Panjang
                  </Text>
                  <Text className="text-[11px] text-muted">
                    Rentang: 1 – 60 menit
                  </Text>
                </View>
                <View className="flex-row items-center bg-surface-subtle border border-border rounded-xl px-3 py-1.5">
                  <TextInput
                    value={longBreakInput}
                    onChangeText={setLongBreakInput}
                    keyboardType="number-pad"
                    maxLength={2}
                    textAlign="center"
                    className="w-12 text-sm font-mono font-bold text-foreground p-0"
                  />
                  <Text className="text-xs text-muted ml-1">m</Text>
                </View>
              </View>
            </View>

            {/* Save Custom Durations CTA */}
            <TouchableOpacity
              onPress={handleSaveCustom}
              disabled={isSavingCustom}
              activeOpacity={0.8}
              className="mt-4 py-3 bg-foreground rounded-xl items-center justify-center flex-row gap-2"
            >
              <Ionicons name="save-outline" size={16} color="#ffffff" />
              <Text className="text-xs font-bold text-background">
                {isSavingCustom
                  ? "Menyimpan..."
                  : "Simpan & Terapkan Durasi Kustom"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          <View className="bg-surface-subtle border border-border rounded-2xl p-4 mb-6 flex-row items-start gap-3">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#71717a"
              style={{ marginTop: 1 }}
            />
            <View className="flex-1">
              <Text className="text-xs font-semibold text-foreground">
                Siklus 4 Sesi Otomatis
              </Text>
              <Text className="text-[11px] text-muted mt-0.5 leading-relaxed">
                Setiap 4 sesi fokus selesai, timer akan otomatis beralih ke
                Rehat Panjang sesuai durasi preset yang Anda pilih. Anda juga
                dapat mengganti preset secara instan dari layar Timer.
              </Text>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: Math.max(insets.bottom, 24) }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
