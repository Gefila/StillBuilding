import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SessionItem {
	id: string;
	duration: string;
	startTime: string;
	endTime: string;
	type: "Focus" | "Break";
}

export default function SessionHistory() {
	const sessions: SessionItem[] = [
		{
			id: "1",
			duration: "25 Menit",
			type: "Focus",
			startTime: "14:00",
			endTime: "14:25",
		},
		{
			id: "2",
			duration: "5 Menit",
			type: "Break",
			startTime: "14:25",
			endTime: "14:30",
		},
	];

	return (
		<View>
			{/* Header */}
			<View className="flex-row justify-between items-center mb-3">
				<Text className="text-sm font-bold text-foreground">
					Riwayat Sesi Fokus
				</Text>
				<TouchableOpacity activeOpacity={0.7}>
					<Text className="text-xs text-muted font-semibold">Lihat Semua</Text>
				</TouchableOpacity>
			</View>

			{/* List Container */}
			<View className="gap-2.5">
				{sessions.map((item) => (
					<View
						key={item.id}
						className="bg-surface p-3.5 rounded-xl border border-border flex-row items-center shadow-2xs"
					>
						{/* Status Icon */}
						<View
							className={`w-8 h-8 rounded-lg items-center justify-center border ${
								item.type === "Focus"
									? "bg-surface-subtle border-border"
									: "bg-surface-subtle border-border"
							}`}
						>
							<Ionicons
								name={item.type === "Focus" ? "timer-outline" : "cafe-outline"}
								size={16}
								color="#18181b"
							/>
						</View>

						{/* Info Content */}
						<View className="flex-1 ml-3">
							<Text className="text-xs font-semibold text-foreground">
								{item.duration} · {item.type === "Focus" ? "Fokus Kerja" : "Istirahat"}
							</Text>

							<View className="flex-row items-center mt-0.5">
								<Ionicons name="time-outline" size={12} color="#a1a1aa" />
								<Text className="text-[11px] text-muted ml-1">
									{item.startTime} — {item.endTime}
								</Text>
							</View>
						</View>

						{/* Date */}
						<View className="ml-2">
							<Text className="text-[11px] text-muted font-medium">
								Hari Ini
							</Text>
						</View>
					</View>
				))}
			</View>
		</View>
	);
}
