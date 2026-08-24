import React from "react";
import FormTask from "@/features/task/components/FormTask";
import { View } from "react-native";

export default function CreateTask() {
	return (
		<View className="flex-1 bg-background">
			<FormTask />
		</View>
	);
}