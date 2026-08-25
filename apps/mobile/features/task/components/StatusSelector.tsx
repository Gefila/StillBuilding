import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const statuses = ["Pending", "Active", "Done"];

const statusConfig: Record<
  string,
  {
    label: string;
    activeStyle: string;
    activeText: string;
    activeIcon: string;
    icon: keyof typeof Ionicons.glyphMap;
  }
> = {
  Pending: {
    label: "Pending",
    activeStyle: "bg-surface-subtle border-border",
    activeText: "text-foreground font-bold",
    activeIcon: "#71717a",
    icon: "hourglass-outline",
  },
  Active: {
    label: "Aktif",
    activeStyle: "bg-surface-subtle border-foreground",
    activeText: "text-foreground font-bold",
    activeIcon: "#18181b",
    icon: "play-circle-outline",
  },
  Done: {
    label: "Selesai",
    activeStyle: "bg-emerald-50 border-emerald-300",
    activeText: "text-emerald-800 font-bold",
    activeIcon: "#16a34a",
    icon: "checkmark-circle-outline",
  },
};

interface StatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const StatusSelector = ({
  value,
  onChange,
  error,
}: StatusSelectorProps) => {
  return (
    <View className="mb-5">
      <View className="flex-row items-center mb-1.5 ml-0.5">
        <Ionicons name="radio-button-on-outline" size={13} color="#71717a" />
        <Text className="text-xs font-semibold text-muted ml-1.5 uppercase tracking-wider">
          Status Tugas
        </Text>
      </View>

      <View className="flex-row gap-2">
        {statuses.map((s) => {
          const isSelected = value === s;
          const config = statusConfig[s] || statusConfig.Pending;

          return (
            <TouchableOpacity
              key={s}
              onPress={() => onChange(s)}
              activeOpacity={0.8}
              className={`flex-1 py-2.5 rounded-xl border items-center flex-row justify-center ${
                isSelected ? config.activeStyle : "bg-surface border-border"
              }`}
            >
              <Ionicons
                name={config.icon}
                size={14}
                color={isSelected ? config.activeIcon : "#a1a1aa"}
              />
              <Text
                className={`text-xs ml-1.5 ${
                  isSelected ? config.activeText : "text-muted font-medium"
                }`}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error && <Text className="text-error text-xs mt-1 ml-0.5">{error}</Text>}
    </View>
  );
};

export default StatusSelector;
