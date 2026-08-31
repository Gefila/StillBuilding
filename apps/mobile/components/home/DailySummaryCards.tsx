import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { getStreakInfo } from "@/utils/streakHelpers";

interface DailySummaryCardsProps {
  totalTasks: number;
  completedTasks: number;
  focusMinutes?: number;
}

function DailySummaryCardsComponent({
  totalTasks = 0,
  completedTasks = 0,
  focusMinutes = 50,
}: DailySummaryCardsProps) {
  const user = useAuthStore((state) => state.user);

  const streakInfo = useMemo(
    () =>
      getStreakInfo(
        user?.current_strike,
        user?.longest_streak,
        user?.last_streak_date,
      ),
    [user?.current_strike, user?.longest_streak, user?.last_streak_date],
  );

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <View className="flex-row gap-2.5 my-1.5">
      {/* Card 1: Fokus Harian */}
      <View className="flex-1 bg-surface p-3.5 rounded-2xl border border-border shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View className="w-7 h-7 rounded-lg bg-surface-subtle items-center justify-center border border-border">
            <Ionicons name="timer-outline" size={16} color="#18181b" />
          </View>
          <Text className="text-[10px] font-bold text-foreground bg-surface-subtle px-1.5 py-0.5 rounded border border-border">
            Hari Ini
          </Text>
        </View>
        <Text className="text-xl font-bold text-foreground tracking-tight">
          {focusMinutes}{" "}
          <Text className="text-xs font-normal text-muted">Mnt</Text>
        </Text>
        <Text className="text-[11px] text-muted font-medium mt-0.5">
          Waktu Fokus
        </Text>
      </View>

      {/* Card 2: Status Tugas */}
      <View className="flex-1 bg-surface p-3.5 rounded-2xl border border-border shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View className="w-7 h-7 rounded-lg bg-surface-subtle items-center justify-center border border-border">
            <Ionicons name="checkmark-done-outline" size={16} color="#16a34a" />
          </View>
          <Text className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
            {completionRate}%
          </Text>
        </View>
        <Text className="text-xl font-bold text-foreground tracking-tight">
          {completedTasks}/{totalTasks}
        </Text>
        <Text className="text-[11px] text-muted font-medium mt-0.5">
          Tugas Selesai
        </Text>
      </View>

      {/* Card 3: Status Streak */}
      <View className="flex-1 bg-surface p-3.5 rounded-2xl border border-border shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View
            className={`w-7 h-7 rounded-lg items-center justify-center border ${
              streakInfo.isStreakDoneToday
                ? "bg-amber-50 border-amber-200"
                : streakInfo.isStreakAlivePendingToday
                  ? "bg-orange-50 border-orange-200"
                  : "bg-surface-subtle border-border"
            }`}
          >
            <Ionicons
              name={streakInfo.isStreakDoneToday ? "flame" : "flame-outline"}
              size={16}
              color={
                streakInfo.isStreakDoneToday
                  ? "#d97706"
                  : streakInfo.isStreakAlivePendingToday
                    ? "#ea580c"
                    : "#a1a1aa"
              }
            />
          </View>
          <Text
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
              streakInfo.isStreakDoneToday
                ? "text-amber-800 bg-amber-50 border-amber-200"
                : streakInfo.isStreakAlivePendingToday
                  ? "text-orange-800 bg-orange-50 border-orange-200"
                  : "text-muted bg-surface-subtle border-border"
            }`}
          >
            {streakInfo.isStreakDoneToday
              ? "Tuntas"
              : streakInfo.isStreakAlivePendingToday
                ? "Pending"
                : "0 Hari"}
          </Text>
        </View>
        <Text className="text-xl font-bold text-foreground tracking-tight">
          {streakInfo.displayStreak}{" "}
          <Text className="text-xs font-normal text-muted">Hari</Text>
        </Text>
        <Text className="text-[11px] text-muted font-medium mt-0.5">
          Status Streak
        </Text>
      </View>
    </View>
  );
}

export default React.memo(DailySummaryCardsComponent);
