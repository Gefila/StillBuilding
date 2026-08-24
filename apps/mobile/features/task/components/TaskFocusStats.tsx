import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PomodoroSession } from "@/features/pomodoro/types/pomodoro.types";
import { formatDateID, formatTime } from "@/utils/dateHelpers";
import { Card } from "@/components/Card";

interface TaskFocusStatsProps {
	sessions: PomodoroSession[];
	onStartFocus: () => void;
}

const getSessionDurationMins = (session: PomodoroSession): number => {
	const rawDuration = session.duration || 25;
	// If stored in seconds (> 60), convert to minutes; otherwise it's in minutes
	return rawDuration > 60 ? Math.round(rawDuration / 60) : rawDuration;
};

export default function TaskFocusStats({
	sessions,
	onStartFocus,
}: TaskFocusStatsProps) {
	const totalFocusMinutes = sessions.reduce(
		(sum, s) => sum + getSessionDurationMins(s),
		0,
	);
	const sessionCount = sessions.length;
	const avgDuration =
		sessionCount > 0 ? Math.round(totalFocusMinutes / sessionCount) : 0;

	return (
		<Card className="mb-4">
			{/* Section Header */}
			<View className="flex-row items-center justify-between mb-3.5">
				<View className="flex-row items-center gap-2">
					<View className="w-7 h-7 rounded-lg bg-surface-subtle border border-border items-center justify-center">
						<Ionicons name="timer-outline" size={15} color="#18181b" />
					</View>
					<Text className="text-sm font-bold text-foreground tracking-tight">
						Statistik & Riwayat Fokus
					</Text>
				</View>
				{sessionCount > 0 && (
					<View className="bg-surface-subtle px-2 py-0.5 rounded-full border border-border">
						<Text className="text-[10px] font-bold text-muted">
							{sessionCount} Sesi Selesai
						</Text>
					</View>
				)}
			</View>

			{/* Metric Cards Grid (3-column) */}
			<View className="flex-row gap-2 mb-4">
				{/* 1. Total Time */}
				<View className="flex-1 bg-surface-subtle border border-border rounded-xl p-2.5 items-center">
					<Text className="text-[10px] font-bold text-muted uppercase tracking-wider">
						Total Waktu
					</Text>
					<Text className="text-lg font-extrabold text-foreground mt-0.5">
						{totalFocusMinutes}{" "}
						<Text className="text-[10px] font-normal text-muted">m</Text>
					</Text>
				</View>

				{/* 2. Total Sessions */}
				<View className="flex-1 bg-surface-subtle border border-border rounded-xl p-2.5 items-center">
					<Text className="text-[10px] font-bold text-muted uppercase tracking-wider">
						Total Sesi
					</Text>
					<Text className="text-lg font-extrabold text-foreground mt-0.5">
						{sessionCount}
					</Text>
				</View>

				{/* 3. Average Duration */}
				<View className="flex-1 bg-surface-subtle border border-border rounded-xl p-2.5 items-center">
					<Text className="text-[10px] font-bold text-muted uppercase tracking-wider">
						Rata-rata
					</Text>
					<Text className="text-lg font-extrabold text-foreground mt-0.5">
						{avgDuration}{" "}
						<Text className="text-[10px] font-normal text-muted">m/sesi</Text>
					</Text>
				</View>
			</View>

			{/* Session Timeline / List */}
			{sessionCount > 0 ? (
				<View className="pt-2 border-t border-divider">
					<Text className="text-xs font-bold uppercase tracking-wider text-muted mb-2.5">
						Riwayat Sesi
					</Text>

					<View className="gap-2">
						{sessions.map((session, index) => {
							const sessionNum = sessionCount - index;
							const sessionDate = session.ended_at || session.started_at;
							const startTime = formatTime(session.started_at);
							const endTime = session.ended_at
								? formatTime(session.ended_at)
								: "Selesai";
							const durationMins = getSessionDurationMins(session);

							return (
								<View
									key={session.id || index}
									className="flex-row items-center justify-between bg-surface-subtle border border-border rounded-xl px-3 py-2.5"
								>
									{/* Session Label & Details */}
									<View className="flex-row items-center gap-2.5">
										<View className="w-7 h-7 rounded-lg bg-surface border border-border items-center justify-center">
											<Text className="text-xs font-bold text-foreground">
												#{sessionNum}
											</Text>
										</View>
										<View>
											<Text className="text-xs font-semibold text-foreground">
												{formatDateID(sessionDate)}
											</Text>
											<View className="flex-row items-center mt-0.5">
												<Ionicons name="time-outline" size={10} color="#71717a" />
												<Text className="text-[10px] text-muted ml-1 font-medium">
													{startTime} - {endTime}
												</Text>
											</View>
										</View>
									</View>

									{/* Duration Badge */}
									<View className="bg-surface border border-border px-2.5 py-1 rounded-lg">
										<Text className="text-xs font-bold text-foreground">
											{durationMins} m
										</Text>
									</View>
								</View>
							);
						})}
					</View>
				</View>
			) : (
				/* Empty State */
				<View className="pt-2 border-t border-divider items-center py-4">
					<View className="w-12 h-12 rounded-2xl bg-surface-subtle border border-border items-center justify-center mb-2.5">
						<Ionicons name="hourglass-outline" size={22} color="#a1a1aa" />
					</View>
					<Text className="text-xs font-semibold text-foreground text-center">
						Belum Ada Riwayat Sesi Fokus
					</Text>
					<Text className="text-[11px] text-muted text-center mt-0.5 mb-3.5 px-4">
						Fokuskan perhatian Anda pada tugas ini menggunakan timer Pomodoro.
					</Text>
					<TouchableOpacity
						onPress={onStartFocus}
						activeOpacity={0.8}
						className="flex-row items-center bg-foreground px-3.5 py-2 rounded-xl"
					>
						<Ionicons name="play" size={13} color="#ffffff" />
						<Text className="text-xs font-bold text-background ml-1.5">
							Mulai Sesi Fokus
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</Card>
	);
}
