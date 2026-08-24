import React from "react";
import { Image, Text, View } from "react-native";

export default function HomeHeader({
	userName = "Gefila",
}: {
	userName?: string;
}) {
	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour >= 4 && hour < 11) return "Selamat Pagi ☀️";
		if (hour >= 11 && hour < 15) return "Selamat Siang 🌤️";
		if (hour >= 15 && hour < 18) return "Selamat Sore 🌅";
		return "Selamat Malam 🌙";
	};

	const getFormattedToday = () => {
		return new Intl.DateTimeFormat("id-ID", {
			weekday: "long",
			day: "numeric",
			month: "long",
		}).format(new Date());
	};

	return (
		<View className="flex-row items-center justify-between pb-3">
			<View className="flex-1">
				<Text className="text-[11px] font-semibold text-muted uppercase tracking-wider">
					{getFormattedToday()}
				</Text>
				<Text className="text-2xl font-bold text-foreground tracking-tight mt-0.5">
					{getGreeting()}
				</Text>
				<Text className="text-xs text-muted font-medium mt-0.5">
					Hai, <Text className="font-semibold text-foreground">{userName}</Text>! Siap fokus dan selesaikan target hari ini?
				</Text>
			</View>
			<View className="relative ml-3">
				<Image
					source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
					className="w-11 h-11 rounded-full border border-border bg-surface-subtle"
				/>
				<View className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
			</View>
		</View>
	);
}
