import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { getStreakInfo } from "@/utils/streakHelpers";

export default function ProfileHeader() {
  const storedUser = useAuthStore((state) => state.user);
  const { data: currentUser } = useCurrentUser();

  const user = currentUser || storedUser;
  const displayName =
    user?.name || user?.full_name || user?.username || "Pengguna StillBuilding";
  const displayEmail = user?.email || "Belum ada email";
  const avatarUrl =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  const streakInfo = getStreakInfo(
    user?.current_strike,
    user?.longest_streak,
    user?.last_streak_date,
  );

  return (
    <View className="flex-col bg-surface p-5 rounded-3xl border border-border my-2 shadow-xs">
      {/* Profile Info */}
      <View className="flex-col items-center">
        <View className="relative">
          <Image
            source={{ uri: avatarUrl }}
            className="w-20 h-20 rounded-full border border-border bg-surface-subtle"
          />
          <View className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-surface" />
        </View>
        <View className="flex-col items-center gap-0.5 mt-3">
          <Text className="text-xl font-bold text-foreground">
            {displayName}
          </Text>
          <Text className="text-xs text-muted font-medium">{displayEmail}</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            className="mt-3 px-3.5 py-1.5 bg-surface-subtle border border-border rounded-xl flex-row items-center"
          >
            <Ionicons
              name="create-outline"
              size={14}
              color="#18181b"
              style={{ marginRight: 4 }}
            />
            <Text className="text-xs font-semibold text-foreground">
              Edit Profil
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Streak & Consistency Stats Row */}
      <View className="flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-border">
        {/* Active Streak Card */}
        <View className="flex-1 bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-2xl">
          <View className="flex-row items-center justify-between">
            <Text className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Streak Aktif
            </Text>
            <Text className="text-base">🔥</Text>
          </View>
          <Text className="text-2xl font-extrabold text-amber-900 mt-1">
            {streakInfo.displayStreak}{" "}
            <Text className="text-xs font-semibold text-amber-700">Hari</Text>
          </Text>
          <Text
            className="text-[10px] text-amber-800/80 font-medium mt-1"
            numberOfLines={1}
          >
            {streakInfo.isStreakDoneToday
              ? "Selesai hari ini"
              : "Butuh 1 tugas"}
          </Text>
        </View>

        {/* Longest Streak Card */}
        <View className="flex-1 bg-surface-subtle border border-border p-3.5 rounded-2xl">
          <View className="flex-row items-center justify-between">
            <Text className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Rekor Terbaik
            </Text>
            <Text className="text-base">🏆</Text>
          </View>
          <Text className="text-2xl font-extrabold text-foreground mt-1">
            {streakInfo.longestStreak}{" "}
            <Text className="text-xs font-semibold text-muted">Hari</Text>
          </Text>
          <Text
            className="text-[10px] text-muted font-medium mt-1"
            numberOfLines={1}
          >
            Konsistensi terpanjang
          </Text>
        </View>
      </View>
    </View>
  );
}
