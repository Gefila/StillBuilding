import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { Toast } from "toastify-react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FormField } from "@/components/FormField";
import { Button } from "@/components/Button";
import { ScreenHeader } from "@/components/ScreenHeader";
import {
  createProjectSchema,
  Project,
  ProjectCategory,
} from "../types/project.types";
import {
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from "../hooks/useProject";
import IconSelector from "./IconSelector";
import { ProjectStatusSelector } from "./ProjectStatusSelector";
import ProjectPreviewCard from "./ProjectPreviewCard";
import {
  PROJECT_CATEGORIES,
  getCategoryConfig,
} from "../constants/projectCategories";

export default function FormProject({
  isEdit = false,
  initialData,
}: {
  isEdit?: boolean;
  initialData?: Project;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(createProjectSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      icon:
        initialData?.icon ||
        getCategoryConfig(initialData?.category).icon ||
        "code-slash-outline",
      description: initialData?.description || "",
      category: (initialData?.category as ProjectCategory) || "coding",
      status:
        (initialData?.status as "Active" | "On Hold" | "Completed") || "Active",
    },
  });

  // Live Watchers for Real-time Card Preview
  const watchedName = useWatch({ control, name: "name" });
  const watchedDescription = useWatch({ control, name: "description" });
  const watchedIcon = useWatch({ control, name: "icon" });
  const watchedCategory = useWatch({ control, name: "category" });
  const watchedStatus = useWatch({ control, name: "status" });

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const onSubmit = handleSubmit((data) => {
    if (isEdit && initialData?.id) {
      updateProjectMutation.mutate(
        { id: initialData.id, data },
        {
          onSuccess: () => {
            Toast.success("Proyek berhasil diperbarui");
            router.back();
          },
        },
      );
    } else {
      createProjectMutation.mutate(data, {
        onSuccess: () => {
          Toast.success("Proyek berhasil dibuat");
          reset();
          router.back();
        },
      });
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: insets.bottom + 32,
        }}
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Standard Header */}
        <ScreenHeader
          title={isEdit ? "Edit Proyek" : "Buat Proyek Baru"}
          subtitle={
            isEdit
              ? "Perbarui informasi dan target status proyek"
              : "Kelompokkan tugas dan kelola prioritas kerja Anda"
          }
          showBackButton={true}
        />

        {/* 2. Live Real-time Preview Card */}
        <ProjectPreviewCard
          name={watchedName}
          description={watchedDescription}
          icon={
            (watchedIcon as keyof typeof Ionicons.glyphMap) || "folder-outline"
          }
          category={watchedCategory as ProjectCategory}
          status={watchedStatus as "Active" | "On Hold" | "Completed"}
        />

        {/* 3. Category Chip Selector */}
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <View className="flex-row items-center mb-2 ml-0.5">
                <Ionicons name="pricetag-outline" size={13} color="#71717a" />
                <Text className="text-xs font-semibold text-muted ml-1.5 uppercase tracking-wider">
                  Kategori Proyek
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingHorizontal: 1 }}
              >
                {PROJECT_CATEGORIES.map((cat) => {
                  const isSelected = (value || "coding") === cat.key;
                  return (
                    <TouchableOpacity
                      key={cat.key}
                      onPress={() => {
                        onChange(cat.key);
                        setValue("icon", cat.icon, { shouldValidate: true });
                      }}
                      activeOpacity={0.75}
                      style={
                        isSelected
                          ? {
                              backgroundColor: cat.bgColor,
                              borderColor: cat.color,
                            }
                          : undefined
                      }
                      className={`flex-row items-center px-3.5 py-2 rounded-xl border ${
                        isSelected ? "" : "bg-surface border-border"
                      }`}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={14}
                        color={isSelected ? cat.color : "#71717a"}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={
                          isSelected
                            ? { color: cat.color, fontWeight: "700" }
                            : undefined
                        }
                        className={`text-xs ${
                          isSelected ? "" : "font-medium text-foreground"
                        }`}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        />

        {/* 4. Icon Selector */}
        <Controller
          control={control}
          name="icon"
          render={({ field: { onChange, value } }) => (
            <IconSelector
              label="Ikon Proyek"
              labelIconName="color-palette-outline"
              selectedIcon={
                (value as keyof typeof Ionicons.glyphMap) || "folder-outline"
              }
              onSelect={(iconName: keyof typeof Ionicons.glyphMap) => {
                onChange(iconName);
              }}
            />
          )}
        />

        {/* 5. Project Name Input */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Nama Proyek"
              placeholder="Contoh: Redesign Aplikasi StillBuilding"
              labelIconName="briefcase-outline"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
            />
          )}
        />

        {/* 6. Project Description Input with Character Count */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-1">
              <FormField
                label="Deskripsi (Opsional)"
                placeholder="Tuliskan sasaran atau lingkup proyek..."
                labelIconName="document-text-outline"
                multiline
                numberOfLines={3}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.description?.message}
              />
              <View className="flex-row justify-end -mt-3 mb-3 mr-0.5">
                <Text className="text-[11px] text-muted font-mono">
                  {(value || "").length}/200 karakter
                </Text>
              </View>
            </View>
          )}
        />

        {/* 7. Project Status Selector */}
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <ProjectStatusSelector
              value={(value as "Active" | "On Hold" | "Completed") ?? "Active"}
              onChange={(newValue) => onChange(newValue)}
            />
          )}
        />

        {/* 8. Action Buttons */}
        <View className="mt-2 mb-8 gap-2.5">
          <Button
            label={isEdit ? "Simpan Perubahan" : "Buat Proyek"}
            iconLeft={
              isEdit ? (
                <Ionicons name="checkmark-outline" size={18} color="#fff" />
              ) : (
                <Ionicons name="add" size={18} color="#fff" />
              )
            }
            variant="primary"
            onPress={onSubmit}
            isLoading={
              createProjectMutation.isPending || updateProjectMutation.isPending
            }
          />

          {isEdit && (
            <Button
              label="Hapus Proyek"
              iconLeft={
                <Ionicons name="trash-outline" size={18} color="#fff" />
              }
              variant="danger"
              onPress={() => {
                if (!initialData?.id) return;

                Alert.alert(
                  "Hapus Proyek",
                  "Apakah Anda yakin ingin menghapus proyek ini? Seluruh tugas yang terkait juga akan terhapus.",
                  [
                    { text: "Batal", style: "cancel" },
                    {
                      text: "Hapus",
                      style: "destructive",
                      onPress: () =>
                        deleteProjectMutation.mutate(initialData.id, {
                          onSuccess: () => {
                            Toast.success("Proyek berhasil dihapus");
                            router.replace("/projects");
                          },
                        }),
                    },
                  ],
                );
              }}
              isLoading={deleteProjectMutation.isPending}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
