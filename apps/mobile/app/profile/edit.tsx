import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const storedUser = useAuthStore((state) => state.user);
  const { data: currentUser, isLoading } = useCurrentUser();
  const user = currentUser || storedUser;

  if (isLoading && !user) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#18181b" />
        <Text className="text-xs text-muted font-medium mt-2">
          Memuat profil...
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <EditProfileForm user={user} insetsBottom={insets.bottom} />
    </View>
  );
}
