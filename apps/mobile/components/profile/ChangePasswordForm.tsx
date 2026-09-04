import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { FormField } from "@/components/FormField";
import { Button } from "@/components/Button";
import { PasswordRequirements } from "./PasswordRequirements";
import { useChangePassword } from "@/features/auth/hooks/useAuth";
import {
  changePasswordSchema,
  type ChangePasswordDTO,
} from "@/features/auth/types/auth.types";

export function ChangePasswordForm() {
  const router = useRouter();
  const changePasswordMutation = useChangePassword();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordDTO>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    mode: "onChange",
  });

  const watchedNewPassword = watch("new_password");

  const onSubmit = (data: ChangePasswordDTO) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    changePasswordMutation.mutate(
      {
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          reset();
        },
        onError: (err: any) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          const serverMessage = err?.response?.data?.message;
          if (
            serverMessage &&
            serverMessage.toLowerCase().includes("kata sandi saat ini")
          ) {
            setError("current_password", {
              type: "manual",
              message: serverMessage,
            });
          }
        },
      },
    );
  };

  return (
    <View>
      {/* Password Inputs Card */}
      <View className="bg-surface p-4 rounded-3xl border border-border my-2 shadow-xs">
        <Text className="text-sm font-bold text-foreground mb-1">
          Ubah Kata Sandi
        </Text>
        <Text className="text-xs text-muted mb-4">
          Pastikan Anda mengingat kata sandi baru yang akan dibuat.
        </Text>

        {/* Current Password Field */}
        <Controller
          control={control}
          name="current_password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Kata Sandi Saat Ini"
              labelIconName="lock-closed-outline"
              placeholder="Masukkan kata sandi lama"
              secureTextEntry={true}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.current_password?.message}
              iconName="lock-closed-outline"
            />
          )}
        />

        {/* New Password Field */}
        <Controller
          control={control}
          name="new_password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Kata Sandi Baru"
              labelIconName="key-outline"
              placeholder="Minimal 8 karakter unik"
              secureTextEntry={true}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.new_password?.message}
              iconName="key-outline"
            />
          )}
        />

        {/* Dynamic Password Requirements Checklist */}
        <PasswordRequirements password={watchedNewPassword} />

        {/* Confirm New Password Field */}
        <Controller
          control={control}
          name="confirm_password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Konfirmasi Kata Sandi Baru"
              labelIconName="shield-checkmark-outline"
              placeholder="Ulangi kata sandi baru"
              secureTextEntry={true}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirm_password?.message}
              iconName="shield-checkmark-outline"
            />
          )}
        />
      </View>

      {/* Security Tip Card */}
      <View className="bg-amber-500/5 p-4 rounded-3xl border border-amber-500/20 my-2">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="bulb-outline" size={16} color="#d97706" />
          <Text className="text-xs font-bold text-amber-900">
            Tips Keamanan Akun
          </Text>
        </View>
        <Text className="text-[11px] text-amber-800 leading-relaxed">
          Gunakan kata sandi unik yang belum pernah Anda pakai di platform lain.
          Kombinasi simbol dan angka membuat akun Anda jauh lebih sulit
          ditembus.
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="my-4 gap-2.5">
        <Button
          label="Perbarui Kata Sandi"
          variant="primary"
          size="lg"
          isLoading={changePasswordMutation.isPending}
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
          disabled={changePasswordMutation.isPending}
        />
      </View>
    </View>
  );
}
