import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useActivityHeatmap } from "../hooks/useStats";
import type { ActivityDay } from "../types/stats.types";

const LEVEL_COLORS = {
  0: { bg: "#f4f4f5", border: "#e4e4e7" },
  1: { bg: "#86efac", border: "#4ade80" },
  2: { bg: "#4ade80", border: "#22c55e" },
  3: { bg: "#22c55e", border: "#16a34a" },
  4: { bg: "#15803d", border: "#166534" },
};

const MONTH_NAMES_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function formatHeatmapDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const weekday = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
    }).format(date);
    const month = MONTH_NAMES_ID[m - 1] || "";
    return `${weekday}, ${d} ${month} ${y}`;
  } catch {
    return dateStr;
  }
}

export default function ActivityHeatmapCard({
  weeks = 16,
}: {
  weeks?: number;
}) {
  const { data, isLoading, isError } = useActivityHeatmap({ weeks });
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group 112 days into 16 columns (weeks)
  const weekColumns = useMemo(() => {
    if (!data?.days || data.days.length === 0) return [];
    const cols: ActivityDay[][] = [];
    const totalDays = data.days.length;
    for (let i = 0; i < totalDays; i += 7) {
      cols.push(data.days.slice(i, i + 7));
    }
    return cols;
  }, [data?.days]);

  // Compute month labels for column headers
  const columnMonthLabels = useMemo(() => {
    let lastMonth = -1;
    return weekColumns.map((col) => {
      if (!col[0]) return "";
      const [y, m, d] = col[0].date.split("-").map(Number);
      const monthIdx = m - 1;
      if (monthIdx !== lastMonth) {
        lastMonth = monthIdx;
        return MONTH_NAMES_ID[monthIdx];
      }
      return "";
    });
  }, [weekColumns]);

  // Auto-select today or last available date on load
  useEffect(() => {
    if (data?.days && data.days.length > 0 && !selectedDate) {
      // Find today or take the last day
      const todayStr = new Intl.DateTimeFormat("en-CA").format(new Date());
      const todayEntry = data.days.find((d) => d.date === todayStr);
      if (todayEntry) {
        setSelectedDate(todayEntry.date);
      } else {
        setSelectedDate(data.days[data.days.length - 1].date);
      }
    }
  }, [data?.days, selectedDate]);

  // Auto scroll to the end (current week) when data loads
  useEffect(() => {
    if (data?.days && data.days.length > 0) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [data?.days]);

  const selectedDayInfo = useMemo(() => {
    if (!data?.days || !selectedDate) return null;
    return data.days.find((d) => d.date === selectedDate) || null;
  }, [data?.days, selectedDate]);

  const handleCellPress = (day: ActivityDay) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(day.date);
  };

  return (
    <View className="bg-surface rounded-3xl p-4 border border-border my-2 shadow-xs">
      {/* Header Row: Title, Date Horizon, & Total Activities Badge */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="grid-outline" size={15} color="#18181b" />
            <Text className="text-sm font-bold text-foreground">
              Ritme Produktivitas
            </Text>
          </View>
          <Text className="text-[11px] text-muted font-medium mt-0.5">
            {weeks} minggu terakhir (Senin - Minggu)
          </Text>
        </View>

        {data?.summary && (
          <View className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex-row items-center">
            <Text className="text-xs mr-1">🟩</Text>
            <Text className="text-[11px] font-bold text-emerald-800">
              {data.summary.total_activities} Kontribusi
            </Text>
          </View>
        )}
      </View>

      {/* Grid State Handling */}
      {isLoading ? (
        <View className="py-10 items-center justify-center">
          <ActivityIndicator size="small" color="#18181b" />
          <Text className="text-xs text-muted font-medium mt-2">
            Memuat grafik kontribusi...
          </Text>
        </View>
      ) : isError || !data ? (
        <View className="py-6 items-center justify-center">
          <Text className="text-xs text-muted font-medium">
            Gagal memuat grafik aktivitas.
          </Text>
        </View>
      ) : (
        <>
          {/* Scrollable Heatmap Grid */}
          <View className="flex-row">
            {/* Left Column: Day Labels (Hari Ganjil: Sen, Rab, Jum, Min) */}
            <View className="pt-[15px] pr-1.5 flex-col">
              {["Sen", "", "Rab", "", "Jum", "", "Min"].map((label, idx) => (
                <View
                  key={idx}
                  style={{ height: 14, marginBottom: 3 }}
                  className="justify-center"
                >
                  <Text className="text-[9px] font-semibold text-muted leading-none">
                    {label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Horizontal Scrollable Grid */}
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-1"
              contentContainerStyle={{ paddingRight: 4 }}
            >
              <View className="flex-col">
                {/* Month Headers */}
                <View className="flex-row mb-1">
                  {weekColumns.map((_, colIdx) => (
                    <View
                      key={colIdx}
                      style={{ width: 14, marginRight: 3, overflow: "visible" }}
                      className="items-start"
                    >
                      {columnMonthLabels[colIdx] ? (
                        <Text
                          className="text-[9px] font-bold text-muted"
                          style={{ width: 34 }}
                        >
                          {columnMonthLabels[colIdx]}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>

                {/* 7 Rows of Weeks */}
                <View className="flex-row">
                  {weekColumns.map((col, colIdx) => (
                    <View key={colIdx} className="flex-col mr-[3px]">
                      {col.map((day) => {
                        const isSelected = selectedDate === day.date;
                        const colors =
                          LEVEL_COLORS[day.level] || LEVEL_COLORS[0];
                        return (
                          <TouchableOpacity
                            key={day.date}
                            activeOpacity={0.7}
                            onPress={() => handleCellPress(day)}
                            style={{
                              width: 14,
                              height: 14,
                              marginBottom: 3,
                              borderRadius: 3.5,
                              backgroundColor: colors.bg,
                              borderColor: isSelected
                                ? "#18181b"
                                : colors.border,
                              borderWidth: isSelected ? 1.5 : 1,
                              transform: [{ scale: isSelected ? 1.15 : 1 }],
                            }}
                          />
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Interactive Info Strip (Selected Date Details) */}
          {selectedDayInfo && (
            <View className="mt-3.5 pt-3 border-t border-border bg-surface-subtle/60 -mx-4 -mb-4 p-3.5 rounded-b-3xl">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-bold text-foreground">
                  {formatHeatmapDate(selectedDayInfo.date)}
                </Text>
                <View className="flex-row items-center bg-surface px-2 py-0.5 rounded-full border border-border">
                  <Text className="text-[10px] font-bold text-foreground">
                    {selectedDayInfo.total_activities} Aktivitas
                  </Text>
                </View>
              </View>

              {selectedDayInfo.total_activities > 0 ? (
                <View className="flex-row items-center gap-3 mt-1.5 flex-wrap">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={12}
                      color="#16a34a"
                    />
                    <Text className="text-[11px] font-medium text-muted ml-1">
                      {selectedDayInfo.tasks_completed} tugas selesai
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="timer-outline" size={12} color="#2563eb" />
                    <Text className="text-[11px] font-medium text-muted ml-1">
                      {selectedDayInfo.pomodoro_sessions} sesi fokus (
                      {selectedDayInfo.focus_minutes}m)
                    </Text>
                  </View>
                </View>
              ) : (
                <Text className="text-[11px] text-muted font-medium mt-1">
                  Tidak ada aktivitas kerja yang dicatat pada hari ini.
                </Text>
              )}
            </View>
          )}

          {/* Color Legend (Bottom Right) */}
          <View className="flex-row items-center justify-end gap-1 mt-2.5">
            <Text className="text-[9px] font-semibold text-muted mr-1">
              Kurang
            </Text>
            {[0, 1, 2, 3, 4].map((lvl) => (
              <View
                key={lvl}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  backgroundColor:
                    LEVEL_COLORS[lvl as keyof typeof LEVEL_COLORS].bg,
                  borderColor:
                    LEVEL_COLORS[lvl as keyof typeof LEVEL_COLORS].border,
                  borderWidth: 0.5,
                }}
              />
            ))}
            <Text className="text-[9px] font-semibold text-muted ml-1">
              Banyak
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
