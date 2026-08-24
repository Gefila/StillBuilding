import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface DailySummaryCardsProps {
	totalTasks: number;
	completedTasks: number;
	focusMinutes?: number;
}

export default function DailySummaryCards({
	totalTasks = 0,
	completedTasks = 0,
	focusMinutes = 50,
}: DailySummaryCardsProps) {
	const pendingTasks = Math.max(0, totalTasks - completedTasks);
	const completionRate =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	return (
		<View className="flex-row gap-2.5 my-1.5">
			{/* Card 1: Fokus Harian */}
			<View className="flex-1 bg-surface p-3.5 rounded-2xl border border-border shadow-sm">
				<View className="flex-row items-center justify-between mb-2">
					<View className="w-7 h-7 rounded-lg bg-surface-subtle items-center justify-center border border-border">
						<Ionicons name="timer-outline" size={16} color="#18181b" />
					</View>
					<Text className="text-[10px] font-bold text-foreground bg-surface-subtle px-1.5 py-0.5 rounded border border-border">
						Hari Ini
					</Text>
				</View>
				<Text className="text-xl font-bold text-foreground tracking-tight">
					{focusMinutes} <Text className="text-xs font-normal text-muted">Mnt</Text>
				</Text>
				<Text className="text-[11px] text-muted font-medium mt-0.5">Waktu Fokus</Text>
			</View>

			{/* Card 2: Status Tugas */}
			<View className="flex-1 bg-surface p-3.5 rounded-2xl border border-border shadow-sm">
				<View className="flex-row items-center justify-between mb-2">
					<View className="w-7 h-7 rounded-lg bg-surface-subtle items-center justify-center border border-border">
						<Ionicons name="checkmark-done-outline" size={16} color="#16a34a" />
					</View>
					<Text className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
						{completionRate}%
					</Text>
				</View>
				<Text className="text-xl font-bold text-foreground tracking-tight">
					{completedTasks}/{totalTasks}
				</Text>
				<Text className="text-[11px] text-muted font-medium mt-0.5">Tugas Selesai</Text>
			</View>

			{/* Card 3: Pending */}
			<View className="flex-1 bg-surface p-3.5 rounded-2xl border border-border shadow-sm">
				<View className="flex-row items-center justify-between mb-2">
					<View className="w-7 h-7 rounded-lg bg-surface-subtle items-center justify-center border border-border">
						<Ionicons name="hourglass-outline" size={16} color="#d97706" />
					</View>
					<Text className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
						Aktif
					</Text>
				</View>
				<Text className="text-xl font-bold text-foreground tracking-tight">
					{pendingTasks}
				</Text>
				<Text className="text-[11px] text-muted font-medium mt-0.5">Tersisa</Text>
			</View>
		</View>
	);
}
