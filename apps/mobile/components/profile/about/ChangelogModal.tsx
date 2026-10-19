import React from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import {
  APP_CHANGELOGS,
  ChangeType,
  ReleaseLog,
} from "@/constants/changelogData";

interface ChangelogModalProps {
  visible: boolean;
  onClose: () => void;
}

const TYPE_CONFIG: Record<
  ChangeType,
  {
    label: string;
    badgeClass: string;
    textClass: string;
    icon: keyof typeof Ionicons.glyphMap;
  }
> = {
  added: {
    label: "Baru",
    badgeClass: "bg-emerald-50 border-emerald-200",
    textClass: "text-emerald-700",
    icon: "add-circle-outline",
  },
  improved: {
    label: "Peningkatan",
    badgeClass: "bg-blue-50 border-blue-200",
    textClass: "text-blue-700",
    icon: "arrow-up-circle-outline",
  },
  fixed: {
    label: "Perbaikan",
    badgeClass: "bg-amber-50 border-amber-200",
    textClass: "text-amber-700",
    icon: "checkmark-circle-outline",
  },
};

export function ChangelogModal({ visible, onClose }: ChangelogModalProps) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}
      backdropColor="#000000"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={280}
      animationOutTiming={220}
      backdropTransitionInTiming={280}
      backdropTransitionOutTiming={1}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      avoidKeyboard={Platform.OS === "ios"}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View className="bg-surface rounded-t-3xl border-t border-border shadow-2xl max-h-[85%]">
        {/* Header Bar */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-divider">
          <View>
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-bold text-foreground">
                Catatan Rilis
              </Text>
              <View className="px-2 py-0.5 rounded-full bg-surface-subtle border border-border">
                <Text className="text-[10px] font-bold text-muted uppercase tracking-wider">
                  Changelog
                </Text>
              </View>
            </View>
            <Text className="text-xs text-muted font-medium mt-0.5">
              Riwayat fitur baru, penyempurnaan, dan perbaikan
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="w-8 h-8 rounded-full bg-surface-subtle items-center justify-center border border-border"
          >
            <Ionicons name="close" size={18} color="#71717a" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Changelog List */}
        <ScrollView className="px-5 py-4" showsVerticalScrollIndicator={false}>
          {APP_CHANGELOGS.map((release: ReleaseLog, index: number) => {
            const isLast = index === APP_CHANGELOGS.length - 1;

            return (
              <View key={release.version} className="relative pb-6">
                {/* Timeline vertical bar */}
                {!isLast && (
                  <View className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-border" />
                )}

                {/* Release Header */}
                <View className="flex-row items-center gap-3 mb-2">
                  <View
                    className={`w-7 h-7 rounded-full items-center justify-center border ${
                      release.isLatest
                        ? "bg-primary border-primary"
                        : "bg-surface border-border"
                    }`}
                  >
                    <Ionicons
                      name={release.isLatest ? "sparkles" : "cube-outline"}
                      size={14}
                      color={release.isLatest ? "#ffffff" : "#71717a"}
                    />
                  </View>

                  <View className="flex-row items-center gap-2 flex-wrap flex-1">
                    <Text className="text-base font-bold text-foreground">
                      v{release.version}
                    </Text>
                    {release.isLatest && (
                      <View className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        <Text className="text-[10px] font-bold text-emerald-600 uppercase">
                          Terbaru
                        </Text>
                      </View>
                    )}
                    <Text className="text-xs text-muted ml-auto">
                      {release.releaseDate}
                    </Text>
                  </View>
                </View>

                {/* Card Container for Release Details */}
                <View className="ml-10 bg-surface-subtle border border-border rounded-xl p-3.5">
                  <Text className="text-xs font-semibold text-foreground mb-2.5">
                    {release.summary}
                  </Text>

                  <View className="gap-2">
                    {release.changes.map((change, cIdx) => {
                      const cfg = TYPE_CONFIG[change.type];
                      return (
                        <View key={cIdx} className="flex-row items-start gap-2">
                          <View
                            className={`px-1.5 py-0.5 rounded border ${cfg.badgeClass} mt-0.5 flex-row items-center gap-1`}
                          >
                            <Ionicons
                              name={cfg.icon}
                              size={11}
                              color={
                                change.type === "added"
                                  ? "#047857"
                                  : change.type === "improved"
                                    ? "#1d4ed8"
                                    : "#b45309"
                              }
                            />
                            <Text
                              className={`text-[9px] font-bold uppercase ${cfg.textClass}`}
                            >
                              {cfg.label}
                            </Text>
                          </View>
                          <Text className="text-xs text-muted flex-1 leading-relaxed">
                            {change.text}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            );
          })}

          <View className="pt-2 pb-6">
            <Button
              label="Tutup"
              variant="primary"
              size="md"
              onPress={onClose}
              className="w-full"
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default ChangelogModal;
