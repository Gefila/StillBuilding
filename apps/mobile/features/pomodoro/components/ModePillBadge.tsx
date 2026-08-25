import React from "react";
import { Text, View } from "react-native";
import { COLORS, MODE_LABELS, PomodoroMode } from "../store/usePomodoroStore";

interface ModePillBadgeProps {
  mode: PomodoroMode;
  sessionsCount: number;
  className?: string;
}

export default function ModePillBadge({
  mode,
  sessionsCount,
  className = "",
}: ModePillBadgeProps) {
  const modeColor = COLORS[mode] || "#18181b";

  return (
    <View
      className={`flex-row items-center bg-surface-subtle px-4 py-1.5 rounded-full border border-border ${className}`}
    >
      <View
        className="w-2 h-2 rounded-full mr-2"
        style={{ backgroundColor: modeColor }}
      />
      <Text className="text-xs font-bold text-foreground">
        {MODE_LABELS[mode]}
      </Text>
      {mode === "pomodoro" && (
        <Text className="text-xs text-muted ml-1">
          · Sesi {sessionsCount + 1}/4
        </Text>
      )}
    </View>
  );
}
