import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReadOnlyEmailFieldProps {
  email?: string;
}

export function ReadOnlyEmailField({ email }: ReadOnlyEmailFieldProps) {
  return (
    <View className="mb-2">
      <View className="flex-row items-center mb-1.5 ml-0.5 justify-between">
        <View className="flex-row items-center">
          <Ionicons name="mail-outline" size={14} color="#71717a" />
          <Text className="text-xs font-semibold uppercase tracking-wider ml-1.5 text-muted">
            Alamat Email
          </Text>
        </View>
        <View className="flex-row items-center gap-1 bg-surface-subtle px-2 py-0.5 rounded border border-border">
          <Ionicons name="shield-checkmark" size={11} color="#16a34a" />
          <Text className="text-[10px] font-semibold text-emerald-700">
            Akun Utama
          </Text>
        </View>
      </View>
      <View className="flex-row items-center h-12 border border-border rounded-xl px-3.5 bg-surface-subtle opacity-75">
        <Ionicons
          name="mail"
          size={18}
          color="#a1a1aa"
          style={{ marginRight: 10 }}
        />
        <Text className="flex-1 text-sm text-muted">
          {email || "email@stillbuilding.com"}
        </Text>
        <Ionicons name="lock-closed" size={14} color="#a1a1aa" />
      </View>
      <Text className="text-[11px] text-muted font-normal mt-1 ml-1">
        Alamat email terikat pada akun autentikasi Supabase.
      </Text>
    </View>
  );
}
