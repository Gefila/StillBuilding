import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface ScreenHeaderProps {
	title: string;
	subtitle?: string;
	showBackButton?: boolean;
	rightAction?: React.ReactNode;
	className?: string;
}

export function ScreenHeader({
	title,
	subtitle,
	showBackButton = false,
	rightAction,
	className = "",
}: ScreenHeaderProps) {
	const router = useRouter();

	return (
		<View className={`flex-row items-center justify-between pb-3 pt-1 ${className}`}>
			<View className="flex-row items-center flex-1 mr-2">
				{showBackButton && (
					<TouchableOpacity
						onPress={() => router.back()}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
						className="mr-3 p-1.5 rounded-xl bg-surface border border-border items-center justify-center"
					>
						<Ionicons name="arrow-back" size={20} color="#18181b" />
					</TouchableOpacity>
				)}
				<View className="flex-1">
					<Text className="text-2xl font-bold text-foreground tracking-tight">
						{title}
					</Text>
					{subtitle ? (
						<Text className="text-xs text-muted font-medium mt-0.5" numberOfLines={1}>
							{subtitle}
						</Text>
					) : null}
				</View>
			</View>
			{rightAction ? <View className="flex-row items-center">{rightAction}</View> : null}
		</View>
	);
}

export default ScreenHeader;
