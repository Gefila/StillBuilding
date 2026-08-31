import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
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

const weekdayFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
});

function formatHeatmapDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const weekday = weekdayFormatter.format(date);
    const month = MONTH_NAMES_ID[m - 1] || "";
    return `${weekday}, ${d} ${month} ${y}`;
  } catch {
    return dateStr;
  }
}

interface HeatmapCellProps {
  day: ActivityDay;
  isSelected: boolean;
  cellSize: number;
  cellGap: number;
  cellRadius: number;
  compact: boolean;
  onPress: (day: ActivityDay) => void;
}

const HeatmapCell = React.memo(
  ({
    day,
    isSelected,
    cellSize,
    cellGap,
    cellRadius,
    compact,
    onPress,
  }: HeatmapCellProps) => {
    const colors = LEVEL_COLORS[day.level] || LEVEL_COLORS[0];
    return (
      <Pressable
        onPress={() => onPress(day)}
        hitSlop={compact ? 2 : 3}
        style={{
          width: cellSize,
          height: cellSize,
          marginBottom: cellGap,
          borderRadius: cellRadius,
          backgroundColor: colors.bg,
          borderColor: isSelected ? "#18181b" : colors.border,
          borderWidth: isSelected ? 1.5 : 1,
          transform: [
            {
              scale: isSelected ? (compact ? 1.2 : 1.15) : 1,
            },
          ],
        }}
      />
    );
  },
  (prev, next) =>
    prev.isSelected === next.isSelected &&
    prev.day.date === next.day.date &&
    prev.day.level === next.day.level &&
    prev.cellSize === next.cellSize &&
    prev.cellGap === next.cellGap,
);

function ActivityHeatmapCardComponent({
  weeks = 16,
  compact = false,
}: {
  weeks?: number;
  compact?: boolean;
}) {
  const { data, isLoading, isError } = useActivityHeatmap({ weeks });
  const scrollViewRef = useRef<ScrollView>(null);
  const hasScrolledToEnd = useRef(false);
  const [userSelectedDate, setUserSelectedDate] = useState<string | null>(null);

  const cellSize = compact ? 10 : 14;
  const cellGap = compact ? 2 : 3;
  const cellRadius = compact ? 2.5 : 3.5;

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

  // Derived effective selected date without triggering post-mount state re-renders
  const effectiveSelectedDate = useMemo(() => {
    if (userSelectedDate) return userSelectedDate;
    if (!data?.days || data.days.length === 0) return null;
    const todayStr = new Intl.DateTimeFormat("en-CA").format(new Date());
    const todayEntry = data.days.find((d) => d.date === todayStr);
    return todayEntry ? todayEntry.date : data.days[data.days.length - 1].date;
  }, [userSelectedDate, data?.days]);

  const selectedDayInfo = useMemo(() => {
    if (!data?.days || !effectiveSelectedDate) return null;
    return data.days.find((d) => d.date === effectiveSelectedDate) || null;
  }, [data?.days, effectiveSelectedDate]);

  const handleCellPress = useCallback((day: ActivityDay) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUserSelectedDate(day.date);
  }, []);

  const handleContentSizeChange = useCallback(() => {
    if (!hasScrolledToEnd.current && data?.days && data.days.length > 0) {
      hasScrolledToEnd.current = true;
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }
  }, [data?.days]);

  return (
    <View
      className={`bg-surface rounded-3xl ${
        compact ? "p-3.5" : "p-4"
      } border border-border my-2 shadow-xs`}
    >
      {/* Header Row: Title, Date Horizon, & Total Activities Badge */}
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Ionicons
              name="grid-outline"
              size={compact ? 14 : 15}
              color="#18181b"
            />
            <Text
              className={`${compact ? "text-xs" : "text-sm"} font-bold text-foreground`}
            >
              Ritme Produktivitas
            </Text>
          </View>
          <Text
            className={`${compact ? "text-[10px]" : "text-[11px]"} text-muted font-medium mt-0.5`}
          >
            {weeks} minggu terakhir (Senin - Minggu)
          </Text>
        </View>

        {data?.summary && (
          <View
            className={`bg-emerald-50 border border-emerald-200 ${
              compact ? "px-2 py-0.5" : "px-2.5 py-1"
            } rounded-full flex-row items-center`}
          >
            <Text className={`${compact ? "text-[10px]" : "text-xs"} mr-1`}>
              🟩
            </Text>
            <Text
              className={`${compact ? "text-[10px]" : "text-[11px]"} font-bold text-emerald-800`}
            >
              {data.summary.total_activities} Kontribusi
            </Text>
          </View>
        )}
      </View>

      {/* Grid State Handling */}
      {isLoading ? (
        <View
          className={`${compact ? "py-6" : "py-10"} items-center justify-center`}
        >
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
            <View
              className={`${compact ? "pt-[13px]" : "pt-[15px]"} pr-1.5 flex-col`}
            >
              {["Sen", "", "Rab", "", "Jum", "", "Min"].map((label, idx) => (
                <View
                  key={idx}
                  style={{ height: cellSize, marginBottom: cellGap }}
                  className="justify-center"
                >
                  <Text
                    className={`${
                      compact ? "text-[8px]" : "text-[9px]"
                    } font-semibold text-muted leading-none`}
                  >
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
              onContentSizeChange={handleContentSizeChange}
            >
              <View className="flex-col">
                {/* Month Headers */}
                <View className="flex-row mb-1">
                  {weekColumns.map((_, colIdx) => (
                    <View
                      key={colIdx}
                      style={{
                        width: cellSize,
                        marginRight: cellGap,
                        overflow: "visible",
                      }}
                      className="items-start"
                    >
                      {columnMonthLabels[colIdx] ? (
                        <Text
                          className={`${
                            compact ? "text-[8px]" : "text-[9px]"
                          } font-bold text-muted`}
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
                    <View
                      key={colIdx}
                      className="flex-col"
                      style={{ marginRight: cellGap }}
                    >
                      {col.map((day) => (
                        <HeatmapCell
                          key={day.date}
                          day={day}
                          isSelected={effectiveSelectedDate === day.date}
                          cellSize={cellSize}
                          cellGap={cellGap}
                          cellRadius={cellRadius}
                          compact={compact}
                          onPress={handleCellPress}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Footer Area: Compact Mode (Merged 1-line) vs Full Mode (Full Info Card) */}
          {compact ? (
            <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-border/80">
              {/* Left: Selected Day Short Info */}
              {selectedDayInfo ? (
                <View className="flex-1 flex-row items-center mr-2">
                  <Text
                    className="text-[10px] font-bold text-foreground mr-1"
                    numberOfLines={1}
                  >
                    {formatHeatmapDate(selectedDayInfo.date)}:
                  </Text>
                  {selectedDayInfo.total_activities > 0 ? (
                    <Text
                      className="text-[10px] text-muted font-medium"
                      numberOfLines={1}
                    >
                      {selectedDayInfo.total_activities} aktif (
                      {selectedDayInfo.tasks_completed} tugas,{" "}
                      {selectedDayInfo.pomodoro_sessions} fokus)
                    </Text>
                  ) : (
                    <Text
                      className="text-[10px] text-muted font-normal"
                      numberOfLines={1}
                    >
                      0 aktivitas
                    </Text>
                  )}
                </View>
              ) : (
                <View className="flex-1" />
              )}

              {/* Right: Compact Color Legend */}
              <View className="flex-row items-center gap-0.5">
                <Text className="text-[8px] font-semibold text-muted mr-0.5">
                  Kurang
                </Text>
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <View
                    key={lvl}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 1.5,
                      backgroundColor:
                        LEVEL_COLORS[lvl as keyof typeof LEVEL_COLORS].bg,
                      borderColor:
                        LEVEL_COLORS[lvl as keyof typeof LEVEL_COLORS].border,
                      borderWidth: 0.5,
                    }}
                  />
                ))}
                <Text className="text-[8px] font-semibold text-muted ml-0.5">
                  Banyak
                </Text>
              </View>
            </View>
          ) : (
            <>
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
                        <Ionicons
                          name="timer-outline"
                          size={12}
                          color="#2563eb"
                        />
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
        </>
      )}
    </View>
  );
}

export default React.memo(ActivityHeatmapCardComponent);
