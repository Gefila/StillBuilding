import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Toast } from "@/components/Toast";

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  userEmail?: string;
}

type FeedbackType = "bug" | "feature" | "account" | "general";

interface CategoryOption {
  type: FeedbackType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORIES: CategoryOption[] = [
  { type: "bug", label: "Lapor Bug", icon: "bug-outline" },
  { type: "feature", label: "Ide Fitur", icon: "bulb-outline" },
  { type: "account", label: "Akun & Akses", icon: "key-outline" },
  {
    type: "general",
    label: "Masukan Lain",
    icon: "chatbubble-ellipses-outline",
  },
];

export function FeedbackModal({
  visible,
  onClose,
  userEmail,
}: FeedbackModalProps) {
  const [selectedType, setSelectedType] = useState<FeedbackType>("bug");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setSelectedType("bug");
    setSubject("");
    setMessage("");
    setErrorMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!subject.trim()) {
      setErrorMessage("Mohon isi subjek atau judul laporan.");
      return;
    }
    if (!message.trim()) {
      setErrorMessage("Mohon ceritakan kendala atau masukan Anda.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Simulate network dispatch with brief delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      try {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      } catch {
        // Haptics gracefully ignored if unsupported
      }

      handleClose();

      setTimeout(() => {
        Toast.success("Pesan dan masukan Anda berhasil dikirim!");
      }, 150);
    } catch {
      setErrorMessage("Gagal mengirim laporan. Silakan coba sesaat lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
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
      <View className="bg-surface rounded-t-3xl border-t border-border shadow-2xl max-h-[90%]">
        {/* Header Bar */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-divider">
          <View>
            <Text className="text-lg font-bold text-foreground">
              Kirim Masukan & Laporan
            </Text>
            <Text className="text-xs text-muted font-medium mt-0.5">
              Bantu kami meningkatkan kualitas StillBuilding
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="w-8 h-8 rounded-full bg-surface-subtle items-center justify-center border border-border"
          >
            <Ionicons name="close" size={18} color="#71717a" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            className="px-5 py-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Sender Email Info */}
            {userEmail ? (
              <View className="mb-4 bg-surface-subtle p-3 rounded-xl border border-border flex-row items-center">
                <Ionicons
                  name="mail-outline"
                  size={16}
                  color="#71717a"
                  style={{ marginRight: 8 }}
                />
                <View className="flex-1">
                  <Text className="text-xs text-muted">Pengirim</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {userEmail}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Category Selector */}
            <View className="mb-4">
              <Text className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Kategori
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedType === cat.type;
                  return (
                    <TouchableOpacity
                      key={cat.type}
                      onPress={() => setSelectedType(cat.type)}
                      activeOpacity={0.7}
                      className={`flex-row items-center px-3 py-2 rounded-xl border ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-surface border-border"
                      }`}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={15}
                        color={isSelected ? "#ffffff" : "#71717a"}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        className={`text-xs font-semibold ${
                          isSelected
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Subject Field */}
            <View className="mb-4">
              <Text className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Subjek
              </Text>
              <View className="flex-row items-center bg-surface border border-border rounded-xl px-3.5 h-12">
                <TextInput
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Ringkasan kendala atau ide..."
                  placeholderTextColor="#a1a1aa"
                  className="flex-1 text-sm text-foreground h-full"
                />
              </View>
            </View>

            {/* Message Field */}
            <View className="mb-4">
              <Text className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Detail Deskripsi
              </Text>
              <View className="bg-surface border border-border rounded-xl px-3.5 py-3 min-h-[110px]">
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Jelaskan langkah terjadinya kendala atau ide yang ingin Anda bagikan..."
                  placeholderTextColor="#a1a1aa"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="text-sm text-foreground min-h-[90px]"
                />
              </View>
            </View>

            {/* Error Message */}
            {errorMessage ? (
              <View className="flex-row items-center mb-3 bg-red-50 p-2.5 rounded-xl border border-red-200">
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color="#dc2626"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-xs font-medium text-error flex-1">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Action Buttons */}
            <View className="flex-row gap-3 pt-2 pb-6">
              <Button
                label="Batal"
                variant="outline"
                size="md"
                onPress={handleClose}
                className="flex-1"
                disabled={isSubmitting}
              />
              <Button
                label="Kirim"
                variant="primary"
                size="md"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                className="flex-1"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default FeedbackModal;
