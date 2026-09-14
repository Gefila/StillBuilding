import React from "react";
import { Platform, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

export function AboutHeroCard() {
  const version = Constants.expoConfig?.version || "1.0.0";
  const buildNumber =
    Platform.select({
      ios: Constants.expoConfig?.ios?.buildNumber,
      android: Constants.expoConfig?.android?.versionCode?.toString(),
    }) ||
    Constants.nativeBuildVersion ||
    "1";

  return (
    <View className="mb-6 bg-surface border border-border rounded-2xl p-6 items-center shadow-xs">
      {/* Brand Icon */}
      <View className="w-16 h-16 rounded-3xl bg-primary items-center justify-center shadow-sm mb-4 border border-zinc-700">
        <Ionicons name="flash" size={32} color="#ffffff" />
      </View>

      {/* App Title */}
      <Text className="text-2xl font-extrabold text-foreground tracking-tight">
        StillBuilding
      </Text>

      {/* Version & Build Badge */}
      <View className="flex-row items-center mt-1.5 mb-3 bg-surface-subtle px-3 py-1 rounded-full border border-border">
        <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
        <Text className="text-xs font-semibold text-muted">
          Versi {version} (Build {buildNumber}) • Production
        </Text>
      </View>

      {/* Tagline / Mission */}
      <Text className="text-xs text-muted text-center leading-relaxed max-w-72">
        Aplikasi produktivitas dan deep-work personal dengan pendekatan rendah
        friksi (low-friction productivity), dirancang untuk membantu para
        builder menyelesaikan proyek nyata hingga tuntas.
      </Text>
    </View>
  );
}

export default AboutHeroCard;
