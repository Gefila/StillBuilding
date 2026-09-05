import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ScreenHeader";
import { AboutHeroCard } from "@/components/profile/about/AboutHeroCard";
import { CorePrinciplesCard } from "@/components/profile/about/CorePrinciplesCard";
import { TechStackCard } from "@/components/profile/about/TechStackCard";
import { LegalLinksCard } from "@/components/profile/about/LegalLinksCard";

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ScreenHeader
          title="Tentang Aplikasi"
          subtitle="Visi, filosofi, dan informasi StillBuilding"
          showBackButton={true}
        />

        {/* 1. Hero Card */}
        <AboutHeroCard />

        {/* 2. Core Principles */}
        <CorePrinciplesCard />

        {/* 3. Technology Stack */}
        <TechStackCard />

        {/* 4. Updates & Legal Links */}
        <LegalLinksCard />

        {/* 5. Copyright & Tagline Footer */}
        <View className="items-center justify-center pb-8 pt-2">
          <Text className="text-xs font-semibold text-muted">
            StillBuilding © 2026
          </Text>
          <Text className="text-[11px] text-zinc-400 mt-0.5">
            Dibuat untuk para builder yang pantang menyerah.
          </Text>
        </View>

        <View style={{ height: Math.max(insets.bottom, 20) }} />
      </ScrollView>
    </View>
  );
}
