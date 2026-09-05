import React from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { Toast } from "@/components/Toast";

interface SupportContactCardProps {
  onOpenFeedback: () => void;
}

export function SupportContactCard({
  onOpenFeedback,
}: SupportContactCardProps) {
  const handleEmailSupport = async () => {
    const email = "support@stillbuilding.app";
    const url = `mailto:${email}?subject=Permintaan%20Bantuan%20StillBuilding`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Toast.info(`Kirimkan pertanyaan ke: ${email}`);
      }
    } catch {
      Toast.info(`Kirimkan pertanyaan ke: ${email}`);
    }
  };

  const handleOpenDocs = async () => {
    try {
      await WebBrowser.openBrowserAsync("https://github.com", {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      });
    } catch {
      Alert.alert(
        "Dokumentasi",
        "Kunjungi repositori atau dokumentasi daring kami di https://github.com",
      );
    }
  };

  return (
    <View className="mb-6">
      <Text className="text-xs font-bold uppercase tracking-wider text-muted mb-3 px-1">
        Kanal Kontak & Bantuan Langsung
      </Text>

      <View className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
        {/* Email Support */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleEmailSupport}
          className="p-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 items-center justify-center mr-3.5">
              <Ionicons name="mail" size={20} color="#2563eb" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">
                Email Layanan Pengguna
              </Text>
              <Text className="text-xs text-muted mt-0.5" numberOfLines={1}>
                support@stillbuilding.app
              </Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={16} color="#a1a1aa" />
        </TouchableOpacity>

        <View className="h-px bg-divider mx-4" />

        {/* Feedback / Bug Report Modal trigger */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenFeedback}
          className="p-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 items-center justify-center mr-3.5">
              <Ionicons name="chatbubbles" size={20} color="#7c3aed" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">
                Kirim Masukan atau Lapor Bug
              </Text>
              <Text className="text-xs text-muted mt-0.5" numberOfLines={1}>
                Sampaikan tanggapan atau masalah dalam aplikasi
              </Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={16} color="#a1a1aa" />
        </TouchableOpacity>

        <View className="h-px bg-divider mx-4" />

        {/* Online Documentation */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleOpenDocs}
          className="p-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 items-center justify-center mr-3.5">
              <Ionicons name="book" size={20} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">
                Dokumentasi & Catatan Rilis
              </Text>
              <Text className="text-xs text-muted mt-0.5" numberOfLines={1}>
                Pelajari pembaruan versi dan alur kerja StillBuilding
              </Text>
            </View>
          </View>
          <Ionicons name="open-outline" size={16} color="#a1a1aa" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SupportContactCard;
