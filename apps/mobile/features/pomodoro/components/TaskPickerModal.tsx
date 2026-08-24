import React, { useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Modal from "@/components/Modal";
import { Ionicons } from "@expo/vector-icons";
import { useGetTasks } from "@/features/task/hooks/useTask";
import { Task } from "@/features/task/types/task.types";

interface TaskPickerModalProps {
	visible: boolean;
	onClose: () => void;
	onSelectTask: (task: Task | null) => void;
	selectedTaskId?: string | null;
}

export default function TaskPickerModal({
	visible,
	onClose,
	onSelectTask,
	selectedTaskId,
}: TaskPickerModalProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const tasksQuery = useGetTasks();

	const allTasks = tasksQuery.data || [];
	const availableTasks = allTasks.filter(
		(t) =>
			t.status !== "Done" &&
			t.title.toLowerCase().includes(searchQuery.toLowerCase().trim()),
	);

	const handleSelect = (task: Task | null) => {
		onSelectTask(task);
		onClose();
	};

	return (
		<Modal
			isVisible={visible}
			onBackdropPress={onClose}
			onBackButtonPress={onClose}
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
			style={{ margin: 0, justifyContent: "flex-end" }}
		>
			<View className="w-full bg-surface rounded-t-3xl p-5 pb-8 border-t border-border shadow-2xl max-h-[80%]">
					{/* Modal Header */}
					<View className="flex-row items-center justify-between pb-3 border-b border-divider mb-3">
						<View>
							<Text className="text-base font-bold text-foreground">
								Pilih Target Fokus
							</Text>
							<Text className="text-xs text-muted mt-0.5">
								Pilih tugas yang ingin Anda selesaikan di sesi ini
							</Text>
						</View>
						<TouchableOpacity
							onPress={onClose}
							hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
							className="p-1 rounded-full bg-surface-subtle border border-border"
						>
							<Ionicons name="close" size={18} color="#71717a" />
						</TouchableOpacity>
					</View>

					{/* Search Input */}
					<View className="flex-row items-center bg-surface-subtle border border-border rounded-xl px-3 py-2 mb-3">
						<Ionicons name="search-outline" size={16} color="#71717a" />
						<TextInput
							className="flex-1 text-xs text-foreground ml-2 p-0"
							placeholder="Cari tugas..."
							placeholderTextColor="#a1a1aa"
							value={searchQuery}
							onChangeText={setSearchQuery}
						/>
						{searchQuery ? (
							<TouchableOpacity onPress={() => setSearchQuery("")}>
								<Ionicons name="close-circle" size={16} color="#a1a1aa" />
							</TouchableOpacity>
						) : null}
					</View>

					{/* Task List */}
					{tasksQuery.isLoading ? (
						<View className="py-12 items-center justify-center">
							<ActivityIndicator size="small" color="#18181b" />
							<Text className="text-xs text-muted mt-2">Memuat daftar tugas...</Text>
						</View>
					) : (
						<ScrollView
							className="max-h-72"
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ gap: 8 }}
						>
							{/* Standalone Focus Option */}
							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() => handleSelect(null)}
								className={`p-3 rounded-2xl border flex-row items-center justify-between ${
									!selectedTaskId
										? "bg-surface-subtle border-foreground"
										: "bg-surface border-border"
								}`}
							>
								<View className="flex-row items-center gap-3">
									<View className="w-9 h-9 rounded-xl bg-surface-subtle border border-border items-center justify-center">
										<Ionicons name="flash-outline" size={17} color="#18181b" />
									</View>
									<View>
										<Text className="text-xs font-bold text-foreground">
											Sesi Fokus Mandiri (Quick Focus)
										</Text>
										<Text className="text-[10px] text-muted">
											Fokus tanpa terhubung ke tugas tertentu
										</Text>
									</View>
								</View>
								{!selectedTaskId && (
									<Ionicons name="checkmark" size={18} color="#18181b" />
								)}
							</TouchableOpacity>

							{/* Task Items */}
							{availableTasks.map((task) => {
								const isSelected = selectedTaskId === task.id;
								return (
									<TouchableOpacity
										key={task.id}
										activeOpacity={0.7}
										onPress={() => handleSelect(task)}
										className={`p-3 rounded-2xl border flex-row items-center justify-between ${
											isSelected
												? "bg-surface-subtle border-foreground"
												: "bg-surface border-border"
										}`}
									>
										<View className="flex-row items-center gap-3 flex-1 mr-2">
											<View className="w-9 h-9 rounded-xl bg-surface-subtle border border-border items-center justify-center">
												<Ionicons
													name={task.status === "Active" ? "play" : "checkbox-outline"}
													size={17}
													color={task.status === "Active" ? "#18181b" : "#71717a"}
												/>
											</View>
											<View className="flex-1">
												<Text
													className="text-xs font-bold text-foreground"
													numberOfLines={1}
												>
													{task.title}
												</Text>
												<View className="flex-row items-center gap-2 mt-0.5">
													{task.project ? (
														<Text className="text-[10px] font-semibold text-muted">
															📁 {task.project.name}
														</Text>
													) : (
														<Text className="text-[10px] text-muted">
															👤 Personal
														</Text>
													)}
													<Text className="text-[10px] text-muted">
														• Prioritas {task.priority || "Normal"}
													</Text>
												</View>
											</View>
										</View>
										{isSelected && (
											<Ionicons name="checkmark" size={18} color="#18181b" />
										)}
									</TouchableOpacity>
								);
							})}

							{availableTasks.length === 0 && (
								<View className="py-6 items-center justify-center">
									<Text className="text-xs text-muted text-center">
										{searchQuery
											? "Tidak ada tugas yang sesuai pencarian"
											: "Tidak ada tugas aktif. Semua tugas telah selesai 🎉"}
									</Text>
								</View>
							)}
						</ScrollView>
					)}
			</View>
		</Modal>
	);
}
