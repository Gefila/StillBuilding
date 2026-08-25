import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import { useRegister } from "@/features/auth/hooks/useAuth";
import {
  registerSchema,
  type RegisterDTO,
} from "@/features/auth/types/auth.types";

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDTO>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: RegisterDTO) => {
    registerMutation.mutate(data);
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="px-6 py-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Header */}
          <View className="items-center mb-6">
            <View className="w-14 h-14 rounded-2xl bg-primary items-center justify-center shadow-sm mb-4">
              <Ionicons name="sparkles" size={28} color="#ffffff" />
            </View>
            <Text className="text-2xl font-bold text-foreground tracking-tight">
              Buat Akun StillBuilding
            </Text>
            <Text className="text-sm text-muted mt-1.5 text-center px-4">
              Mulai kelola sasaran, tingkatkan fokus, dan selesaikan
              tugas-tugasmu.
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-surface p-5 rounded-2xl border border-border shadow-xs mb-6">
            {/* Full Name Input */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Nama Lengkap"
                  labelIconName="person-outline"
                  placeholder="Nama lengkap Anda"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  error={errors.name?.message}
                  iconName="person-circle-outline"
                />
              )}
            />

            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Alamat Email"
                  labelIconName="mail-outline"
                  placeholder="nama@email.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={errors.email?.message}
                  iconName="at-outline"
                />
              )}
            />

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Kata Sandi"
                  labelIconName="lock-closed-outline"
                  placeholder="Minimal 6 karakter"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  error={errors.password?.message}
                  iconName="key-outline"
                />
              )}
            />

            {/* Confirm Password Input */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Konfirmasi Kata Sandi"
                  labelIconName="shield-checkmark-outline"
                  placeholder="Ulangi kata sandi"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  error={errors.confirmPassword?.message}
                  iconName="lock-closed-outline"
                />
              )}
            />

            {/* Submit Button */}
            <View className="mt-2">
              <Button
                label="Daftar Sekarang"
                variant="primary"
                size="lg"
                isLoading={registerMutation.isPending}
                onPress={handleSubmit(onSubmit)}
                iconRight={
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                }
              />
            </View>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-3">
            <View className="flex-1 h-[1px] bg-border" />
            <Text className="text-xs text-muted px-3 font-medium uppercase tracking-wider">
              atau
            </Text>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          {/* Google Register Option */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center justify-center bg-surface border border-border py-3.5 px-4 rounded-xl mb-6"
          >
            <Ionicons
              name="logo-google"
              size={18}
              color="#18181b"
              style={{ marginRight: 8 }}
            />
            <Text className="text-sm font-semibold text-foreground">
              Daftar dengan Google
            </Text>
          </TouchableOpacity>

          {/* Footer Login Link */}
          <View className="flex-row items-center justify-center gap-1.5 mb-2">
            <Text className="text-xs text-muted">Sudah memiliki akun?</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.replace("/(auth)/login" as any)}
            >
              <Text className="text-xs font-bold text-foreground underline">
                Masuk di Sini
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
