import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TaskStatusBannerProps {
	status: string;
	onToggleStatus: () => void;
}

type StatusType = "Pending" | "Active" | "Done";

export default function TaskStatusBanner({
	status,
	onToggleStatus,
}: TaskStatusBannerProps) {
	const currentStatus = (status || "Pending") as StatusType;

	const statusConfig: Record<
		StatusType,
		{
			bg: string;
			border: string;
			textMain: string;
			textSub: string;
			icon: keyof typeof Ionicons.glyphMap;
			iconBg: string;
			iconColor: string;
			label: string;
			actionLabel: string;
		}
	> = {
		Pending: {
			bg: "bg-surface",
			border: "border-border",
			textMain: "text-foreground",
			textSub: "text-muted",
			icon: "hourglass-outline",
			iconBg: "bg-amber-50 border border-amber-200",
			iconColor: "#d97706",
			label: "Direncanakan (Pending)",
			actionLabel: "Mulai Tugas",
		},
		Active: {
			bg: "bg-primary",
			border: "border-primary",
			textMain: "text-primary-foreground",
			textSub: "text-zinc-400",
			icon: "play-circle-outline",
			iconBg: "bg-white/15",
			iconColor: "#ffffff",
			label: "Sedang Dikerjakan",
			actionLabel: "Tandai Selesai",
		},
		Done: {
			bg: "bg-emerald-50",
			border: "border-emerald-200",
			textMain: "text-emerald-900",
			textSub: "text-emerald-700",
			icon: "checkmark-circle",
			iconBg: "bg-emerald-100",
			iconColor: "#16a34a",
			label: "Selesai",
			actionLabel: "Buka Kembali",
		},
	};

	const config = statusConfig[currentStatus] || statusConfig.Pending;

	return (
		<View
			className={`mb-3 rounded-2xl p-4 flex-row items-center gap-3 border ${config.bg} ${config.border} shadow-2xs`}
		>
			{/* Icon Box */}
			<View
				className={`w-11 h-11 rounded-xl items-center justify-center ${config.iconBg}`}
			>
				<Ionicons name={config.icon} size={22} color={config.iconColor} />
			</View>

			{/* Text Info */}
			<View className="flex-1">
				<Text
					className={`text-[10px] font-semibold uppercase tracking-wider ${config.textSub}`}
				>
					Status Tugas
				</Text>
				<Text className={`text-sm font-bold mt-0.5 ${config.textMain}`}>
					{config.label}
				</Text>
			</View>

			{/* Button Action */}
			<TouchableOpacity
				onPress={onToggleStatus}
				activeOpacity={0.8}
				className={`px-3 py-1.5 rounded-xl border ${
					currentStatus === "Active"
						? "bg-white border-white"
						: currentStatus === "Done"
						? "bg-surface border-emerald-200"
						: "bg-surface-subtle border-border"
				}`}
			>
				<Text
					className={`text-xs font-semibold ${
						currentStatus === "Active"
							? "text-primary font-bold"
							: currentStatus === "Done"
							? "text-emerald-800 font-bold"
							: "text-foreground font-bold"
					}`}
				>
					{config.actionLabel}
				</Text>
			</TouchableOpacity>
		</View>
	);
}
