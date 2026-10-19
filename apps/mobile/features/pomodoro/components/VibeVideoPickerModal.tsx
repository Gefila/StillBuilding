import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  VIBE_PRESETS,
  extractYoutubeVideoId,
  type VibePreset,
} from "../types/vibeMode";
import { useVibeModeStore } from "../store/useVibeModeStore";

interface VibeVideoPickerModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function VibeVideoPickerModal({
  visible,
  onClose,
}: VibeVideoPickerModalProps) {
  const {
    selectedPresetId,
    customVideoId,
    dimmerOpacity,
    videoFit,
    setSelectedPresetId,
    setCustomVideoId,
    setDimmerOpacity,
    setVideoFit,
  } = useVibeModeStore();

  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSelectPreset = async (preset: VibePreset) => {
    Haptics.selectionAsync();
    await setSelectedPresetId(preset.id);
    onClose();
  };

  const handleApplyCustomUrl = async () => {
    const videoId = extractYoutubeVideoId(customInput);
    if (!videoId) {
      Alert.alert(
        "Link Tidak Valid",
        "Mohon masukkan link YouTube atau Video ID yang valid (misal: https://youtu.be/... atau 11 karakter ID video).",
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setCustomVideoId(videoId);
    setCustomInput("");
    setShowCustomInput(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      supportedOrientations={["landscape", "landscape-left", "landscape-right"]}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#18181b",
            borderWidth: 1,
            borderColor: "#27272a",
            borderRadius: 20,
            maxWidth: 560,
            width: "100%",
            maxHeight: "88%",
            padding: 20,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "rgba(244, 63, 94, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="sparkles" size={16} color="#fb7185" />
              </View>
              <View>
                <Text
                  style={{ fontSize: 16, fontWeight: "700", color: "#fafafa" }}
                >
                  Pilih Suasana Vibe
                </Text>
                <Text style={{ fontSize: 11, color: "#a1a1aa" }}>
                  Latar visual YouTube & musik fokus
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "#27272a",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={16} color="#a1a1aa" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {/* Presets List */}
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: "#71717a",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 8,
              }}
            >
              Preset Suasana
            </Text>

            <View style={{ gap: 8 }}>
              {VIBE_PRESETS.map((preset) => {
                const isSelected =
                  !customVideoId && selectedPresetId === preset.id;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    onPress={() => handleSelectPreset(preset)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 14,
                      backgroundColor: isSelected
                        ? "rgba(16, 185, 129, 0.12)"
                        : "#27272a",
                      borderWidth: 1,
                      borderColor: isSelected
                        ? "rgba(16, 185, 129, 0.4)"
                        : "#3f3f46",
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "700",
                          color: isSelected ? "#10b981" : "#fafafa",
                        }}
                      >
                        {preset.title}
                      </Text>
                      <Text
                        style={{ fontSize: 11, color: "#a1a1aa", marginTop: 2 }}
                        numberOfLines={1}
                      >
                        {preset.description}
                      </Text>
                    </View>

                    {isSelected ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#10b981"
                      />
                    ) : (
                      <Ionicons
                        name="play-circle-outline"
                        size={18}
                        color="#71717a"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Link Accordion / Option */}
            <View style={{ marginTop: 16 }}>
              <TouchableOpacity
                onPress={() => setShowCustomInput(!showCustomInput)}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Ionicons name="link-outline" size={15} color="#3b82f6" />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: "#3b82f6",
                    }}
                  >
                    Gunakan Link YouTube Sendiri
                  </Text>
                </View>
                <Ionicons
                  name={showCustomInput ? "chevron-up" : "chevron-down"}
                  size={15}
                  color="#3b82f6"
                />
              </TouchableOpacity>

              {customVideoId && !showCustomInput && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 10,
                    borderRadius: 12,
                    backgroundColor: "rgba(59, 130, 246, 0.12)",
                    borderWidth: 1,
                    borderColor: "rgba(59, 130, 246, 0.3)",
                    marginTop: 4,
                  }}
                >
                  <Text
                    style={{ fontSize: 11, color: "#93c5fd", flex: 1 }}
                    numberOfLines={1}
                  >
                    Video Aktif: YouTube ID ({customVideoId})
                  </Text>
                  <TouchableOpacity
                    onPress={() => setCustomVideoId(null)}
                    style={{ padding: 4 }}
                  >
                    <Ionicons name="trash-outline" size={14} color="#f87171" />
                  </TouchableOpacity>
                </View>
              )}

              {showCustomInput && (
                <View
                  style={{
                    marginTop: 8,
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: "#27272a",
                    borderWidth: 1,
                    borderColor: "#3f3f46",
                    gap: 10,
                  }}
                >
                  <TextInput
                    value={customInput}
                    onChangeText={setCustomInput}
                    placeholder="https://youtu.be/... atau Video ID"
                    placeholderTextColor="#71717a"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{
                      backgroundColor: "#18181b",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      fontSize: 12,
                      color: "#fafafa",
                      borderWidth: 1,
                      borderColor: "#3f3f46",
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setShowCustomInput(false);
                        setCustomInput("");
                      }}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ fontSize: 11, color: "#a1a1aa" }}>
                        Batal
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleApplyCustomUrl}
                      style={{
                        backgroundColor: "#3b82f6",
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "700",
                          color: "#ffffff",
                        }}
                      >
                        Terapkan
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Dimmer Opacity Controls */}
            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: "#71717a",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 8,
                }}
              >
                Kegelapan Overlay Video
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[
                  { label: "Jernih (0%)", val: 0 },
                  { label: "Tipis (20%)", val: 0.2 },
                  { label: "Sedang (40%)", val: 0.4 },
                  { label: "Gelap (65%)", val: 0.65 },
                ].map((item) => {
                  const isCur = Math.abs(dimmerOpacity - item.val) < 0.05;
                  return (
                    <TouchableOpacity
                      key={item.label}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setDimmerOpacity(item.val);
                      }}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        borderRadius: 10,
                        backgroundColor: isCur ? "#3f3f46" : "#27272a",
                        borderWidth: 1,
                        borderColor: isCur ? "#71717a" : "#3f3f46",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: isCur ? "700" : "500",
                          color: isCur ? "#fafafa" : "#a1a1aa",
                        }}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Video Fit / Scaling Controls */}
            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: "#71717a",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 8,
                }}
              >
                Format Tampilan Video
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[
                  {
                    id: "balanced",
                    label: "Seimbang",
                    tag: "Rekomendasi",
                    desc: "Lebih besar & pas, potongan atas-bawah minim",
                  },
                  {
                    id: "cover",
                    label: "Penuh Layar",
                    tag: "Zoom",
                    desc: "Penuh layar HP tanpa bar hitam di samping",
                  },
                  {
                    id: "contain",
                    label: "Pas Utuh",
                    tag: "16:9",
                    desc: "100% frame utuh tanpa potongan sama sekali",
                  },
                ].map((item) => {
                  const isCur = videoFit === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setVideoFit(
                          item.id as "balanced" | "cover" | "contain",
                        );
                      }}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        paddingHorizontal: 8,
                        borderRadius: 12,
                        backgroundColor: isCur
                          ? "rgba(16, 185, 129, 0.12)"
                          : "#27272a",
                        borderWidth: 1,
                        borderColor: isCur
                          ? "rgba(16, 185, 129, 0.4)"
                          : "#3f3f46",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: isCur ? "700" : "600",
                          color: isCur ? "#10b981" : "#fafafa",
                        }}
                      >
                        {item.label}
                      </Text>
                      {item.tag ? (
                        <Text
                          style={{
                            fontSize: 9,
                            fontWeight: "600",
                            color: isCur ? "#34d399" : "#a1a1aa",
                            marginTop: 1,
                            textTransform: "uppercase",
                            letterSpacing: 0.4,
                          }}
                        >
                          {item.tag}
                        </Text>
                      ) : null}
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          color: isCur ? "#a7f3d0" : "#71717a",
                          marginTop: 3,
                          lineHeight: 13,
                        }}
                        numberOfLines={2}
                      >
                        {item.desc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
