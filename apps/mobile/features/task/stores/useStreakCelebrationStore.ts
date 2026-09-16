import { create } from "zustand";

export interface StreakCelebrationInfo {
  currentStreak: number;
  longestStreak: number;
  isNewRecord: boolean;
}

interface StreakCelebrationState {
  isVisible: boolean;
  streakInfo: StreakCelebrationInfo | null;
  onDismissCallback: (() => void) | null;
  showCelebration: (
    info: StreakCelebrationInfo,
    onDismiss?: (() => void) | null,
  ) => void;
  setOnDismissCallback: (callback: (() => void) | null) => void;
  closeCelebration: () => void;
}

export const useStreakCelebrationStore = create<StreakCelebrationState>(
  (set) => ({
    isVisible: false,
    streakInfo: null,
    onDismissCallback: null,
    showCelebration: (info, onDismiss = null) =>
      set({
        isVisible: true,
        streakInfo: info,
        onDismissCallback: onDismiss,
      }),
    setOnDismissCallback: (callback) =>
      set({
        onDismissCallback: callback,
      }),
    closeCelebration: () =>
      set({
        isVisible: false,
      }),
  }),
);
