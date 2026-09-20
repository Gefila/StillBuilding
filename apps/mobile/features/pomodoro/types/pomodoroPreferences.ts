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

export const PRESET_CONFIGS: Record<
  Exclude<FocusPresetKey, "custom">,
  PresetMeta
> = {
  quickSprint: {
    key: "quickSprint",
    label: "Quick Sprint",
    shortLabel: "15m",
    tagline: "Atasi rasa malas & mulai cepat",
    description: "15m Fokus · 3m Rehat · 10m Rehat Panjang",
    durations: {
      pomodoro: 15 * 60,
      shortBreak: 3 * 60,
      longBreak: 10 * 60,
    },
  },
  classic: {
    key: "classic",
    label: "Classic Pomodoro",
    shortLabel: "25m",
    tagline: "Ritme standar & seimbang",
    description: "25m Fokus · 5m Rehat · 15m Rehat Panjang",
    durations: {
      pomodoro: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    },
  },
  deepFlow: {
    key: "deepFlow",
    label: "Deep Flow",
    shortLabel: "50m",
    tagline: "Koding mendalam & pemecahan masalah rumit",
    description: "50m Fokus · 10m Rehat · 20m Rehat Panjang",
    durations: {
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
