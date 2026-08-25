import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import type { TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label: string;
  labelIconName?: React.ComponentProps<typeof Ionicons>["name"];
  placeholder?: string;
  error?: string;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
} & TextInputProps;

export function FormField({
  label,
  labelIconName,
  placeholder,
  error,
  iconName,
  secureTextEntry,
  multiline,
  numberOfLines,
  ...props
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="w-full mb-4">
      {/* Label */}
      <View className="flex-row items-center mb-1.5 ml-0.5">
        {labelIconName && (
          <Ionicons
            name={labelIconName}
            size={14}
            color={error ? "#dc2626" : "#71717a"}
          />
        )}
        <Text
          className={`text-xs font-semibold uppercase tracking-wider ${
            labelIconName ? "ml-1.5" : ""
          } ${error ? "text-error" : "text-muted"}`}
        >
          {label}
        </Text>
      </View>

      {/* Input Container */}
      <View
        className={`flex-row border rounded-xl px-3.5 bg-surface ${
          multiline ? "py-3 min-h-[100px] items-start" : "h-12 items-center"
        } ${error ? "border-error" : "border-border"}`}
      >
        {/* Ikon Kiri */}
        {iconName && (
          <Ionicons
            name={iconName}
            size={18}
            color={error ? "#dc2626" : "#71717a"}
            style={{ marginRight: 10, marginTop: multiline ? 2 : 0 }}
          />
        )}

        {/* Text Input */}
        <TextInput
          className={`flex-1 text-sm text-foreground ${
            multiline ? "w-full min-h-[80px]" : "h-full"
          }`}
          placeholder={placeholder}
          placeholderTextColor="#a1a1aa"
          autoCapitalize="none"
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? "top" : "center"}
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />

        {/* Toggle Password */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
            className="pl-2"
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={18}
              color="#71717a"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Pesan Error */}
      {error && (
        <View className="flex-row items-center mt-1.5 ml-0.5">
          <Ionicons
            name="alert-circle"
            size={13}
            color="#dc2626"
            style={{ marginRight: 4 }}
          />
          <Text className="text-error text-xs font-medium">{error}</Text>
        </View>
      )}
    </View>
  );
}

export default FormField;
