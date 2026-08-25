import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantStyles = {
  primary: "bg-primary border border-primary",
  secondary: "bg-secondary border border-border",
  outline: "bg-surface border border-border",
  ghost: "bg-transparent border border-transparent",
  danger: "bg-error border border-error",
};

const sizeStyles = {
  sm: "px-3 py-2 rounded-lg",
  md: "px-4 py-2.5 rounded-xl",
  lg: "px-6 py-3.5 rounded-xl",
};

const textStyles = {
  primary: "text-primary-foreground font-semibold text-sm",
  secondary: "text-secondary-foreground font-semibold text-sm",
  outline: "text-foreground font-semibold text-sm",
  ghost: "text-foreground font-medium text-sm",
  danger: "text-white font-semibold text-sm",
};

export function Button({
  label,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  const spinnerColor =
    variant === "primary" || variant === "danger" ? "#ffffff" : "#18181b";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`flex-row items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={spinnerColor} size={20} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {iconLeft}
          <Text className={textStyles[variant]}>{label}</Text>
          {iconRight}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default Button;
