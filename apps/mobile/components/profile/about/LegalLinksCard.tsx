import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import { Toast } from "@/components/Toast";
import Constants from "expo-constants";
import { LegalModal } from "./LegalModal";
import { ChangelogModal } from "./ChangelogModal";

export function LegalLinksCard() {
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [legalModalType, setLegalModalType] = useState<
    "privacy" | "terms" | null
  >(null);

  const currentVersion = Constants.expoConfig?.version || "1.3.0";

  const handleCheckUpdate = async () => {
    if (isCheckingUpdate) return;
    setIsCheckingUpdate(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      try {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      } catch {
        // Ignored if unsupported
      }
      Toast.success(
        `StillBuilding Anda sudah merupakan versi terbaru (v${currentVersion}).`,
      );
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleOpenGitHub = async () => {
    try {
      await WebBrowser.openBrowserAsync("https://github.com", {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      });
    } catch {
      Toast.info("Kunjungi repositori kami di https://github.com");
    }
  };

  return (
    <View className="mb-6">
      <Text className="text-xs font-bold uppercase tracking-wider text-muted mb-3 px-1">
        Pembaruan & Legalitas
      </Text>

      <View className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
        {/* Check Update */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCheckUpdate}
          disabled={isCheckingUpdate}
          className="p-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-9 h-9 rounded-xl bg-surface-subtle border border-border items-center justify-center mr-3">
              <Ionicons name="refresh-outline" size={18} color="#18181b" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">
                Periksa Pembaruan
              </Text>
              <Text className="text-xs text-muted mt-0.5">
                Cek ketersediaan patch atau rilis terbaru
              </Text>
            </View>
          </View>
          {isCheckingUpdate ? (
            <ActivityIndicator size="small" color="#18181b" />
          ) : (
            <Ionicons name="chevron-forward" size={16} color="#a1a1aa" />
          )}
        </TouchableOpacity>

        <View className="h-px bg-divider ml-16 mr-4" />

        {/* Release Notes / Changelog */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowChangelogModal(true)}
          className="p-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-9 h-9 rounded-xl bg-surface-subtle border border-border items-center justify-center mr-3">
              <Ionicons name="sparkles-outline" size={18} color="#18181b" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">
                Catatan Rilis (Changelog)
              </Text>
              <Text className="text-xs text-muted mt-0.5">
                Lihat riwayat fitur baru dan perbaikan versi
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#a1a1aa" />
        </TouchableOpacity>

        <View className="h-px bg-divider ml-16 mr-4" />

        {/* Privacy Policy */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setLegalModalType("privacy")}
          className="p-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-9 h-9 rounded-xl bg-surface-subtle border border-border items-center justify-center mr-3">
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#18181b"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">
                Kebijakan Privasi
              </Text>
              <Text className="text-xs text-muted mt-0.5">
                Bagaimana kami melindungi dan mengelola data Anda
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#a1a1aa" />
        </TouchableOpacity>

        <View className="h-px bg-divider ml-16 mr-4" />

        {/* Terms of Service */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setLegalModalType("terms")}
          className="p-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-9 h-9 rounded-xl bg-surface-subtle border border-border items-center justify-center mr-3">
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#18181b"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">
                Syarat & Ketentuan Layanan
              </Text>
              <Text className="text-xs text-muted mt-0.5">
                Ketentuan hak cipta dan penggunaan aplikasi
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#a1a1aa" />
        </TouchableOpacity>

        <View className="h-px bg-divider ml-16 mr-4" />

        {/* GitHub Community */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleOpenGitHub}
          className="p-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-9 h-9 rounded-xl bg-surface-subtle border border-border items-center justify-center mr-3">
              <Ionicons name="logo-github" size={18} color="#18181b" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">
                Repositori GitHub
              </Text>
              <Text className="text-xs text-muted mt-0.5">
                Beri bintang & pantau kontribusi komunitas
              </Text>
            </View>
          </View>
          <Ionicons name="open-outline" size={16} color="#a1a1aa" />
        </TouchableOpacity>
      </View>

      {/* Modal Dialog */}
      <LegalModal
        visible={legalModalType !== null}
        onClose={() => setLegalModalType(null)}
        type={legalModalType}
      />

      {/* Changelog Modal */}
      <ChangelogModal
        visible={showChangelogModal}
        onClose={() => setShowChangelogModal(false)}
      />
    </View>
  );
}

export default LegalLinksCard;
