import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProjectsStatProps {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	value: React.ReactNode;
	badgeIcon?: keyof typeof Ionicons.glyphMap;
	badgeValue?: string | null;
	badgeColor?: string | null;
	footer?: string;
}

export default function ProjectsStat({
	icon,
	title,
	value,
	badgeIcon,
	badgeValue = null,
	badgeColor = null,
	footer,
}: ProjectsStatProps) {
	return (
		<View className="flex-col items-start bg-surface p-4 rounded-2xl border border-border flex-1 shadow-sm">
			<View className="flex-row items-center justify-between w-full mb-3">
				<View className="w-8 h-8 rounded-xl bg-surface-subtle border border-border items-center justify-center">
					<Ionicons name={icon} size={18} color="#18181b" />
				</View>
				{badgeValue && (
					<View className="flex-row items-center bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
						{badgeIcon && (
							<Ionicons name={badgeIcon} size={12} color="#16a34a" style={{ marginRight: 2 }} />
						)}
						<Text className="text-emerald-700 text-[10px] font-bold">{badgeValue}</Text>
					</View>
				)}
			</View>
			<Text className="text-xs text-muted font-medium">{title}</Text>
			<View className="my-0.5">
				{typeof value === "string" || typeof value === "number" ? (
					<Text className="text-xl font-bold text-foreground tracking-tight">{value}</Text>
				) : (
					value
				)}
			</View>
			{footer ? <Text className="text-[11px] text-muted">{footer}</Text> : null}
		</View>
	);
}
