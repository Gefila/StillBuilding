import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import {
  DEFAULT_CUSTOM_DURATIONS,
  PRESET_CONFIGS,
  type CustomDurations,
  type FocusPresetKey,
  type PresetDurations,
} from "../types/pomodoroPreferences";

const PRESET_KEY = "stillbuilding_pomodoro_preset";
const CUSTOM_DURATIONS_KEY = "stillbuilding_pomodoro_custom_durations";

export function resolvePresetDurations(
  presetKey: FocusPresetKey,
  customDurations: CustomDurations,
): PresetDurations {
  if (presetKey === "custom") {
    return {
      pomodoro: customDurations.focusMinutes * 60,
      shortBreak: customDurations.shortBreakMinutes * 60,
      longBreak: customDurations.longBreakMinutes * 60,
    };
  }
  return PRESET_CONFIGS[presetKey].durations;
}

interface PomodoroPreferencesState {
  activePreset: FocusPresetKey;
  customDurations: CustomDurations;
  isInitialized: boolean;

  // Actions
  setActivePreset: (preset: FocusPresetKey) => Promise<void>;
  setCustomDurations: (durations: CustomDurations) => Promise<void>;
  initializePreferences: () => Promise<void>;
  getCurrentDurations: () => PresetDurations;
}

export const usePomodoroPreferencesStore = create<PomodoroPreferencesState>(
  (set, get) => ({
    activePreset: "classic",
    customDurations: DEFAULT_CUSTOM_DURATIONS,
    isInitialized: false,

    setActivePreset: async (preset: FocusPresetKey) => {
      set({ activePreset: preset });
      try {
        await SecureStore.setItemAsync(PRESET_KEY, preset);
      } catch (error) {
        console.warn("Failed to persist pomodoro preset:", error);
      }
    },

    setCustomDurations: async (durations: CustomDurations) => {
      set({ customDurations: durations });
      try {
        await SecureStore.setItemAsync(
          CUSTOM_DURATIONS_KEY,
          JSON.stringify(durations),
        );
      } catch (error) {
        console.warn("Failed to persist custom pomodoro durations:", error);
      }
    },

    initializePreferences: async () => {
      try {
        const storedPreset = (await SecureStore.getItemAsync(
          PRESET_KEY,
        )) as FocusPresetKey | null;

        const storedCustom =
          await SecureStore.getItemAsync(CUSTOM_DURATIONS_KEY);

        let parsedCustom = DEFAULT_CUSTOM_DURATIONS;
        if (storedCustom) {
          try {
            const parsed = JSON.parse(storedCustom);
            if (
              parsed &&
              typeof parsed.focusMinutes === "number" &&
              typeof parsed.shortBreakMinutes === "number" &&
              typeof parsed.longBreakMinutes === "number"
            ) {
              parsedCustom = parsed;
            }
          } catch {
            parsedCustom = DEFAULT_CUSTOM_DURATIONS;
          }
        }

        const validPreset: FocusPresetKey =
          storedPreset === "quickSprint" ||
          storedPreset === "classic" ||
          storedPreset === "deepFlow" ||
          storedPreset === "custom"
            ? storedPreset
            : "classic";

        set({
          activePreset: validPreset,
          customDurations: parsedCustom,
          isInitialized: true,
        });
      } catch (error) {
        console.warn("Failed to initialize pomodoro preferences:", error);
        set({ isInitialized: true });
      }
    },

    getCurrentDurations: () => {
      const { activePreset, customDurations } = get();
      return resolvePresetDurations(activePreset, customDurations);
    },
  }),
);
