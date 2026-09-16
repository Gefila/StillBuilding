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
import { useLogin } from "@/features/auth/hooks/useAuth";
import { loginSchema, type LoginDTO } from "@/features/auth/types/auth.types";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: LoginDTO) => {
    loginMutation.mutate(data);
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
          <View className="items-center mb-8">
            <View className="w-14 h-14 rounded-2xl bg-primary items-center justify-center shadow-sm mb-4">
              <Ionicons name="flash" size={28} color="#ffffff" />
            </View>
            <Text className="text-2xl font-bold text-foreground tracking-tight">
              Masuk ke StillBuilding
            </Text>
            <Text className="text-sm text-muted mt-1.5 text-center px-4">
              Lanjutkan fokus dan selesaikan tugas-tugasmu dengan terorganisir.
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-surface p-5 rounded-2xl border border-border shadow-xs mb-6">
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
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  error={errors.password?.message}
                  iconName="key-outline"
                />
              )}
            />

            {/* Forgot Password */}
            <View className="flex-row justify-end mt-1 mb-5">
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-xs text-foreground font-semibold">
                  Lupa Kata Sandi?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <Button
              label="Masuk Sekarang"
              variant="primary"
              size="lg"
              isLoading={loginMutation.isPending}
              onPress={handleSubmit(onSubmit)}
              iconRight={
                <Ionicons name="arrow-forward" size={18} color="#ffffff" />
              }
            />
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-[1px] bg-border" />
            <Text className="text-xs text-muted px-3 font-medium uppercase tracking-wider">
              atau
            </Text>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          {/* Google Login Option */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center justify-center bg-surface border border-border py-3.5 px-4 rounded-xl mb-8"
          >
            <Ionicons
              name="logo-google"
              size={18}
              color="#18181b"
              style={{ marginRight: 8 }}
            />
            <Text className="text-sm font-semibold text-foreground">
              Lanjutkan dengan Google
            </Text>
          </TouchableOpacity>

          {/* Footer Register Link */}
          <View className="flex-row items-center justify-center gap-1.5">
            <Text className="text-xs text-muted">Belum memiliki akun?</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.navigate("/(auth)/register" as any)}
            >
              <Text className="text-xs font-bold text-foreground underline">
                Daftar Sekarang
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
