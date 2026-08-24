import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type ProjectStatus = "Active" | "On Hold" | "Completed";

const statuses: ProjectStatus[] = ["Active", "On Hold", "Completed"];

const statusConfig: Record<
	ProjectStatus,
	{ label: string; activeStyle: string; activeText: string; activeIcon: string; icon: keyof typeof Ionicons.glyphMap }
> = {
	Active: {
		label: "Active",
		activeStyle: "bg-surface-subtle border-foreground",
		activeText: "text-foreground font-bold",
		activeIcon: "#18181b",
		icon: "play-circle",
	},
	"On Hold": {
		label: "On Hold",
		activeStyle: "bg-amber-50 border-amber-300",
		activeText: "text-amber-800 font-bold",
		activeIcon: "#d97706",
		icon: "pause-circle",
	},
	Completed: {
		label: "Completed",
		activeStyle: "bg-emerald-50 border-emerald-300",
		activeText: "text-emerald-800 font-bold",
		activeIcon: "#16a34a",
		icon: "checkmark-circle",
	},
};

interface ProjectStatusSelectorProps {
	value: ProjectStatus;
	onChange: (value: ProjectStatus) => void;
	error?: string;
}

export const ProjectStatusSelector = ({
	value,
	onChange,
	error,
}: ProjectStatusSelectorProps) => {
	return (
		<View className="mb-5">
			<View className="flex-row items-center mb-1.5 ml-0.5">
				<Ionicons name="radio-button-on-outline" size={14} color="#71717a" />
				<Text className="text-xs font-semibold text-muted ml-1.5 uppercase tracking-wider">
					Status Proyek
				</Text>
			</View>

			<View className="flex-row gap-2">
				{statuses.map((s) => {
					const isSelected = value === s;
					const config = statusConfig[s];

					return (
						<TouchableOpacity
							key={s}
							onPress={() => onChange(s)}
							activeOpacity={0.8}
							className={`flex-1 py-2.5 rounded-xl border flex-row items-center justify-center ${
								isSelected
									? config.activeStyle
									: "bg-surface border-border"
							}`}
						>
							<Ionicons
								name={isSelected ? config.icon : "ellipse-outline"}
								size={15}
								color={isSelected ? config.activeIcon : "#a1a1aa"}
							/>
							<Text
								className={`text-xs ml-1.5 ${
									isSelected ? config.activeText : "text-muted font-medium"
								}`}
							>
								{config.label}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
			{error && <Text className="text-error text-xs mt-1 ml-0.5">{error}</Text>}
		</View>
	);
};

export default ProjectStatusSelector;