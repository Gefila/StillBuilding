import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TabItem {
	id: string;
	label: string;
	icon: keyof typeof Ionicons.glyphMap;
}

export default function ProjectTabs({
	activeTab,
	setActiveTab,
}: {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}) {
	const tabs: TabItem[] = [
		{ id: "tasks", label: "Tugas", icon: "checkbox-outline" },
		{ id: "blockers", label: "Blocker", icon: "warning-outline" },
		{ id: "pomodoro", label: "Fokus", icon: "timer-outline" },
		{ id: "notes", label: "Catatan", icon: "document-text-outline" },
	];

	return (
		<View className="my-1">
			<View className="bg-surface-subtle rounded-2xl border border-border p-1 flex-row gap-1">
				{tabs.map((tab) => {
					const isActive = activeTab === tab.id;

					return (
						<TouchableOpacity
							key={tab.id}
							onPress={() => setActiveTab(tab.id)}
							activeOpacity={0.8}
							className={`will-change-variable flex-1 py-2 rounded-xl flex-row items-center justify-center gap-1.5 border ${
								isActive
									? "bg-surface border-border/80 shadow-xs"
									: "bg-transparent border-transparent"
							}`}
						>
							<Ionicons
								name={tab.icon}
								size={15}
								color={isActive ? "#18181b" : "#71717a"}
							/>
							<Text
								className={`will-change-variable text-xs font-semibold ${
									isActive ? "text-foreground font-bold" : "text-muted"
								}`}
							>
								{tab.label}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
}
