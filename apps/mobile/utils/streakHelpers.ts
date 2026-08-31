export interface StreakInfo {
  displayStreak: number;
  longestStreak: number;
  isStreakDoneToday: boolean;
  isStreakAlivePendingToday: boolean;
  isStreakBroken: boolean;
  statusMessage: string;
}

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getStreakInfo(
  currentStrike?: number | null,
  longestStreak?: number | null,
  lastStreakDate?: string | null,
): StreakInfo {
  const todayStr = getTodayDateString();
  const yesterdayStr = getYesterdayDateString();

  const rawCurrent = currentStrike || 0;
  const rawLongest = longestStreak || 0;

  // Normalized date string (takes first 10 chars "YYYY-MM-DD" if full ISO)
  const normalizedLastDate = lastStreakDate
    ? lastStreakDate.slice(0, 10)
    : null;

  const isStreakDoneToday = normalizedLastDate === todayStr;
  const isStreakAlivePendingToday = normalizedLastDate === yesterdayStr;
  const isStreakBroken =
    !normalizedLastDate || normalizedLastDate < yesterdayStr;

  let displayStreak = 0;
  let statusMessage =
    "Mulai streak baru hari ini dengan menyelesaikan 1 tugas!";

  if (isStreakDoneToday) {
    displayStreak = rawCurrent;
    statusMessage = "Target hari ini tercapai! Streak terjaga 🔥";
  } else if (isStreakAlivePendingToday) {
    displayStreak = rawCurrent;
    statusMessage =
      "Selesaikan 1 tugas hari ini untuk mempertahankan streak ⚡";
  } else {
    displayStreak = 0;
    statusMessage = "Streak terputus. Selesaikan 1 tugas untuk mulai lagi!";
  }

  return {
    displayStreak,
    longestStreak: Math.max(rawLongest, displayStreak),
    isStreakDoneToday,
    isStreakAlivePendingToday,
    isStreakBroken,
    statusMessage,
  };
}
