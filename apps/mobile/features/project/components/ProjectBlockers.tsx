import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import Modal from "@/components/Modal";
import { Ionicons } from "@expo/vector-icons";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/Button";
import {
  useCreateBlocker,
  useUpdateBlocker,
  useDeleteBlocker,
} from "@/features/blocker/hooks/useBlocker";
import { BlockerLog } from "@/features/blocker/types/blocker.types";
import { formatLastSessionTime } from "@/utils/dateHelpers";

interface ProjectBlockersProps {
  projectId: string;
  blockers?: BlockerLog[];
}

type FilterType = "all" | "active" | "resolved";

export default function ProjectBlockers({
  projectId,
  blockers = [],
}: ProjectBlockersProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [reason, setReason] = useState("");
  const [solution, setSolution] = useState("");
  const [formError, setFormError] = useState("");

  const createBlockerMutation = useCreateBlocker();
  const updateBlockerMutation = useUpdateBlocker();
  const deleteBlockerMutation = useDeleteBlocker();

  const blockerList = Array.isArray(blockers) ? blockers : [];
  const activeCount = blockerList.filter((b) => !b.is_resolved).length;
  const resolvedCount = blockerList.filter((b) => b.is_resolved).length;

  const filteredBlockers = blockerList.filter((item) => {
    if (filter === "active") return !item.is_resolved;
    if (filter === "resolved") return item.is_resolved;
    return true;
  });

  const handleToggleResolved = (item: BlockerLog) => {
    updateBlockerMutation.mutate({
      id: item.id,
      data: {
        is_resolved: !item.is_resolved,
      },
    });
  };

  const handleDeleteBlocker = (id: string) => {
    Alert.alert(
      "Hapus Blocker",
      "Apakah Anda yakin ingin menghapus catatan kendala ini secara permanen?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => deleteBlockerMutation.mutate(id),
        },
      ],
    );
  };

  const handleCreateBlocker = () => {
    if (!reason.trim()) {
      setFormError("Deskripsi kendala / alasan wajib diisi");
      return;
    }

    createBlockerMutation.mutate(
      {
        project_id: projectId,
        reason: reason.trim(),
        solution: solution.trim() || undefined,
        is_resolved: false,
      },
      {
        onSuccess: () => {
          setReason("");
          setSolution("");
          setFormError("");
          setModalVisible(false);
        },
      },
    );
  };

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: blockerList.length },
    { key: "active", label: "Aktif", count: activeCount },
    { key: "resolved", label: "Tuntas", count: resolvedCount },
  ];

  return (
    <View className="flex-1">
      {/* Header & Add Button */}
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-bold text-foreground tracking-tight">
            Daftar Blocker & Kendala
          </Text>
          <View className="bg-surface-subtle px-2 py-0.5 rounded-full border border-border">
            <Text className="text-[11px] font-bold text-foreground">
              {filteredBlockers.length}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
          className="flex-row items-center bg-surface px-2.5 py-1 rounded-lg border border-border"
        >
          <Ionicons name="add" size={14} color="#18181b" />
          <Text className="text-xs font-semibold text-foreground ml-1">
            Catat Blocker
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Segmented Control */}
      <View className="flex-row bg-surface-subtle p-1 rounded-xl mb-3 border border-border">
        {filters.map((f) => {
          const isActive = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.8}
              className={`flex-1 flex-row items-center justify-center py-1.5 rounded-lg border ${
                isActive
                  ? "bg-surface shadow-xs border-border/80"
                  : "bg-transparent border-transparent"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isActive ? "text-foreground font-bold" : "text-muted"
                }`}
              >
                {f.label}
              </Text>
              <Text
                className={`text-[10px] ml-1.5 px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-surface-subtle text-foreground font-bold border border-border"
                    : "bg-surface/50 text-muted"
                }`}
              >
                {f.count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Blockers List */}
      {filteredBlockers.length > 0 ? (
        <View className="gap-2.5">
          {filteredBlockers.map((item) => {
            const isResolved = item.is_resolved;
            return (
              <View
                key={item.id}
                className={`bg-surface rounded-2xl p-3.5 border ${
                  isResolved ? "border-border opacity-75" : "border-red-200"
                } shadow-xs`}
              >
                {/* Header: Status & Actions */}
                <View className="flex-row items-start justify-between gap-2 mb-1.5">
                  <View className="flex-row items-center gap-1.5 flex-1">
                    <Ionicons
                      name={isResolved ? "checkmark-circle" : "alert-circle"}
                      size={16}
                      color={isResolved ? "#16a34a" : "#dc2626"}
                    />
                    <Text
                      className={`font-bold text-sm flex-1 ${
                        isResolved
                          ? "text-muted line-through"
                          : "text-foreground"
                      }`}
                      numberOfLines={2}
                    >
                      {item.reason}
                    </Text>
                  </View>

                  <View
                    className={`px-2 py-0.5 rounded-full border ${
                      isResolved
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-bold ${
                        isResolved ? "text-emerald-800" : "text-red-700"
                      }`}
                    >
                      {isResolved ? "Tuntas" : "Aktif"}
                    </Text>
                  </View>
                </View>

                {/* Solution note if available */}
                {item.solution ? (
                  <View className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2.5 mb-2 mt-1">
                    <View className="flex-row items-center gap-1 mb-0.5">
                      <Ionicons
                        name="bulb-outline"
                        size={12}
                        color="#16a34a"
                      />
                      <Text className="text-[11px] font-bold text-emerald-800">
                        Solusi / Pemecahan:
                      </Text>
                    </View>
                    <Text className="text-xs text-emerald-950 leading-relaxed">
                      {item.solution}
                    </Text>
                  </View>
                ) : null}

                {/* Footer: Timestamp & Action */}
                <View className="flex-row items-center justify-between pt-2.5 border-t border-divider">
                  <Text className="text-[11px] text-muted">
                    {formatLastSessionTime(item.created_at)}
                  </Text>

                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      onPress={() => handleToggleResolved(item)}
                      activeOpacity={0.8}
                      className={`px-2.5 py-1 rounded-lg border ${
                        isResolved
                          ? "bg-surface-subtle border-border"
                          : "bg-emerald-50 border-emerald-200"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          isResolved ? "text-foreground" : "text-emerald-800"
                        }`}
                      >
                        {isResolved ? "Buka Kembali" : "Tandai Tuntas"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteBlocker(item.id)}
                      activeOpacity={0.7}
                      className="p-1"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={14}
                        color="#a1a1aa"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View className="bg-surface p-6 rounded-2xl border border-dashed border-border items-center justify-center my-2">
          <View className="w-11 h-11 rounded-full bg-surface-subtle border border-border items-center justify-center mb-2.5">
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#16a34a"
            />
          </View>
          <Text className="text-sm font-semibold text-foreground text-center">
            {filter === "resolved"
              ? "Belum ada blocker yang diselesaikan"
              : "Semua Berjalan Lancar 🎉"}
          </Text>
          <Text className="text-xs text-muted text-center mt-0.5 px-2">
            {filter === "resolved"
              ? "Blocker yang tuntas akan tercatat di sini."
              : "Tidak ada blocker atau hambatan aktif pada proyek ini."}
          </Text>
          {filter !== "resolved" && (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="mt-3 px-3.5 py-1.5 bg-primary rounded-xl flex-row items-center active:opacity-80"
            >
              <Ionicons name="add" size={15} color="#ffffff" />
              <Text className="text-xs font-semibold text-primary-foreground ml-1">
                Catat Kendala Baru
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Create Blocker Modal Bottom Sheet */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => {
          setFormError("");
          setModalVisible(false);
        }}
        onBackButtonPress={() => {
          setFormError("");
          setModalVisible(false);
        }}
        backdropOpacity={0.65}
        backdropColor="#000000"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={250}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={1}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        avoidKeyboard={Platform.OS === "ios"}
        style={{ margin: 0, justifyContent: "flex-end" }}
      >
        <View className="bg-surface rounded-t-3xl p-5 pb-8 border-t border-border shadow-2xl">
          {/* Modal Header */}
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-base font-bold text-foreground">
                Catat Blocker / Kendala Baru
              </Text>
              <Text className="text-xs text-muted mt-0.5">
                Dokumentasikan hambatan yang menghambat progres proyek
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setFormError("");
                setModalVisible(false);
              }}
              className="p-1 rounded-full bg-surface-subtle border border-border"
            >
              <Ionicons name="close" size={18} color="#18181b" />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <FormField
              label="Alasan / Deskripsi Kendala"
              placeholder="Contoh: Database connection timeout pada query kompleks"
              labelIconName="alert-circle-outline"
              value={reason}
              onChangeText={(val) => {
                setReason(val);
                if (val.trim()) setFormError("");
              }}
              error={formError}
            />

            <FormField
              label="Catatan Solusi / Rencana (Opsional)"
              placeholder="Jelaskan solusi atau langkah yang diambil jika ada..."
              labelIconName="bulb-outline"
              multiline
              numberOfLines={3}
              value={solution}
              onChangeText={setSolution}
            />

            {/* Action Buttons */}
            <View className="mt-2 gap-2">
              <Button
                label="Simpan Blocker"
                variant="primary"
                isLoading={createBlockerMutation.isPending}
                onPress={handleCreateBlocker}
              />
              <Button
                label="Batal"
                variant="secondary"
                onPress={() => {
                  setFormError("");
                  setModalVisible(false);
                }}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
