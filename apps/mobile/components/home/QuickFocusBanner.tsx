import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface QuickFocusBannerProps {
  activeTaskTitle?: string;
}

export default function QuickFocusBanner({
  activeTaskTitle,
}: QuickFocusBannerProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push("/(tabs)/focus")}
      className="bg-primary rounded-2xl p-4 my-2 border border-primary shadow-sm"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 pr-3">
          <View className="w-10 h-10 rounded-xl bg-white/10 items-center justify-center mr-3 border border-white/15">
            <Ionicons name="flame" size={20} color="#ffffff" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5 mb-0.5">
              <Text className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                {activeTaskTitle ? "Sesi Berjalan" : "Deep Work Mode"}
              </Text>
              <View className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </View>
            <Text
              className="text-white text-sm font-bold tracking-tight"
              numberOfLines={1}
            >
              {activeTaskTitle || "Mulai Sesi Fokus Cepat (25 Mnt)"}
            </Text>
            <Text className="text-zinc-400 text-xs mt-0.5">
              Tingkatkan konsentrasi & lacak kemajuan tugas
            </Text>
          </View>
        </View>

        <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
          <Ionicons
            name="play"
            size={14}
            color="#18181b"
            style={{ marginLeft: 2 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
