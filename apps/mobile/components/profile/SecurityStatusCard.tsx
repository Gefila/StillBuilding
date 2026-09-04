import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { AuthUser } from "@/features/auth/types/auth.types";

interface SecurityStatusCardProps {
  user?: AuthUser | null;
}

function formatMemberDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

export function SecurityStatusCard({ user }: SecurityStatusCardProps) {
  const isVerified = user?.is_email_verified ?? true;
  const memberSince = formatMemberDate(user?.created_at);

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
            {user?.email || "email@stillbuilding.com"}
          </Text>
        </View>

        {/* Password / Auth Method Row */}
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
              name={
                isVerified
                  ? "checkmark-done-circle-outline"
                  : "alert-circle-outline"
              }
              size={16}
              color={isVerified ? "#71717a" : "#d97706"}
            />
            <Text className="text-xs text-muted">Status Akun</Text>
          </View>
          <View
            className={`flex-row items-center gap-1.5 px-2 py-0.5 rounded-md border ${
              isVerified
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-amber-500/10 border-amber-500/20"
            }`}
          >
            <View
              className={`w-1.5 h-1.5 rounded-full ${
                isVerified ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <Text
              className={`text-[10px] font-semibold ${
                isVerified ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {isVerified ? "Terverifikasi & Aktif" : "Belum Verifikasi"}
            </Text>
          </View>
        </View>

        {/* Registration Date Row */}
        {memberSince && (
          <View className="flex-row items-center justify-between py-1">
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={16} color="#71717a" />
              <Text className="text-xs text-muted">Terdaftar Sejak</Text>
            </View>
            <Text className="text-xs font-semibold text-foreground">
              {memberSince}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
