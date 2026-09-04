import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export interface PresetAvatar {
  id: string;
  name: string;
  url: string;
}

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: "notion-1",
    name: "Felix",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Felix&backgroundColor=e2e8f0",
  },
  {
    id: "notion-2",
    name: "Aneka",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Aneka&backgroundColor=fed7aa",
  },
  {
    id: "notion-3",
    name: "Caleb",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Caleb&backgroundColor=bbf7d0",
  },
  {
    id: "notion-4",
    name: "Eden",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Eden&backgroundColor=ddd6fe",
  },
  {
    id: "notion-5",
    name: "Milo",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Milo&backgroundColor=fef08a",
  },
  {
    id: "notion-6",
    name: "Zoe",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Zoe&backgroundColor=fbcfe8",
  },
  {
    id: "notion-7",
    name: "Leo",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Leo&backgroundColor=bae6fd",
  },
  {
    id: "notion-8",
    name: "Sara",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Sara&backgroundColor=fed7aa",
  },
  {
    id: "notion-9",
    name: "Aiden",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Aiden&backgroundColor=c7d2fe",
  },
  {
    id: "notion-10",
    name: "Nala",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Nala&backgroundColor=fecdd3",
  },
  {
    id: "notion-11",
    name: "Oliver",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Oliver&backgroundColor=e9d5ff",
  },
  {
    id: "notion-12",
    name: "Maya",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Maya&backgroundColor=ccfbf1",
  },
  {
    id: "notion-13",
    name: "Jasper",
    url: "https://api.dicebear.com/7.x/notionists/png?seed=Jasper&backgroundColor=fef3c7",
  },
];

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelectAvatar: (url: string) => void;
  onUseInitials: () => void;
}

export function AvatarPicker({
  selectedAvatar,
  onSelectAvatar,
  onUseInitials,
}: AvatarPickerProps) {
  const handleSelect = (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectAvatar(url);
  };

  const handleInitials = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUseInitials();
  };

  return (
    <View className="bg-surface p-4 rounded-3xl border border-border my-2 items-center shadow-xs">
      {/* Current Avatar Preview */}
      <View className="relative mb-3">
        <Image
          source={{ uri: selectedAvatar }}
          className="w-24 h-24 rounded-full border-2 border-primary bg-surface-subtle"
        />
        <View className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full border-2 border-surface items-center justify-center">
          <Ionicons name="sparkles" size={14} color="#ffffff" />
        </View>
      </View>

      <Text className="text-sm font-bold text-foreground">
        Pilih Avatar Karakter
      </Text>
      <Text className="text-xs text-muted mt-0.5 text-center px-4 mb-3">
        Sentuh karakter untuk mengganti foto profil Anda
      </Text>

      {/* Preset Scroll List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4, gap: 10 }}
        className="py-1"
      >
        {PRESET_AVATARS.map((item) => {
          const isSelected = selectedAvatar === item.url;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => handleSelect(item.url)}
              className={`relative p-1 rounded-2xl border-2 ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-surface-subtle"
              }`}
            >
              <Image
                source={{ uri: item.url }}
                className="w-13 h-13 rounded-xl"
              />
              {isSelected && (
                <View className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full items-center justify-center border border-surface">
                  <Ionicons name="checkmark" size={12} color="#ffffff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Initials Generator Button */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={handleInitials}
        className="mt-3.5 flex-row items-center gap-1.5 py-1.5 px-3 rounded-full bg-surface-subtle border border-border"
      >
        <Ionicons name="color-wand-outline" size={14} color="#71717a" />
        <Text className="text-xs font-semibold text-muted">
          Gunakan Inisial Nama
        </Text>
      </TouchableOpacity>
    </View>
  );
}
