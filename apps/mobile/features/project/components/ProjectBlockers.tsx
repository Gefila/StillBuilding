import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Platform,
} from "react-native";
import Modal from "@/components/Modal";
import { Ionicons } from "@expo/vector-icons";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/Button";

interface BlockerItem {
	id: string;
	title: string;
	description: string;
	status: "Active" | "Resolved";
	createdAt: string;
	resolvedAt?: string;
}

const INITIAL_BLOCKERS: BlockerItem[] = [
	{
		id: "1",
		title: "Database Connection Timeout",
		description:
			"Terjadi kendala timeout saat query filter relasi data kompleks. Perlu optimasi indexing pada Supabase.",
		status: "Active",
		createdAt: "2 jam yang lalu",
	},
	{
		id: "2",
		title: "CORS Header API Issue",
		description:
			"Header CORS missing saat deploy backend di staging. Selesai diperbaiki di Express middleware.",
		status: "Resolved",
		createdAt: "Kemarin",
		resolvedAt: "Kemarin, 16:30",
	},
];

type FilterType = "all" | "active" | "resolved";

export default function ProjectBlockers() {
	const [blockers, setBlockers] = useState<BlockerItem[]>(INITIAL_BLOCKERS);
	const [filter, setFilter] = useState<FilterType>("all");
	const [modalVisible, setModalVisible] = useState(false);

	// New Blocker Form State
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [formError, setFormError] = useState("");

	const activeCount = blockers.filter((b) => b.status === "Active").length;
	const resolvedCount = blockers.filter((b) => b.status === "Resolved").length;

	const filteredBlockers = blockers.filter((item) => {
		if (filter === "active") return item.status === "Active";
		if (filter === "resolved") return item.status === "Resolved";
		return true;
	});

	const handleToggleResolved = (id: string) => {
		setBlockers((prev) =>
			prev.map((item) => {
				if (item.id === id) {
					const nextStatus = item.status === "Active" ? "Resolved" : "Active";
					return {
						...item,
						status: nextStatus,
						resolvedAt: nextStatus === "Resolved" ? "Baru saja" : undefined,
					};
				}
				return item;
			}),
		);
	};

	const handleDeleteBlocker = (id: string) => {
		setBlockers((prev) => prev.filter((item) => item.id !== id));
	};

	const handleCreateBlocker = () => {
		if (!title.trim()) {
			setFormError("Judul kendala wajib diisi");
			return;
		}

		const newBlocker: BlockerItem = {
			id: Date.now().toString(),
			title: title.trim(),
			description: description.trim() || "Tidak ada detail tambahan",
			status: "Active",
			createdAt: "Baru saja",
		};

		setBlockers((prev) => [newBlocker, ...prev]);
		setTitle("");
		setDescription("");
		setFormError("");
		setModalVisible(false);
	};

	const filters: { key: FilterType; label: string; count: number }[] = [
		{ key: "all", label: "Semua", count: blockers.length },
		{ key: "active", label: "Aktif", count: activeCount },
		{ key: "resolved", label: "Tuntas", count: resolvedCount },
	];

	return (
		<View className="flex-1">
			{/* Header & Add Button */}
			<View className="flex-row items-center justify-between mb-2.5">
				<View className="flex-row items-center gap-2">
					<Text className="text-base font-bold text-foreground tracking-tight">
						Daftar Blocker & Kendala
					</Text>
					<View className="bg-surface-subtle px-2 py-0.5 rounded-full border border-border">
						<Text className="text-[11px] font-bold text-foreground">
							{filteredBlockers.length}
						</Text>
					</View>
				</View>

				<TouchableOpacity
					onPress={() => setModalVisible(true)}
					activeOpacity={0.8}
					className="flex-row items-center bg-surface px-2.5 py-1 rounded-lg border border-border"
				>
					<Ionicons name="add" size={14} color="#18181b" />
					<Text className="text-xs font-semibold text-foreground ml-1">
						Catat Blocker
					</Text>
				</TouchableOpacity>
			</View>

			{/* Filter Segmented Control */}
			<View className="flex-row bg-surface-subtle p-1 rounded-xl mb-3 border border-border">
				{filters.map((f) => {
					const isActive = filter === f.key;
					return (
						<TouchableOpacity
							key={f.key}
							onPress={() => setFilter(f.key)}
							activeOpacity={0.8}
							className={`will-change-variable flex-1 flex-row items-center justify-center py-1.5 rounded-lg border ${
								isActive
									? "bg-surface shadow-xs border-border/80"
									: "bg-transparent border-transparent"
							}`}
						>
							<Text
								className={`will-change-variable text-xs font-semibold ${
									isActive ? "text-foreground font-bold" : "text-muted"
								}`}
							>
								{f.label}
							</Text>
							<Text
								className={`text-[10px] ml-1.5 px-1.5 py-0.2 rounded-full ${
									isActive
										? "bg-surface-subtle text-foreground font-bold border border-border"
										: "bg-surface/50 text-muted"
								}`}
							>
								{f.count}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>

			{/* Blockers List */}
			{filteredBlockers.length > 0 ? (
				<View className="gap-2.5">
					{filteredBlockers.map((item) => {
						const isResolved = item.status === "Resolved";
						return (
							<View
								key={item.id}
								className={`bg-surface rounded-2xl p-3.5 border ${
									isResolved ? "border-border opacity-75" : "border-red-200"
								} shadow-xs`}
							>
								{/* Header: Title + Status Pill */}
								<View className="flex-row items-start justify-between gap-2 mb-1.5">
									<View className="flex-row items-center gap-1.5 flex-1">
										<Ionicons
											name={isResolved ? "checkmark-circle" : "alert-circle"}
											size={16}
											color={isResolved ? "#16a34a" : "#dc2626"}
										/>
										<Text
											className={`font-bold text-sm flex-1 ${
												isResolved
													? "text-muted line-through"
													: "text-foreground"
											}`}
											numberOfLines={1}
										>
											{item.title}
										</Text>
									</View>

									<View
										className={`px-2 py-0.5 rounded-full border ${
											isResolved
												? "bg-emerald-50 border-emerald-200"
												: "bg-red-50 border-red-200"
										}`}
									>
										<Text
											className={`text-[10px] font-bold ${
												isResolved ? "text-emerald-800" : "text-red-700"
											}`}
										>
											{isResolved ? "Tuntas" : "Aktif"}
										</Text>
									</View>
								</View>

								{/* Description */}
								<Text className="text-xs text-muted leading-relaxed mb-3">
									{item.description}
								</Text>

								{/* Footer: Timestamp & Action */}
								<View className="flex-row items-center justify-between pt-2.5 border-t border-divider">
									<Text className="text-[11px] text-muted">
										{isResolved && item.resolvedAt
											? `Tuntas: ${item.resolvedAt}`
											: `Dicatat: ${item.createdAt}`}
									</Text>

									<View className="flex-row items-center gap-2">
										<TouchableOpacity
											onPress={() => handleToggleResolved(item.id)}
											activeOpacity={0.8}
											className={`px-2.5 py-1 rounded-lg border ${
												isResolved
													? "bg-surface-subtle border-border"
													: "bg-emerald-50 border-emerald-200"
											}`}
										>
											<Text
												className={`text-xs font-semibold ${
													isResolved ? "text-foreground" : "text-emerald-800"
												}`}
											>
												{isResolved ? "Buka Kembali" : "Tandai Tuntas"}
											</Text>
										</TouchableOpacity>

										<TouchableOpacity
											onPress={() => handleDeleteBlocker(item.id)}
											activeOpacity={0.7}
											className="p-1"
										>
											<Ionicons
												name="trash-outline"
												size={14}
												color="#a1a1aa"
											/>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						);
					})}
				</View>
			) : (
				<View className="bg-surface p-6 rounded-2xl border border-dashed border-border items-center justify-center my-2">
					<View className="w-11 h-11 rounded-full bg-surface-subtle border border-border items-center justify-center mb-2.5">
						<Ionicons
							name="shield-checkmark-outline"
							size={20}
							color="#16a34a"
						/>
					</View>
					<Text className="text-sm font-semibold text-foreground text-center">
						{filter === "resolved"
							? "Belum ada blocker yang diselesaikan"
							: "Semua Berjalan Lancar 🎉"}
					</Text>
					<Text className="text-xs text-muted text-center mt-0.5 px-2">
						{filter === "resolved"
							? "Blocker yang tuntas akan tercatat di sini."
							: "Tidak ada blocker atau hambatan aktif pada proyek ini."}
					</Text>
					{filter !== "resolved" && (
						<TouchableOpacity
							onPress={() => setModalVisible(true)}
							className="mt-3 px-3.5 py-1.5 bg-primary rounded-xl flex-row items-center active:opacity-80"
						>
							<Ionicons name="add" size={15} color="#ffffff" />
							<Text className="text-xs font-semibold text-primary-foreground ml-1">
								Catat Kendala Baru
							</Text>
						</TouchableOpacity>
					)}
				</View>
			)}

			{/* Create Blocker Modal Bottom Sheet */}
			<Modal
				isVisible={modalVisible}
				onBackdropPress={() => {
					setFormError("");
					setModalVisible(false);
				}}
				onBackButtonPress={() => {
					setFormError("");
					setModalVisible(false);
				}}
				backdropOpacity={0.65}
				backdropColor="#000000"
				animationIn="slideInUp"
				animationOut="slideOutDown"
				animationInTiming={300}
				animationOutTiming={250}
				backdropTransitionInTiming={300}
				backdropTransitionOutTiming={1}
				useNativeDriver={true}
				hideModalContentWhileAnimating={true}
				avoidKeyboard={Platform.OS === "ios"}
				style={{ margin: 0, justifyContent: "flex-end" }}
			>
				<View className="bg-surface rounded-t-3xl p-5 pb-8 border-t border-border shadow-2xl">
					{/* Modal Header */}
					<View className="flex-row justify-between items-center mb-4">
						<View>
							<Text className="text-base font-bold text-foreground">
								Catat Blocker / Kendala Baru
							</Text>
							<Text className="text-xs text-muted mt-0.5">
								Dokumentasikan hambatan yang menghambat progres proyek
							</Text>
						</View>
						<TouchableOpacity
							onPress={() => {
								setFormError("");
								setModalVisible(false);
							}}
							className="p-1 rounded-full bg-surface-subtle border border-border"
						>
							<Ionicons name="close" size={18} color="#18181b" />
						</TouchableOpacity>
					</View>

					{/* Form Fields */}
					<ScrollView showsVerticalScrollIndicator={false}>
						<FormField
							label="Judul Kendala"
							placeholder="Contoh: API Rate Limit Exceeded"
							labelIconName="alert-circle-outline"
							value={title}
							onChangeText={(val) => {
								setTitle(val);
								if (val.trim()) setFormError("");
							}}
							error={formError}
						/>

						<FormField
							label="Deskripsi / Penyebab (Opsional)"
							placeholder="Jelaskan detail kendala teknis atau kebutuhan bantuan..."
							labelIconName="document-text-outline"
							multiline
							numberOfLines={3}
							value={description}
							onChangeText={setDescription}
						/>

						{/* Action Buttons */}
						<View className="mt-2 gap-2">
							<Button
								label="Simpan Blocker"
								variant="primary"
								onPress={handleCreateBlocker}
							/>
							<Button
								label="Batal"
								variant="secondary"
								onPress={() => {
									setFormError("");
									setModalVisible(false);
								}}
							/>
						</View>
					</ScrollView>
				</View>
			</Modal>
		</View>
	);
}
