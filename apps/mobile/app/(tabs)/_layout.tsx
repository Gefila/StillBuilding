import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
	const insets = useSafeAreaInsets();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#18181b",
				tabBarInactiveTintColor: "#a1a1aa",
				tabBarStyle: {
					backgroundColor: "#ffffff",
					borderTopColor: "#e4e4e7",
					borderTopWidth: 1,
					height: 56 + insets.bottom,
					paddingBottom: Math.max(insets.bottom, 6),
					paddingTop: 6,
				},
				tabBarLabelStyle: {
					fontSize: 10,
					fontWeight: "600",
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ focused, color }) => (
						<Ionicons
							name={focused ? "grid" : "grid-outline"}
							size={20}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="projects"
				options={{
					title: "Projects",
					tabBarIcon: ({ focused, color }) => (
						<Ionicons
							name={focused ? "folder" : "folder-outline"}
							size={20}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="focus"
				options={{
					title: "Focus",
					tabBarIcon: ({ focused, color }) => (
						<Ionicons
							name={focused ? "timer" : "timer-outline"}
							size={20}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ focused, color }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							size={20}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
