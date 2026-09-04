import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ScreenHeader";
import { SecurityStatusCard } from "@/components/profile/SecurityStatusCard";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export default function SecurityScreen() {
  const insets = useSafeAreaInsets();
  const storedUser = useAuthStore((state) => state.user);
  const { data: currentUser } = useCurrentUser();
  const user = currentUser || storedUser;

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
            title="Keamanan & Kata Sandi"
            subtitle="Kelola kata sandi dan pengaturan keamanan akun Anda"
            showBackButton={true}
          />

          {/* Account Security Status Card */}
          <SecurityStatusCard email={user?.email} />

          {/* Change Password Form */}
          <ChangePasswordForm />

          {/* Bottom spacing */}
          <View style={{ height: Math.max(insets.bottom, 24) }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
