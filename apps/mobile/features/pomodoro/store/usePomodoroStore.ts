import { create } from "zustand";
import { usePomodoroPreferencesStore } from "./usePomodoroPreferencesStore";
import {
  IS_TESTING_MODE,
  type FocusPresetKey,
} from "../types/pomodoroPreferences";

export type PomodoroMode = "pomodoro" | "shortBreak" | "longBreak";

export const DURATIONS: Record<PomodoroMode, number> = IS_TESTING_MODE
  ? {
      pomodoro: 10,
      shortBreak: 5,
      longBreak: 10,
    }
  : {
      pomodoro: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    };

export function getPresetDurations(): Record<PomodoroMode, number> {
  try {
    const store = usePomodoroPreferencesStore.getState();
    if (store && typeof store.getCurrentDurations === "function") {
      return store.getCurrentDurations();
    }
    return DURATIONS;
  } catch {
    return DURATIONS;
  }
}

export const COLORS: Record<PomodoroMode, string> = {
  pomodoro: "#18181b",
  shortBreak: "#16a34a",
  longBreak: "#2563eb",
};

export const MODE_LABELS: Record<PomodoroMode, string> = {
  pomodoro: "Deep Work",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export const CYCLE: PomodoroMode[] = [
  "pomodoro",
  "shortBreak",
  "pomodoro",
  "shortBreak",
  "pomodoro",
  "shortBreak",
  "pomodoro",
  "longBreak",
];

interface ActiveTask {
  id: string;
  title: string;
  project_id?: string;
  projectName?: string;
}

interface PomodoroState {
  mode: PomodoroMode;
  time: number;
  total: number;
  isActive: boolean;
  isPaused: boolean;
  sessionsCount: number;
  cycleIndex: number;
  activeTask: ActiveTask | null;
  startedAt: string | null;
  targetEndTime: number | null;

  // Actions
  setActiveTask: (task: ActiveTask | null) => void;
  setMode: (mode: PomodoroMode) => void;
  applyPreset: (preset: FocusPresetKey) => void;
  syncWithPreferences: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetCycle: () => void;
  tick: () => { isFinished: boolean };
  recalcTime: () => { isFinished: boolean };
  advanceNextMode: () => {
    finishedMode: PomodoroMode;
    finishedDuration: number;
    finishedCycleIndex: number;
    finishedSessionNum: number;
    newMode: PomodoroMode;
    newSessionNum: number;
    newCycleIndex: number;
  };
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  mode: "pomodoro",
  time: DURATIONS.pomodoro,
  total: DURATIONS.pomodoro,
  isActive: false,
  isPaused: true,
  sessionsCount: 0,
  cycleIndex: 0,
  activeTask: null,
  startedAt: null,
  targetEndTime: null,

  setActiveTask: (task) => set({ activeTask: task }),

  setMode: (newMode) => {
    const durations = getPresetDurations();
    const newTotal = durations[newMode] || DURATIONS[newMode];
    set({
      mode: newMode,
      time: newTotal,
      total: newTotal,
      isActive: false,
      isPaused: true,
      targetEndTime: null,
      cycleIndex: CYCLE.indexOf(newMode) >= 0 ? CYCLE.indexOf(newMode) : 0,
    });
  },

  applyPreset: (presetKey) => {
    usePomodoroPreferencesStore.getState().setActivePreset(presetKey);
    const durations = getPresetDurations();
    const currentMode = get().mode;
    const newTotal = durations[currentMode] || DURATIONS[currentMode];
    set({
      total: newTotal,
      time: newTotal,
      isActive: false,
      isPaused: true,
      startedAt: null,
      targetEndTime: null,
    });
  },

  syncWithPreferences: () => {
    const { isActive, isPaused, mode } = get();
    if (!isActive || isPaused) {
      const durations = getPresetDurations();
      const newTotal = durations[mode] || DURATIONS[mode];
      set({
        total: newTotal,
        time: newTotal,
        isActive: false,
        isPaused: true,
        startedAt: null,
        targetEndTime: null,
      });
    }
  },

  startTimer: () => {
    const { isActive, isPaused, startedAt, time } = get();
    if (isActive && !isPaused) return;

    const now = Date.now();
    set({
      isActive: true,
      isPaused: false,
      startedAt: startedAt || new Date(now).toISOString(),
      targetEndTime: now + time * 1000,
    });
  },

  pauseTimer: () => {
    set({ isPaused: true, targetEndTime: null });
  },

  resumeTimer: () => {
    const { time } = get();
    const now = Date.now();
    set({
      isPaused: false,
      isActive: true,
      targetEndTime: now + time * 1000,
    });
  },

  stopTimer: () => {
    const { total } = get();
    set({
      isActive: false,
      isPaused: true,
      time: total,
      startedAt: null,
      targetEndTime: null,
    });
  },

  resetCycle: () => {
    const durations = getPresetDurations();
    const defaultTotal = durations.pomodoro || DURATIONS.pomodoro;
    set({
      mode: "pomodoro",
      cycleIndex: 0,
      sessionsCount: 0,
      total: defaultTotal,
      time: defaultTotal,
      isActive: false,
      isPaused: true,
      startedAt: null,
      targetEndTime: null,
    });
  },

  recalcTime: () => {
    const { targetEndTime, isActive, isPaused } = get();
    if (!isActive || isPaused || !targetEndTime) return { isFinished: false };

    const remaining = Math.max(
      0,
      Math.round((targetEndTime - Date.now()) / 1000),
    );
    set({ time: remaining });
    return { isFinished: remaining <= 0 };
  },

  tick: () => {
    const { targetEndTime, time, isActive, isPaused } = get();
    if (!isActive || isPaused) return { isFinished: false };

    if (targetEndTime) {
      const remaining = Math.max(
        0,
        Math.round((targetEndTime - Date.now()) / 1000),
      );
      set({ time: remaining });
      return { isFinished: remaining <= 0 };
    }

    if (time <= 1) {
      set({ time: 0 });
      return { isFinished: true };
    }

    set({ time: time - 1 });
    return { isFinished: false };
  },

  advanceNextMode: () => {
    const { mode, cycleIndex, sessionsCount, total } = get();

    const finishedMode = mode;
    const finishedDuration = total;
    const finishedCycleIndex = cycleIndex;
    const finishedSessionNum = Math.floor(cycleIndex / 2) + 1;

    const newSessions =
      finishedMode === "pomodoro"
        ? Math.min(sessionsCount + 1, 4)
        : sessionsCount;

    const nextCycleIdx = (cycleIndex + 1) % CYCLE.length;
    const nextMode = CYCLE[nextCycleIdx];
    const durations = getPresetDurations();
    const nextTotal = durations[nextMode] || DURATIONS[nextMode];

    const updatedSessionsCount = finishedMode === "longBreak" ? 0 : newSessions;

    set({
      mode: nextMode,
      cycleIndex: nextCycleIdx,
      sessionsCount: updatedSessionsCount,
      total: nextTotal,
      time: nextTotal,
      isActive: false,
      isPaused: true,
      startedAt: null,
      targetEndTime: null,
    });

    return {
      finishedMode,
      finishedDuration,
      finishedCycleIndex,
      finishedSessionNum,
      newMode: nextMode,
      newSessionNum: Math.floor(nextCycleIdx / 2) + 1,
      newCycleIndex: nextCycleIdx,
    };
  },
}));
