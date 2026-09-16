import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useRouter } from "expo-router";

const headerDateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "short",
});

function HomeHeaderComponent({
  userName: propUserName,
}: {
  userName?: string;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const userName =
    propUserName ||
    user?.name ||
    user?.full_name ||
    user?.username ||
    "Pengguna";

  const avatarUrl =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return "Selamat Pagi ☀️";
    if (hour >= 11 && hour < 15) return "Selamat Siang 🌤️";
    if (hour >= 15 && hour < 18) return "Selamat Sore 🌅";
    return "Selamat Malam 🌙";
  };

  const formattedToday = headerDateFormatter.format(new Date());

  return (
    <View className="pb-3">
      {/* Top Row: Greeting & Avatar */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-[11px] font-semibold text-muted uppercase tracking-wider">
            {formattedToday}
          </Text>
          <Text className="text-2xl font-bold text-foreground tracking-tight mt-0.5">
            {getGreeting()}
          </Text>
          <Text className="text-xs text-muted font-medium mt-1">
            Hai,{" "}
            <Text className="font-semibold text-foreground">{userName}</Text>!
            Siap fokus dan selesaikan target hari ini?
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.navigate("/(tabs)/profile")}
          className="relative ml-3 self-start mt-1"
        >
          <Image
            source={{ uri: avatarUrl }}
            className="w-11 h-11 rounded-full border border-border bg-surface-subtle"
          />
          <View className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default React.memo(HomeHeaderComponent);
