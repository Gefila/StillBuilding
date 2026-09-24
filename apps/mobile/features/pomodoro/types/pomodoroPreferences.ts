import { z } from "zod";

export type FocusPresetKey = "quickSprint" | "classic" | "deepFlow" | "custom";

export interface PresetDurations {
  pomodoro: number; // in seconds
  shortBreak: number; // in seconds
  longBreak: number; // in seconds
}

export interface PresetMeta {
  key: FocusPresetKey;
  label: string;
  shortLabel: string;
  tagline: string;
  description: string;
  durations: PresetDurations;
}

// Set IS_TESTING_MODE ke true untuk durasi singkat saat testing/development (dalam hitungan detik).
// Kembalikan ke false untuk kembali ke durasi normal (dalam hitungan menit).
export const IS_TESTING_MODE = false;

export const PRESET_CONFIGS: Record<
  Exclude<FocusPresetKey, "custom">,
  PresetMeta
> = {
  quickSprint: {
    key: "quickSprint",
    label: "Quick Sprint",
    shortLabel: IS_TESTING_MODE ? "8d" : "15m",
    tagline: "Atasi rasa malas & mulai cepat",
    description: IS_TESTING_MODE
      ? "8d Fokus · 3d Rehat · 5d Rehat Panjang (Dev/Test)"
      : "15m Fokus · 3m Rehat · 10m Rehat Panjang",
    durations: IS_TESTING_MODE
      ? {
          pomodoro: 8,
          shortBreak: 3,
          longBreak: 5,
        }
      : {
          pomodoro: 15 * 60,
          shortBreak: 3 * 60,
          longBreak: 10 * 60,
        },
  },
  classic: {
    key: "classic",
    label: "Classic Pomodoro",
    shortLabel: IS_TESTING_MODE ? "10d" : "25m",
    tagline: "Ritme standar & seimbang",
    description: IS_TESTING_MODE
      ? "10d Fokus · 5d Rehat · 10d Rehat Panjang (Dev/Test)"
      : "25m Fokus · 5m Rehat · 15m Rehat Panjang",
    durations: IS_TESTING_MODE
      ? {
          pomodoro: 10,
          shortBreak: 5,
          longBreak: 10,
        }
      : {
          pomodoro: 25 * 60,
          shortBreak: 5 * 60,
          longBreak: 15 * 60,
        },
  },
  deepFlow: {
    key: "deepFlow",
    label: "Deep Flow",
    shortLabel: IS_TESTING_MODE ? "15d" : "50m",
    tagline: "Koding mendalam & pemecahan masalah rumit",
    description: IS_TESTING_MODE
      ? "15d Fokus · 6d Rehat · 12d Rehat Panjang (Dev/Test)"
      : "50m Fokus · 10m Rehat · 20m Rehat Panjang",
    durations: IS_TESTING_MODE
      ? {
          pomodoro: 15,
          shortBreak: 6,
          longBreak: 12,
        }
      : {
          pomodoro: 50 * 60,
          shortBreak: 10 * 60,
          longBreak: 20 * 60,
        },
  },
};

export const customDurationsSchema = z.object({
  focusMinutes: z.number().int().min(1).max(120),
  shortBreakMinutes: z.number().int().min(1).max(30),
  longBreakMinutes: z.number().int().min(1).max(60),
});

export type CustomDurations = z.infer<typeof customDurationsSchema>;

export const DEFAULT_CUSTOM_DURATIONS: CustomDurations = {
  focusMinutes: 30,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
};

export const DEFAULT_KEEP_AWAKE_IN_FOCUS_TAB = false;
