import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";
import LogoutButton from "@/components/profile/LogoutButton";
import { MenuButtonGroup } from "@/components/profile/MenuButtonGroup";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ActivityHeatmapCard from "@/features/stats/components/ActivityHeatmapCard";
import { Ionicons } from "@expo/vector-icons";

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function Profile() {
  const insets = useSafeAreaInsets();

  const accountItems: { id: string; title: string; icon: IoniconName }[] = [
    { id: "1", title: "Informasi Pribadi", icon: "person-outline" },
    {
      id: "2",
      title: "Keamanan & Kata Sandi",
      icon: "shield-checkmark-outline",
    },
    { id: "3", title: "Notifikasi", icon: "notifications-outline" },
  ];

  const appSettingsItems: { id: string; title: string; icon: IoniconName }[] = [
    { id: "4", title: "Preferensi Pomodoro", icon: "timer-outline" },
    { id: "5", title: "Bahasa", icon: "language-outline" },
    { id: "6", title: "Bantuan & Dukungan", icon: "help-circle-outline" },
    { id: "7", title: "Tentang Aplikasi", icon: "information-circle-outline" },
  ];

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
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
