import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TaskActionButton() {
	return (
		<View className="flex-row w-full gap-3">
			{/* Button Mark as Done  */}
			<TouchableOpacity className="flex-1 flex-row justify-center items-center py-3 bg-slate-50 rounded-lg border border-slate-200">
				<Ionicons name="checkmark-outline" size={16} color="#64748b" />
				<Text className="text-[12px] font-bold text-slate-600 ml-1.5 uppercase tracking-tight">
					Mark as Done
				</Text>
			</TouchableOpacity>
			{/* Button Start Session */}
			<TouchableOpacity className="flex-1 flex-row justify-center items-center py-3 bg-indigo-50 rounded-lg border border-indigo-100">
				<Ionicons name="play-outline" size={16} color="#4f46e5" />
				<Text className="text-[12px] font-bold text-indigo-600 ml-1.5 uppercase tracking-tight">
					Start Session
				</Text>
			</TouchableOpacity>
		</View>
	);
}
