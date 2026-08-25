import React from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLogout } from "@/features/auth/hooks/useAuth";

export default function LogoutButton() {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    Alert.alert("Keluar dari Akun", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: () => logoutMutation.mutate(),
      },
    ]);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleLogout}
      disabled={logoutMutation.isPending}
      className="p-3.5 bg-red-50 border border-red-200 rounded-xl items-center my-3 active:opacity-75"
    >
      {logoutMutation.isPending ? (
        <ActivityIndicator size="small" color="#dc2626" />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          <Ionicons name="log-out-outline" size={18} color="#dc2626" />
          <Text className="text-sm font-semibold text-red-600">
            Keluar dari Akun
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
