import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProjectsStatProps {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	value: React.ReactNode;
	subtitle?: string;
}

export default function ProjectsStat({
	icon,
	title,
	value,
	subtitle,
}: ProjectsStatProps) {
	return (
		<View className="flex-1 bg-surface py-3 px-3.5 rounded-2xl border border-border flex-row items-center gap-3 shadow-2xs">
			<View className="w-8 h-8 rounded-xl bg-surface-subtle border border-border items-center justify-center">
				<Ionicons name={icon} size={16} color="#18181b" />
			</View>
			<View className="flex-1 justify-center">
				<Text className="text-xs font-medium text-muted" numberOfLines={1}>
					{title}
				</Text>
				<View className="flex-row items-baseline gap-1 mt-0.5">
					{typeof value === "string" || typeof value === "number" ? (
						<Text className="text-base font-bold text-foreground tracking-tight">
							{value}
						</Text>
					) : (
						value
					)}
					{subtitle ? (
						<Text
							className="text-[11px] text-muted font-normal"
							numberOfLines={1}
						>
							{subtitle}
						</Text>
					) : null}
				</View>
			</View>
		</View>
	);
}
