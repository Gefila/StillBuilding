import { create } from "zustand";

export interface StreakCelebrationInfo {
  currentStreak: number;
  longestStreak: number;
  isNewRecord: boolean;
}

interface StreakCelebrationState {
  isVisible: boolean;
  streakInfo: StreakCelebrationInfo | null;
  showCelebration: (info: StreakCelebrationInfo) => void;
  closeCelebration: () => void;
}

export const useStreakCelebrationStore = create<StreakCelebrationState>(
  (set) => ({
    isVisible: false,
    streakInfo: null,
    showCelebration: (info) =>
      set({
        isVisible: true,
        streakInfo: info,
      }),
    closeCelebration: () =>
      set({
        isVisible: false,
      }),
  }),
);
