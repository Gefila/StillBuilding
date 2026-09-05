import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ScreenHeader";
import { SupportFAQCard } from "@/components/profile/support/SupportFAQCard";
import { SupportContactCard } from "@/components/profile/support/SupportContactCard";
import { FeedbackModal } from "@/components/profile/support/FeedbackModal";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

interface TopicCategory {
  id: string | null;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORIES: TopicCategory[] = [
  { id: null, label: "Semua", icon: "sparkles-outline" },
  { id: "pomodoro", label: "Pomodoro", icon: "timer-outline" },
  { id: "blocker", label: "Blocker", icon: "warning-outline" },
  { id: "project", label: "Proyek & Tugas", icon: "folder-outline" },
  { id: "account", label: "Akun", icon: "person-outline" },
];

export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const storedUser = useAuthStore((state) => state.user);
  const { data: currentUser } = useCurrentUser();
  const user = currentUser || storedUser;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <ScreenHeader
            title="Bantuan & Dukungan"
            subtitle="Pusat panduan fitur, FAQ, dan kanal kontak"
            showBackButton={true}
          />

          {/* Search Input Bar */}
          <View className="mb-4">
            <View className="flex-row items-center bg-surface border border-border rounded-2xl px-3.5 h-12 shadow-xs">
              <Ionicons
                name="search-outline"
                size={18}
                color="#71717a"
                style={{ marginRight: 8 }}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Cari solusi kendala, pomodoro, blocker..."
                placeholderTextColor="#a1a1aa"
                className="flex-1 text-sm text-foreground h-full"
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && Platform.OS !== "ios" && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={18} color="#a1a1aa" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Quick Topic Filter Pills */}
          <View className="mb-5">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <TouchableOpacity
                    key={category.label}
                    onPress={() => setSelectedCategory(category.id)}
                    activeOpacity={0.7}
                    className={`flex-row items-center px-3.5 py-2 rounded-xl border ${
                      isActive
                        ? "bg-primary border-primary"
                        : "bg-surface border-border"
                    }`}
                  >
                    <Ionicons
                      name={category.icon}
                      size={14}
                      color={isActive ? "#ffffff" : "#71717a"}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      className={`text-xs font-semibold ${
                        isActive ? "text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Quick Tips Highlight Card */}
          {!searchQuery && !selectedCategory && (
            <View className="mb-6 bg-surface-subtle p-4 rounded-2xl border border-border">
              <View className="flex-row items-center mb-2">
                <View className="w-6 h-6 rounded-lg bg-amber-100 border border-amber-200 items-center justify-center mr-2">
                  <Ionicons name="bulb" size={14} color="#d97706" />
                </View>
                <Text className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Tips Deep Work
                </Text>
              </View>
              <Text className="text-xs text-muted leading-relaxed">
                Catat setiap kali Anda tergoda membuka aplikasi lain menggunakan
                tombol{" "}
                <Text className="font-semibold text-foreground">
                  Catat Blocker
                </Text>
                . Mengenali pemicu distraksi adalah langkah pertama membangun
                fokus yang tak tergoyahkan.
              </Text>
            </View>
          )}

          {/* FAQ Section */}
          <SupportFAQCard
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Direct Support Channels */}
          <SupportContactCard
            onOpenFeedback={() => setIsFeedbackModalVisible(true)}
          />

          {/* System Status & App Version Info */}
          <View className="mb-6 items-center justify-center pt-2">
            <View className="flex-row items-center bg-surface px-3 py-1.5 rounded-full border border-border shadow-xs mb-2">
              <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
              <Text className="text-[11px] font-medium text-muted">
                Semua sistem operasional (Online)
              </Text>
            </View>
            <Text className="text-xs text-muted font-medium">
              StillBuilding v1.0.0
            </Text>
            <Text className="text-[10px] text-zinc-400 mt-0.5">
              Dibuat untuk para builder yang pantang menyerah
            </Text>
          </View>

          {/* Bottom spacer for safe area */}
          <View style={{ height: Math.max(insets.bottom, 24) }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Feedback & Bug Report Modal */}
      <FeedbackModal
        visible={isFeedbackModalVisible}
        onClose={() => setIsFeedbackModalVisible(false)}
        userEmail={user?.email}
      />
    </View>
  );
}
