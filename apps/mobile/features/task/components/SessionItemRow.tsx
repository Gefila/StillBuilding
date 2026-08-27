import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PomodoroSession } from "@/features/pomodoro/types/pomodoro.types";
import { formatRelativeDate, formatTime } from "@/utils/dateHelpers";

interface SessionItemRowProps {
  session: PomodoroSession;
  index: number;
  total: number;
}

export const getDurationMinutes = (session: PomodoroSession): number => {
  const raw = session.duration || 25;
  return raw > 60 ? Math.round(raw / 60) : raw;
};

export default function SessionItemRow({
  session,
  index,
  total,
}: SessionItemRowProps) {
  const sessionNum = total - index;
  const isBreak = session.mode === "shortBreak" || session.mode === "longBreak";
  const durationMins = getDurationMinutes(session);
  const startTime = formatTime(session.started_at);
  const endTime = session.ended_at ? formatTime(session.ended_at) : "Sekarang";
  const dateLabel = formatRelativeDate(session.started_at);

  const title = isBreak
    ? session.mode === "longBreak"
      ? "Istirahat Panjang"
      : "Istirahat Singkat"
    : "Sesi Fokus Pomodoro";

  return (
    <View className="flex-row items-center justify-between bg-surface-subtle border border-border rounded-xl px-3 py-2">
      <View className="flex-row items-center gap-2.5 flex-1 mr-2">
        <View className="w-7 h-7 rounded-lg items-center justify-center border bg-surface border-border">
          <Ionicons
            name={isBreak ? "cafe-outline" : "flame"}
            size={13}
            color={isBreak ? "#71717a" : "#18181b"}
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-xs font-bold text-foreground">
              #{sessionNum}
            </Text>
            <Text
              className="text-xs font-semibold text-foreground"
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5 mt-0.5">
            <Text className="text-[10px] text-muted font-medium">
              {startTime} — {endTime}
            </Text>
            <Text className="text-[10px] text-muted">•</Text>
            <Text className="text-[10px] text-muted font-medium">
              {dateLabel}
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-surface border border-border px-2 py-1 rounded-lg shrink-0">
        <Text className="text-xs font-bold text-foreground">
          {durationMins}m
        </Text>
      </View>
    </View>
  );
}
