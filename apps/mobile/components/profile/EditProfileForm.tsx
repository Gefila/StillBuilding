import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Haptics from "expo-haptics";

import { ScreenHeader } from "@/components/ScreenHeader";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/Button";
import { AvatarPicker } from "./AvatarPicker";
import { ReadOnlyEmailField } from "./ReadOnlyEmailField";
import { useUpdateProfile } from "@/features/auth/hooks/useAuth";
import {
  updateProfileSchema,
  type AuthUser,
  type UpdateProfileDTO,
} from "@/features/auth/types/auth.types";

interface EditProfileFormProps {
  user?: AuthUser | null;
  insetsBottom?: number;
}

export function EditProfileForm({
  user,
  insetsBottom = 24,
}: EditProfileFormProps) {
  const router = useRouter();
  const updateProfileMutation = useUpdateProfile();

  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    user?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.full_name || user?.name || "Pengguna",
      )}&background=random`,
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileDTO>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: user?.full_name || user?.name || "",
      username: user?.username || "",
      avatar: selectedAvatar,
    },
    mode: "onChange",
  });

  const watchedFullName = watch("full_name");

  useEffect(() => {
    if (user) {
      if (user.full_name || user.name) {
        setValue("full_name", user.full_name || user.name || "");
      }
      if (user.username) {
        setValue("username", user.username);
      }
      if (user.avatar) {
        setSelectedAvatar(user.avatar);
        setValue("avatar", user.avatar);
      }
    }
  }, [user, setValue]);

  const handleSelectAvatar = (url: string) => {
    setSelectedAvatar(url);
    setValue("avatar", url, { shouldDirty: true });
  };

  const handleUseInitials = () => {
    const nameSeed = watchedFullName.trim() || user?.name || "Pengguna";
    const initialsUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nameSeed,
    )}&background=random&size=256`;
    setSelectedAvatar(initialsUrl);
    setValue("avatar", initialsUrl, { shouldDirty: true });
  };

  const onSubmit = (data: UpdateProfileDTO) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateProfileMutation.mutate({
      full_name: data.full_name.trim(),
      username: data.username.trim().toLowerCase(),
      avatar: selectedAvatar,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <ScreenHeader
          title="Edit Profil"
          subtitle="Perbarui nama, username, dan foto profil Anda"
          showBackButton={true}
        />

        {/* Avatar Picker Component */}
        <AvatarPicker
          selectedAvatar={selectedAvatar}
          onSelectAvatar={handleSelectAvatar}
          onUseInitials={handleUseInitials}
        />

        {/* Form Fields Card */}
        <View className="bg-surface p-4 rounded-3xl border border-border my-2 shadow-xs">
          <Controller
            control={control}
            name="full_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Nama Lengkap"
                labelIconName="person-outline"
                placeholder="Nama lengkap Anda"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.full_name?.message}
                iconName="person-circle-outline"
              />
            )}
          />

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Username"
                labelIconName="at-outline"
                placeholder="username_anda"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.username?.message}
                iconName="at"
              />
            )}
          />

          <ReadOnlyEmailField email={user?.email} />
        </View>

        {/* Action Buttons */}
        <View className="my-4 gap-2.5">
          <Button
            label="Simpan Perubahan"
            variant="primary"
            size="lg"
            isLoading={updateProfileMutation.isPending}
            onPress={handleSubmit(onSubmit)}
            iconRight={
              <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
            }
          />

          <Button
            label="Batal"
            variant="outline"
            size="lg"
            onPress={() => router.back()}
            disabled={updateProfileMutation.isPending}
          />
        </View>

        {/* Safe bottom spacing */}
        <View style={{ height: Math.max(insetsBottom, 24) }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
