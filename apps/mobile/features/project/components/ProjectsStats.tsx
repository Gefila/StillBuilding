import React from "react";
import { Text, View } from "react-native";
import ProjectsStat from "./ProjectsStat";

export default function ProjectsStats() {
	return (
		<View className="flex-row gap-3">
			<ProjectsStat
				icon="folder-outline"
				title="Proyek Aktif"
				value="5"
				badgeIcon="trending-up"
				badgeValue="+2"
				footer="Sedang berjalan"
			/>
			<ProjectsStat
				icon="checkmark-circle-outline"
				title="Tugas Tuntas"
				value={
					<View className="flex-row items-baseline gap-1">
						<Text className="text-xl font-bold text-foreground">12</Text>
						<Text className="text-xs text-muted">/ 20</Text>
					</View>
				}
				footer="Target mingguan"
			/>
		</View>
	);
}
