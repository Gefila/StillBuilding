import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { VIBE_PRESETS } from "../types/vibeMode";

const VIBE_DISPLAY_MODE_KEY = "stillbuilding_vibe_display_mode";
const VIBE_PRESET_KEY = "stillbuilding_vibe_preset_id";
const VIBE_CUSTOM_VIDEO_KEY = "stillbuilding_vibe_custom_video_id";
const VIBE_MUTED_KEY = "stillbuilding_vibe_is_muted";
const VIBE_VIDEO_FIT_KEY = "stillbuilding_vibe_video_fit";

export type LandscapeDisplayMode = "zen" | "vibe";
export type VibeVideoFit = "balanced" | "cover" | "contain";

interface VibeModeState {
  displayMode: LandscapeDisplayMode;
  selectedPresetId: string;
  customVideoId: string | null;
  isMuted: boolean;
  dimmerOpacity: number;
  videoFit: VibeVideoFit;
  isInitialized: boolean;

  setDisplayMode: (mode: LandscapeDisplayMode) => Promise<void>;
  setSelectedPresetId: (presetId: string) => Promise<void>;
  setCustomVideoId: (videoId: string | null) => Promise<void>;
  toggleMute: () => Promise<void>;
  setDimmerOpacity: (opacity: number) => void;
  setVideoFit: (fit: VibeVideoFit) => Promise<void>;
  initializeVibePreferences: () => Promise<void>;
  getActiveVideoId: () => string;
}

export const useVibeModeStore = create<VibeModeState>((set, get) => ({
  displayMode: "zen",
  selectedPresetId: VIBE_PRESETS[0]?.id || "lofi-girl",
  customVideoId: null,
  isMuted: false,
  dimmerOpacity: 0,
  videoFit: "balanced",
  isInitialized: false,

  setDisplayMode: async (mode: LandscapeDisplayMode) => {
    set({ displayMode: mode });
    try {
      await SecureStore.setItemAsync(VIBE_DISPLAY_MODE_KEY, mode);
    } catch (err) {
      console.warn("Failed to persist vibe display mode:", err);
    }
  },

  setSelectedPresetId: async (presetId: string) => {
    set({ selectedPresetId: presetId, customVideoId: null });
    try {
      await SecureStore.setItemAsync(VIBE_PRESET_KEY, presetId);
      await SecureStore.deleteItemAsync(VIBE_CUSTOM_VIDEO_KEY);
    } catch (err) {
      console.warn("Failed to persist vibe preset:", err);
    }
  },

  setCustomVideoId: async (videoId: string | null) => {
    set({ customVideoId: videoId });
    try {
      if (videoId) {
        await SecureStore.setItemAsync(VIBE_CUSTOM_VIDEO_KEY, videoId);
      } else {
        await SecureStore.deleteItemAsync(VIBE_CUSTOM_VIDEO_KEY);
      }
    } catch (err) {
      console.warn("Failed to persist custom video ID:", err);
    }
  },

  toggleMute: async () => {
    const nextMuted = !get().isMuted;
    set({ isMuted: nextMuted });
    try {
      await SecureStore.setItemAsync(
        VIBE_MUTED_KEY,
        nextMuted ? "true" : "false",
      );
    } catch (err) {
      console.warn("Failed to persist vibe muted state:", err);
    }
  },

  setDimmerOpacity: (opacity: number) => {
    set({ dimmerOpacity: Math.max(0, Math.min(0.85, opacity)) });
  },

  setVideoFit: async (fit: VibeVideoFit) => {
    set({ videoFit: fit });
    try {
      await SecureStore.setItemAsync(VIBE_VIDEO_FIT_KEY, fit);
    } catch (err) {
      console.warn("Failed to persist vibe video fit:", err);
    }
  },

  initializeVibePreferences: async () => {
    if (get().isInitialized) return;
    try {
      const storedMode = (await SecureStore.getItemAsync(
        VIBE_DISPLAY_MODE_KEY,
      )) as LandscapeDisplayMode | null;
      const storedPreset = await SecureStore.getItemAsync(VIBE_PRESET_KEY);
      const storedCustom = await SecureStore.getItemAsync(
        VIBE_CUSTOM_VIDEO_KEY,
      );
      const storedMuted = await SecureStore.getItemAsync(VIBE_MUTED_KEY);
      const storedFit = (await SecureStore.getItemAsync(
        VIBE_VIDEO_FIT_KEY,
      )) as VibeVideoFit | null;

      set({
        displayMode: storedMode === "vibe" ? "vibe" : "zen",
        selectedPresetId: storedPreset || VIBE_PRESETS[0]?.id || "lofi-girl",
        customVideoId: storedCustom || null,
        isMuted: storedMuted === "true",
        videoFit:
          storedFit === "cover"
            ? "cover"
            : storedFit === "contain"
              ? "contain"
              : "balanced",
        isInitialized: true,
      });
    } catch (err) {
      console.warn("Failed to initialize vibe preferences:", err);
      set({ isInitialized: true });
    }
  },

  getActiveVideoId: () => {
    const state = get();
    if (state.customVideoId) {
      return state.customVideoId;
    }
    const preset = VIBE_PRESETS.find((p) => p.id === state.selectedPresetId);
    return preset?.videoId || VIBE_PRESETS[0].videoId;
  },
}));
