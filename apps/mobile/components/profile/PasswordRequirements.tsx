import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PasswordRequirementsProps {
  password?: string;
}

export function PasswordRequirements({
  password = "",
}: PasswordRequirementsProps) {
  const hasMinLength = password.length >= 8;
  const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
    password,
  );

  const requirements = [
    {
      id: "length",
      label: "Minimal 8 karakter",
      isValid: hasMinLength,
    },
    {
      id: "case",
      label: "Kombinasi huruf besar (A-Z) & kecil (a-z)",
      isValid: hasUpperAndLower,
    },
    {
      id: "symbol",
      label: "Mengandung minimal 1 angka (0-9) atau simbol",
      isValid: hasNumberOrSpecial,
    },
  ];

  return (
    <View className="bg-surface-subtle/80 p-3 rounded-2xl border border-border/80 mb-4">
      <Text className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
        Kriteria Kata Sandi
      </Text>
      <View className="gap-1.5">
        {requirements.map((req) => (
          <View key={req.id} className="flex-row items-center gap-2">
            <Ionicons
              name={req.isValid ? "checkmark-circle" : "ellipse-outline"}
              size={14}
              color={req.isValid ? "#16a34a" : "#a1a1aa"}
            />
            <Text
              className={`text-xs ${
                req.isValid
                  ? "text-emerald-700 font-medium"
                  : "text-muted font-normal"
              }`}
            >
              {req.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
