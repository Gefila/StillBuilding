import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "@/components/Modal";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/Button";
import { useCreateBlocker } from "@/features/blocker/hooks/useBlocker";
import { useGetProjects } from "@/features/project/hooks/useProject";

interface QuickBlockerModalProps {
  visible: boolean;
  onClose: () => void;
  taskTitle?: string | null;
  projectId?: string | null;
}

export default function QuickBlockerModal({
  visible,
  onClose,
  taskTitle,
  projectId,
}: QuickBlockerModalProps) {
  const [reason, setReason] = useState("");
  const [solution, setSolution] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projectId || "",
  );
  const [formError, setFormError] = useState("");

  const projectsQuery = useGetProjects();
  const createBlockerMutation = useCreateBlocker();

  const projects = projectsQuery.data || [];
  const effectiveProjectId =
    selectedProjectId || projectId || (projects[0]?.id ?? "");

  const handleSave = async () => {
    if (!reason.trim()) {
      setFormError("Deskripsi hambatan / kendala wajib diisi");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!effectiveProjectId) {
      setFormError("Pilih proyek terkait untuk mencatat blocker ini");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      await createBlockerMutation.mutateAsync({
        project_id: effectiveProjectId,
        reason: reason.trim(),
        solution: solution.trim() || undefined,
        is_resolved: false,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setReason("");
      setSolution("");
      setFormError("");
      onClose();
    } catch (e) {
      console.error("Failed to save blocker:", e);
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.65}
      backdropColor="#000000"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={250}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={1}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      supportedOrientations={[
        "portrait",
        "landscape",
        "landscape-left",
        "landscape-right",
      ]}
      avoidKeyboard={Platform.OS === "ios"}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View className="bg-surface rounded-t-3xl p-5 pb-8 border-t border-border shadow-2xl max-h-[85%]">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-1 mr-2">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="warning-outline" size={18} color="#dc2626" />
              <Text className="text-base font-bold text-foreground">
                Catat Hambatan (Blocker)
              </Text>
            </View>
            <Text className="text-xs text-muted mt-0.5">
              {taskTitle
                ? `Konteks fokus: ${taskTitle}`
                : "Dokumentasikan distraksi atau kendala saat deep work"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="p-1 rounded-full bg-surface-subtle border border-border"
          >
            <Ionicons name="close" size={18} color="#18181b" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Project Selection if not predetermined */}
          {!projectId && projects.length > 0 && (
            <View className="mb-3">
              <Text className="text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Proyek Terkait
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {projects.map((p) => {
                  const isSelected = effectiveProjectId === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => setSelectedProjectId(p.id)}
                      className={`px-3 py-1.5 rounded-xl border flex-row items-center gap-1.5 ${
                        isSelected
                          ? "bg-surface-subtle border-foreground"
                          : "bg-surface border-border"
                      }`}
                    >
                      <Ionicons
                        name={(p.icon as any) || "folder-outline"}
                        size={13}
                        color={isSelected ? "#18181b" : "#71717a"}
                      />
                      <Text
                        className={`text-xs ${
                          isSelected
                            ? "font-bold text-foreground"
                            : "text-muted"
                        }`}
                      >
                        {p.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Form Fields */}
          <FormField
            label="Kendala / Hambatan yang Terjadi"
            placeholder="Contoh: Mengalami bug timeout pada endpoint auth, butuh riset indexing..."
            labelIconName="alert-circle-outline"
            multiline
            numberOfLines={3}
            value={reason}
            onChangeText={(val) => {
              setReason(val);
              if (val.trim()) setFormError("");
            }}
            error={formError}
          />

          <FormField
            label="Rencana Solusi / Next Step (Opsional)"
            placeholder="Contoh: Tambah index pada kolom foreign key..."
            labelIconName="bulb-outline"
            multiline
            numberOfLines={2}
            value={solution}
            onChangeText={setSolution}
          />

          {/* Action Buttons */}
          <View className="mt-2 gap-2">
            <Button
              label={
                createBlockerMutation.isPending
                  ? "Menyimpan Blocker..."
                  : "Simpan & Lanjutkan Fokus"
              }
              variant="primary"
              onPress={handleSave}
              disabled={createBlockerMutation.isPending}
              iconLeft={
                createBlockerMutation.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="checkmark-outline" size={16} color="#fff" />
                )
              }
            />
            <Button
              label="Batal"
              variant="secondary"
              onPress={onClose}
              disabled={createBlockerMutation.isPending}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
