import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const TaskFilters = () => {
	// State untuk melacak filter yang sedang aktif
	const [activeFilter, setActiveFilter] = useState("All");

	// Daftar opsi filter
	const filters = ["All", "High", "Medium", "Low", "Completed"];

	return (
		<View className="mb-4">
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false} // Menyembunyikan scrollbar
				className="flex-row"
				// Menambahkan padding atau gap di dalam scroll view
				contentContainerStyle={{
					paddingHorizontal: 2,
					gap: 8,
					width: "100%",
					justifyContent: "space-between",
				}}
			>
				{filters.map((filter) => {
					const isActive = activeFilter === filter;

					return (
						<TouchableOpacity
							key={filter}
							onPress={() => setActiveFilter(filter)}
							className={`px-4 py-2 rounded-lg ${
								isActive ? "bg-blue-100" : "bg-transparent"
							}`}
						>
							<Text
								className={`text-xs font-medium ${
									isActive ? "text-blue-700" : "text-slate-500"
								}`}
							>
								{filter}
							</Text>
						</TouchableOpacity>
					);
				})}
			</ScrollView>
		</View>
	);
};

export default TaskFilters;
