import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useGetTaskById } from "@/features/task/hooks/useTask";
import FormTask from "@/features/task/components/FormTask";

export default function EditTask() {
	const { id } = useLocalSearchParams();
	const taskQuery = useGetTaskById({
		id: id as string,
		queryConfig: {
			enabled: !!id,
		},
	});

	if (taskQuery.isLoading) {
		return (
			<View className="flex-1 bg-background items-center justify-center">
				<ActivityIndicator size="large" color="#18181b" />
				<Text className="text-xs text-muted font-medium mt-2">
					Memuat rincian tugas...
				</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-background">
			<FormTask isEdit={true} initialData={taskQuery.data} />
		</View>
	);
}
