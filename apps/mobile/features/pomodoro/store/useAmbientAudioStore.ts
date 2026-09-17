import { create } from "zustand";

export type AmbientSoundId = "none" | "rain" | "whitenoise" | "cafe" | "waves";

export interface AmbientSoundMeta {
  id: AmbientSoundId;
  label: string;
  description: string;
  iconName: string;
}

export const AMBIENT_SOUNDS: AmbientSoundMeta[] = [
  {
    id: "none",
    label: "Hening",
    description: "Tanpa audio latar",
    iconName: "volume-mute-outline",
  },
  {
    id: "rain",
    label: "Hujan Lembut",
    description: "Rintik hujan menenangkan",
    iconName: "rainy-outline",
  },
  {
    id: "whitenoise",
    label: "White Noise",
    description: "Derau peredam distraksi",
    iconName: "radio-outline",
  },
  {
    id: "cafe",
    label: "Kafe Tenang",
    description: "Suasana ruang kerja rileks",
    iconName: "cafe-outline",
  },
  {
    id: "waves",
    label: "Ombak Laut",
    description: "Deburan ombak ritmis",
    iconName: "water-outline",
  },
];

interface AmbientAudioState {
  soundId: AmbientSoundId;
  volume: number; // 0.0 - 1.0
  isPlaying: boolean;

  setSoundId: (id: AmbientSoundId) => void;
  setVolume: (volume: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const useAmbientAudioStore = create<AmbientAudioState>((set) => ({
  soundId: "rain", // default helpful focus sound
  volume: 0.7,
  isPlaying: false,

  setSoundId: (soundId) => set({ soundId }),
  setVolume: (volume) => set({ volume }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));
