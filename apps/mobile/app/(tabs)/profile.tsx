import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useRouter, useIsFocused } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";
import LogoutButton from "@/components/profile/LogoutButton";
import { MenuButtonGroup } from "@/components/profile/MenuButtonGroup";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ActivityHeatmapCard from "@/features/stats/components/ActivityHeatmapCard";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useActivityHeatmap } from "@/features/stats/hooks/useStats";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const { refetch: refetchUser } = useCurrentUser({
    queryConfig: {
      subscribed: isFocused,
    },
  });

  const { refetch: refetchHeatmap } = useActivityHeatmap({
    weeks: 16,
    queryConfig: {
      subscribed: isFocused,
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const userRes = await refetchUser();
      if (userRes.data) {
        setUser(userRes.data);
      }
      await refetchHeatmap();
    } finally {
      setRefreshing(false);
    }
  }, [refetchUser, refetchHeatmap, setUser]);

  const accountItems: {
    id: string;
    title: string;
    icon: IoniconName;
    onPress?: () => void;
  }[] = [
    {
      id: "1",
      title: "Informasi Pribadi",
      icon: "person-outline",
      onPress: () => router.navigate("/profile/edit" as any),
    },
    {
      id: "2",
      title: "Keamanan & Kata Sandi",
      icon: "shield-checkmark-outline",
      onPress: () => router.navigate("/profile/security" as any),
    },
    { id: "3", title: "Notifikasi", icon: "notifications-outline" },
  ];

  const appSettingsItems: {
    id: string;
    title: string;
    icon: IoniconName;
    onPress?: () => void;
  }[] = [
    {
      id: "4",
      title: "Preferensi Pomodoro",
      icon: "timer-outline",
      onPress: () => router.navigate("/profile/pomodoro" as any),
    },
    { id: "5", title: "Bahasa", icon: "language-outline" },
    {
      id: "6",
      title: "Bantuan & Dukungan",
      icon: "help-circle-outline",
      onPress: () => router.navigate("/profile/support" as any),
    },
    {
      id: "7",
      title: "Tentang Aplikasi",
      icon: "information-circle-outline",
      onPress: () => router.navigate("/profile/about" as any),
    },
  ];

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#18181b"
            colors={["#18181b"]}
          />
        }
      >
        {/* 1. Header */}
        <ScreenHeader
          title="Profil"
          subtitle="Kelola akun dan pengaturan preferensi fokus"
        />

        {/* 2. Profile Card & Streak Summary */}
        <ProfileHeader />

        {/* 3. GitHub-Style Activity Heatmap */}
        <ActivityHeatmapCard weeks={16} />

        {/* 4. Account Settings Menu */}
        <MenuButtonGroup menuItems={accountItems} title="Akun" />

        {/* 4. App Preferences Menu */}
        <MenuButtonGroup
          menuItems={appSettingsItems}
          title="Preferensi & Lainnya"
        />

        {/* 5. Logout CTA */}
        <LogoutButton />

        <View style={{ height: Math.max(insets.bottom + 40, 60) }} />
      </ScrollView>
    </View>
  );
}
