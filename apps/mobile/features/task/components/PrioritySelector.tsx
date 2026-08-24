import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type Priority = "Low" | "Medium" | "High";

const priorities: Priority[] = ["Low", "Medium", "High"];

const priorityStyles: Record<
	Priority,
	{ label: string; activeStyle: string; activeText: string; activeIcon: string; dot: string }
> = {
	Low: {
		label: "Rendah",
		activeStyle: "bg-emerald-50 border-emerald-300",
		activeText: "text-emerald-800 font-bold",
		activeIcon: "#16a34a",
		dot: "bg-emerald-500",
	},
	Medium: {
		label: "Sedang",
		activeStyle: "bg-amber-50 border-amber-300",
		activeText: "text-amber-800 font-bold",
		activeIcon: "#d97706",
		dot: "bg-amber-500",
	},
	High: {
		label: "Tinggi",
		activeStyle: "bg-red-50 border-red-300",
		activeText: "text-red-800 font-bold",
		activeIcon: "#dc2626",
		dot: "bg-red-500",
	},
};

interface PrioritySelectorProps {
	value: string;
	onChange: (value: string) => void;
	error?: string;
}

export const PrioritySelector = ({
	value,
	onChange,
	error,
}: PrioritySelectorProps) => {
	return (
		<View className="mb-4">
			<View className="flex-row items-center mb-1.5 ml-0.5">
				<Ionicons name="flag-outline" size={13} color="#71717a" />
				<Text className="text-xs font-semibold text-muted ml-1.5 uppercase tracking-wider">
					Prioritas Tugas
				</Text>
			</View>

			<View className="flex-row gap-2">
				{priorities.map((p) => {
					const isSelected = value === p;
					const style = priorityStyles[p];

					return (
						<TouchableOpacity
							key={p}
							onPress={() => onChange(p)}
							activeOpacity={0.8}
							className={`flex-1 py-2.5 rounded-xl border items-center flex-row justify-center ${
								isSelected
									? style.activeStyle
									: "bg-surface border-border"
							}`}
						>
							<View
								className={`w-2 h-2 rounded-full mr-1.5 ${
									isSelected ? style.dot : "bg-border"
								}`}
							/>
							<Text
								className={`text-xs ${
									isSelected ? style.activeText : "text-muted font-medium"
								}`}
							>
								{p}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
			{error && <Text className="text-error text-xs mt-1 ml-0.5">{error}</Text>}
		</View>
	);
};

export default PrioritySelector;
