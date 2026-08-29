import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ToastManager, { Toast } from "toastify-react-native";
import type {
  ToastConfig,
  ToastConfigParams,
  ToastType,
} from "toastify-react-native/utils/interfaces";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface VariantConfig {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  bg: string;
  border: string;
}

const variantMap: Record<ToastType, VariantConfig> = {
  success: {
    icon: "checkmark-circle",
    iconColor: "#16a34a",
    bg: "#f0fdf4",
    border: "#dcfce7",
  },
  error: {
    icon: "alert-circle",
    iconColor: "#dc2626",
    bg: "#fef2f2",
    border: "#fee2e2",
  },
  warn: {
    icon: "warning",
    iconColor: "#d97706",
    bg: "#fffbeb",
    border: "#fef3c7",
  },
  info: {
    icon: "information-circle",
    iconColor: "#2563eb",
    bg: "#eff6ff",
    border: "#dbeafe",
  },
  default: {
    icon: "sparkles",
    iconColor: "#18181b",
    bg: "#f4f4f5",
    border: "#e4e4e7",
  },
};

export function CustomToast(props: ToastConfigParams) {
  const { text1, text2, type = "default", hide } = props;
  const variant = variantMap[type] || variantMap.default;

  return (
    <View
      className="w-[92%] max-w-105 bg-surface rounded-2xl border border-border px-3.5 py-3 flex-row items-center"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      {/* Icon Badge */}
      <View
        style={{ backgroundColor: variant.bg, borderColor: variant.border }}
        className="w-8 h-8 rounded-xl items-center justify-center border"
      >
        <Ionicons name={variant.icon} size={18} color={variant.iconColor} />
      </View>

      {/* Text Container */}
      <View className="flex-1 ml-3 mr-2 justify-center">
        {text1 ? (
          <Text
            className="text-sm font-semibold text-foreground leading-tight"
            numberOfLines={2}
          >
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text
            className="text-xs text-muted mt-0.5 leading-4"
            numberOfLines={2}
          >
            {text2}
          </Text>
        ) : null}
      </View>

      {/* Close Action */}
      {hide && (
        <TouchableOpacity
          onPress={hide}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="p-1.5 rounded-lg active:bg-surface-subtle"
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={16} color="#a1a1aa" />
        </TouchableOpacity>
      )}
    </View>
  );
}

export const toastConfig: ToastConfig = {
  success: (props) => <CustomToast {...props} type="success" />,
  error: (props) => <CustomToast {...props} type="error" />,
  info: (props) => <CustomToast {...props} type="info" />,
  warn: (props) => <CustomToast {...props} type="warn" />,
  default: (props) => <CustomToast {...props} type="default" />,
};

export function AppToast() {
  const insets = useSafeAreaInsets();
  const topOffset = insets.top > 0 ? insets.top + 8 : 44;

  return (
    <ToastManager
      config={toastConfig}
      topOffset={topOffset}
      animationStyle="slide"
      duration={3200}
      useModal={false}
      showProgressBar={false}
      showCloseIcon={false}
    />
  );
}

export { Toast, ToastManager };
export default AppToast;
