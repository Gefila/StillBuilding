import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { getStreakInfo } from "@/utils/streakHelpers";

export default function ProfileHeader() {
  const isFocused = useIsFocused();
  const storedUser = useAuthStore((state) => state.user);
  const { data: currentUser } = useCurrentUser({
    queryConfig: {
      subscribed: isFocused,
    },
  });

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
    <View className="flex-col bg-surface p-4 rounded-3xl border border-border my-2 shadow-xs">
      {/* Profile Info - Horizontal Row */}
      <View className="flex-row items-center gap-3.5">
        {/* Avatar with Status Dot */}
        <View className="relative">
          <Image
            source={{ uri: avatarUrl }}
            className="w-14 h-14 rounded-full border border-border bg-surface-subtle"
          />
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-surface" />
        </View>

        {/* User Details */}
        <View className="flex-1 justify-center">
          <Text
            className="text-base font-bold text-foreground leading-tight"
            numberOfLines={1}
          >
            {displayName}
          </Text>
          <Text
            className="text-xs text-muted font-medium leading-tight mt-1"
            numberOfLines={1}
          >
            {displayEmail}
          </Text>
        </View>

        {/* Compact Edit Profile Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="px-3 py-1.5 bg-surface-subtle border border-border rounded-xl flex-row items-center gap-1"
        >
          <Ionicons name="create-outline" size={13} color="#18181b" />
          <Text className="text-xs font-semibold text-foreground">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Streak & Consistency Stats Row - Dual Micro-Tiles */}
      <View className="flex-row items-center gap-2.5 mt-3 pt-3 border-t border-border/70">
        {/* Active Streak Tile */}
        <View className="flex-1 bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-2xl flex-row items-center gap-2.5">
          <View className="w-8 h-8 rounded-xl bg-amber-100/90 items-center justify-center border border-amber-200">
            <Ionicons name="flame" size={16} color="#d97706" />
          </View>
          <View className="flex-1 justify-center">
            <Text
              className="text-xs font-bold text-amber-950 leading-tight"
              numberOfLines={1}
            >
              {streakInfo.displayStreak}{" "}
              <Text className="text-[10px] font-semibold text-amber-800">
                Hari
              </Text>
            </Text>
            <Text
              className="text-[10px] text-amber-800/80 font-medium leading-tight mt-0.5"
              numberOfLines={1}
            >
              {streakInfo.isStreakDoneToday
                ? "Tuntas hari ini"
                : "Butuh 1 tugas"}
            </Text>
          </View>
        </View>

        {/* Longest Streak Tile */}
        <View className="flex-1 bg-surface-subtle border border-border p-2.5 rounded-2xl flex-row items-center gap-2.5">
          <View className="w-8 h-8 rounded-xl bg-surface items-center justify-center border border-border">
            <Ionicons name="trophy-outline" size={15} color="#18181b" />
          </View>
          <View className="flex-1 justify-center">
            <Text
              className="text-xs font-bold text-foreground leading-tight"
              numberOfLines={1}
            >
              {streakInfo.longestStreak}{" "}
              <Text className="text-[10px] font-semibold text-muted">Hari</Text>
            </Text>
            <Text
              className="text-[10px] text-muted font-medium leading-tight mt-0.5"
              numberOfLines={1}
            >
              Rekor Terbaik
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
