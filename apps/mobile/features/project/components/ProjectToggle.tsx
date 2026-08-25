import React from "react";
import { View, Text, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  isActive: boolean;
  onToggle: (value: boolean) => void;
};

function ProjectToggle({ isActive, onToggle }: Props) {
  return (
    <View
      className={`flex-row items-center justify-between p-4 rounded-2xl border transition-colors duration-300 ${
        isActive ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100"
      }`}
    >
      <View className="flex-row items-center flex-1">
        <View
          className={`p-3 rounded-xl ${isActive ? "bg-blue-500" : "bg-gray-200"}`}
        >
          <Ionicons
            name={isActive ? "rocket" : "rocket-outline"}
            size={24}
            color={isActive ? "white" : "#6b7280"}
          />
        </View>

        <View className="ml-4 flex-1">
          <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
            Status Proyek
          </Text>
          <View className="flex-row items-center mt-1">
            <View
              className={`w-2 h-2 rounded-full mr-2 ${isActive ? "bg-green-500" : "bg-gray-400"}`}
            />
            <Text
              className="text-sm text-gray-500 font-medium"
              numberOfLines={1}
            >
              {isActive ? "Aktif" : "Tidak Aktif"}
            </Text>
          </View>
        </View>
      </View>

      <Switch
        value={isActive}
        onValueChange={onToggle}
        trackColor={{ false: "#e5e7eb", true: "#bfdbfe" }}
        thumbColor={isActive ? "#3b82f6" : "#9ca3af"}
        ios_backgroundColor="#e5e7eb"
      />
    </View>
  );
}

export default ProjectToggle;
