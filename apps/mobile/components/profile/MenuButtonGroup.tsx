import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

interface MenuItem {
	id: string;
	title: string;
	icon: keyof typeof Ionicons.glyphMap;
}

export function MenuButtonGroup({
	menuItems,
	title,
}: {
	menuItems: MenuItem[];
	title?: string;
}) {
	return (
		<View className="my-2">
			{title && (
				<Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-wider text-muted">
					{title}
				</Text>
			)}
			<View className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
				{menuItems.map((item, index) => {
					const isLastItem = index === menuItems.length - 1;
					return (
						<View key={item.id}>
							<TouchableOpacity
								activeOpacity={0.7}
								className="flex-row items-center justify-between p-3.5"
							>
								<View className="flex-row items-center">
									<View className="w-8 h-8 rounded-lg bg-surface-subtle border border-border items-center justify-center mr-3">
										<Ionicons
											name={item.icon}
											size={16}
											color="#18181b"
										/>
									</View>
									<Text className="text-sm font-semibold text-foreground">
										{item.title}
									</Text>
								</View>
								<Ionicons
									name="chevron-forward"
									size={16}
									color="#a1a1aa"
								/>
							</TouchableOpacity>
							{!isLastItem && <View className="h-px bg-divider ml-14" />}
						</View>
					);
				})}
			</View>
		</View>
	);
}

export default MenuButtonGroup;
