import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PomodoroSection = () => {
	return (
		<View className="bg-neutral-50 rounded-2xl p-5">
			{/* Header */}
			<View className="flex-row items-center justify-between mb-4">
				<View className="flex-row items-center">
					<Ionicons
						name="timer-outline"
						size={18}
						color="#737373"
						className="mr-2"
					/>
					<Text className="text-sm font-semibold text-neutral-800 ml-2">
						Pomodoro Sessions
					</Text>
				</View>
				<View className="bg-blue-50 px-2 py-0.5 rounded-lg">
					<Text className="text-xs font-semibold text-blue-600">2 of 4</Text>
				</View>
			</View>

			{/* Minimal Progress Bar */}
			<View className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden mb-4">
				<View className="h-full bg-blue-500" style={{ width: "50%" }} />
			</View>

			{/* Session Cards Row */}
			<View className="flex-row gap-2">
				{[1, 2].map((i) => (
					<View
						key={i}
						className="flex-1 bg-green-50 rounded-xl p-2.5 text-center border border-green-100 items-center"
					>
						<Text className="text-sm font-bold text-green-700">25m</Text>
						<Text className="text-[10px] font-medium text-green-600 mt-0.5">
							Done
						</Text>
					</View>
				))}
				{[3, 4].map((i) => (
					<View
						key={i}
						className="flex-1 bg-white rounded-xl p-2.5 text-center border border-dashed border-neutral-200 items-center"
					>
						<Text className="text-sm font-bold text-neutral-300">—</Text>
						<Text className="text-[10px] font-medium text-neutral-400 mt-0.5">
							{i === 3 ? "Next" : "Last"}
						</Text>
					</View>
				))}
			</View>

			{/* Start Button */}
			<TouchableOpacity className="mt-4 w-full py-3 bg-neutral-900 rounded-xl flex-row items-center justify-center">
				<Ionicons name="play" size={16} color="white" className="mr-2" />
				<Text className="text-white text-sm font-semibold ml-2">
					Start 25m Focus Session
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default PomodoroSection;
