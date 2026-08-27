import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PomodoroSession } from "@/features/pomodoro/types/pomodoro.types";
import { formatLastSessionTime } from "@/utils/dateHelpers";
import { Card } from "@/components/Card";
import SessionItemRow, { getDurationMinutes } from "./SessionItemRow";
import EmptyFocusState from "./EmptyFocusState";

interface TaskFocusStatsProps {
  sessions: PomodoroSession[];
  onStartFocus: () => void;
}

export default function TaskFocusStats({
  sessions,
  onStartFocus,
}: TaskFocusStatsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    sortedSessions,
    totalSessionsCount,
    formattedTotalTime,
    lastSessionText,
  } = useMemo(() => {
    const focusSessions = sessions.filter(
      (s) => s.mode === "pomodoro" || !s.mode,
    );
    const totalMinutes = focusSessions.reduce(
      (sum, s) => sum + getDurationMinutes(s),
      0,
    );
    const count = focusSessions.length;

    const formattedTime =
      totalMinutes >= 60
        ? `${Math.floor(totalMinutes / 60)}j ${
            totalMinutes % 60 > 0 ? `${totalMinutes % 60}m` : ""
          }`
        : `${totalMinutes}m`;

    const sorted = [...sessions].sort(
      (a, b) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
    );

    const latest = sorted[0];
    const lastSession = latest
      ? formatLastSessionTime(latest.ended_at || latest.started_at)
      : null;

    return {
      sortedSessions: sorted,
      totalSessionsCount: count,
      formattedTotalTime: formattedTime,
      lastSessionText: lastSession,
    };
  }, [sessions]);

  const visibleSessions = isExpanded
    ? sortedSessions
    : sortedSessions.slice(0, 4);
  const hasMoreSessions = sortedSessions.length > 4;

  return (
    <Card className="mb-3">
      {/* 1. Header dengan Timestamp Sesi Terakhir */}
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="timer-outline" size={15} color="#18181b" />
          <Text className="text-xs font-bold uppercase tracking-wider text-muted">
            Riwayat Sesi Fokus
          </Text>
        </View>

        {lastSessionText ? (
          <View className="flex-row items-center gap-1 bg-surface-subtle border border-border px-2 py-0.5 rounded-full">
            <Ionicons name="time-outline" size={10} color="#71717a" />
            <Text className="text-[10px] font-semibold text-muted">
              Terakhir:{" "}
              <Text className="font-bold text-foreground">
                {lastSessionText}
              </Text>
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={onStartFocus}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text className="text-xs font-semibold text-primary">Mulai</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Bar Rangkuman 2 Metrik (Total Waktu & Total Selesai) */}
      {totalSessionsCount > 0 && (
        <View className="flex-row items-center justify-around bg-surface-subtle border border-border rounded-xl px-3 py-2 mb-2.5">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="hourglass-outline" size={12} color="#71717a" />
            <Text className="text-[11px] text-muted font-medium">
              Total Waktu:
            </Text>
            <Text className="text-xs font-bold text-foreground">
              {formattedTotalTime}
            </Text>
          </View>

          <View className="w-[1px] h-3.5 bg-border" />

          <View className="flex-row items-center gap-1.5">
            <Ionicons
              name="checkmark-circle-outline"
              size={12}
              color="#71717a"
            />
            <Text className="text-[11px] text-muted font-medium">Selesai:</Text>
            <Text className="text-xs font-bold text-foreground">
              {totalSessionsCount} Sesi Fokus
            </Text>
          </View>
        </View>
      )}

      {/* 3. Daftar Sesi atau Empty State */}
      {sortedSessions.length > 0 ? (
        <View className="gap-1.5">
          {visibleSessions.map((session, index) => (
            <SessionItemRow
              key={session.id || index}
              session={session}
              index={index}
              total={sortedSessions.length}
            />
          ))}

          {hasMoreSessions && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsExpanded((prev) => !prev)}
              className="py-1.5 rounded-lg bg-surface border border-border flex-row items-center justify-center mt-1"
            >
              <Text className="text-[11px] font-semibold text-foreground mr-1">
                {isExpanded
                  ? "Sembunyikan"
                  : `Lihat Semua (${sortedSessions.length} Sesi)`}
              </Text>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={12}
                color="#18181b"
              />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <EmptyFocusState onStart={onStartFocus} />
      )}
    </Card>
  );
}
