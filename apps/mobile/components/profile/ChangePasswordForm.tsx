import React, { useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { Toast } from "toastify-react-native";
import * as Haptics from "expo-haptics";

import { FormField } from "@/components/FormField";
import { Button } from "@/components/Button";
import { PasswordRequirements } from "./PasswordRequirements";

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Kata sandi saat ini wajib diisi"),
    new_password: z
      .string()
      .min(8, "Kata sandi baru minimal 8 karakter")
      .regex(/[a-z]/, "Kata sandi harus mengandung huruf kecil")
      .regex(/[A-Z]/, "Kata sandi harus mengandung huruf besar")
      .regex(
        /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
        "Kata sandi harus mengandung minimal 1 angka atau simbol",
      ),
    confirm_password: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirm_password"],
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: "Kata sandi baru tidak boleh sama dengan kata sandi saat ini",
    path: ["new_password"],
  });

export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
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

  const onSubmit = async (_data: ChangePasswordDTO) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);

    try {
      // Simulasi panggilan mutasi frontend sebelum endpoint backend dihubungkan
      await new Promise((resolve) => setTimeout(resolve, 800));

      Toast.success("Kata sandi berhasil diperbarui!");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      reset();
      router.back();
    } catch {
      Toast.error("Gagal memperbarui kata sandi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
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
          isLoading={isSubmitting}
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
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
}
