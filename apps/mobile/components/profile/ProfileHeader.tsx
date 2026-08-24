import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";

export default function ProfileHeader() {
	const storedUser = useAuthStore((state) => state.user);
	const { data: currentUser } = useCurrentUser();

	const user = currentUser || storedUser;
	const displayName = user?.name || user?.full_name || user?.username || "Pengguna StillBuilding";
	const displayEmail = user?.email || "Belum ada email";
	const avatarUrl =
		user?.avatar ||
		`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

	return (
		<View className="flex-col items-center bg-surface p-5 rounded-2xl border border-border my-2 shadow-xs">
			<View className="relative">
				<Image
					source={{ uri: avatarUrl }}
					className="w-20 h-20 rounded-full border border-border bg-surface-subtle"
				/>
				<View className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-surface" />
			</View>
			<View className="flex-col items-center gap-0.5 mt-3">
				<Text className="text-xl font-bold text-foreground">
					{displayName}
				</Text>
				<Text className="text-xs text-muted font-medium">
					{displayEmail}
				</Text>

				<TouchableOpacity
					activeOpacity={0.8}
					className="mt-3 px-3.5 py-1.5 bg-surface-subtle border border-border rounded-xl flex-row items-center"
				>
					<Ionicons
						name="create-outline"
						size={14}
						color="#18181b"
						style={{ marginRight: 4 }}
					/>
					<Text className="text-xs font-semibold text-foreground">Edit Profil</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
