import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SecurityStatusCardProps {
  email?: string;
}

export function SecurityStatusCard({ email }: SecurityStatusCardProps) {
  return (
    <View className="bg-surface p-4 rounded-3xl border border-border my-2 shadow-xs">
      {/* Header with Shield & Overall Status */}
      <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-border/60">
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-2xl bg-emerald-500/10 items-center justify-center border border-emerald-500/20">
            <Ionicons name="shield-checkmark" size={18} color="#16a34a" />
          </View>
          <View>
            <Text className="text-sm font-bold text-foreground">
              Status Keamanan
            </Text>
            <Text className="text-xs text-muted">
              Akun Anda terlindungi dengan baik
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <Text className="text-[11px] font-semibold text-emerald-700">
            Terlindungi
          </Text>
        </View>
      </View>

      {/* Detail Rows */}
      <View className="gap-2.5">
        {/* Email Row */}
        <View className="flex-row items-center justify-between py-1">
          <View className="flex-row items-center gap-2">
            <Ionicons name="mail-outline" size={16} color="#71717a" />
            <Text className="text-xs text-muted">Email Terikat</Text>
          </View>
          <Text
            className="text-xs font-semibold text-foreground max-w-[200px]"
            numberOfLines={1}
          >
            {email || "email@stillbuilding.com"}
          </Text>
        </View>

        {/* Password Status Row */}
        <View className="flex-row items-center justify-between py-1">
          <View className="flex-row items-center gap-2">
            <Ionicons name="key-outline" size={16} color="#71717a" />
            <Text className="text-xs text-muted">Kredensial</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="checkmark-circle" size={13} color="#16a34a" />
            <Text className="text-xs font-semibold text-foreground">
              Kata Sandi Aktif
            </Text>
          </View>
        </View>

        {/* Account Verification Status */}
        <View className="flex-row items-center justify-between py-1">
          <View className="flex-row items-center gap-2">
            <Ionicons
              name="checkmark-done-circle-outline"
              size={16}
              color="#71717a"
            />
            <Text className="text-xs text-muted">Status Akun</Text>
          </View>
          <View className="flex-row items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <Text className="text-[10px] font-semibold text-emerald-700">
              Terverifikasi & Aktif
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
