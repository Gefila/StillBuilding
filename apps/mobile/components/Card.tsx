import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle";
}

export function Card({
  children,
  className = "",
  variant = "default",
  style,
  ...props
}: CardProps) {
  const variantClass =
    variant === "subtle"
      ? "bg-surface-subtle border-border"
      : variant === "elevated"
        ? "bg-surface border-border shadow-md"
        : "bg-surface border-border shadow-sm";

  return (
    <View
      className={`p-4 rounded-2xl border ${variantClass} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}

export default Card;
