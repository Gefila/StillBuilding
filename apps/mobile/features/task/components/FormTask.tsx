import React from "react";
import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "../types/task.types";
import { FormField } from "@/components/FormField";
import { ScreenHeader } from "@/components/ScreenHeader";
import { PrioritySelector } from "./PrioritySelector";
import { StatusSelector } from "./StatusSelector";
import { ProjectSelector } from "./ProjectSelector";
import { useCreateTask, useDeleteTask, useUpdateTask } from "../hooks/useTask";
import { Button } from "@/components/Button";

export default function FormTask({
	isEdit = false,
	initialData,
}: {
	isEdit?: boolean;
	initialData?: any;
}) {
	const { projectId } = useLocalSearchParams();
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const createTaskMutation = useCreateTask();
	const updateTaskMutation = useUpdateTask();
	const deleteTaskMutation = useDeleteTask();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(createTaskSchema),
		mode: "onChange",
		values: {
			title: initialData?.title || "",
			note: initialData?.note || initialData?.notes || "",
			priority: initialData?.priority || "Medium",
			status: initialData?.status || "Pending",
			project_id: (projectId as string) || initialData?.project_id || "",
		},
		resetOptions: {
			keepDirtyValues: true,
		},
	});

	function onSubmit(data: any) {
		if (isEdit) {
			updateTaskMutation.mutate(
				{ id: initialData?.id, data },
				{
					onSuccess: () => {
						router.back();
					},
				},
			);
		} else {
			createTaskMutation.mutate(data, {
				onSuccess: () => {
					reset();
					router.back();
				},
			});
		}
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
			className="flex-1 bg-background"
			style={{ paddingTop: Math.max(insets.top, 12) }}
		>
			<ScrollView
				className="flex-1"
				contentContainerStyle={{
					paddingHorizontal: 16,
					paddingTop: 8,
					paddingBottom: insets.bottom + 32,
				}}
				automaticallyAdjustKeyboardInsets={true}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				{/* 1. Header with Back Button */}
				<ScreenHeader
					title={isEdit ? "Edit Tugas" : "Buat Tugas Baru"}
					subtitle={
						isEdit
							? "Perbarui rincian dan target tugas"
							: "Tentukan sasaran fokus dan prioritas kerja Anda"
					}
					showBackButton={true}
				/>

				{/* 2. Project Selector */}
				<Controller
					control={control}
					name="project_id"
					render={({
						field: { onChange, onBlur, value },
						fieldState: { error },
					}) => (
						<ProjectSelector
							value={value || ""}
							onBlur={onBlur}
							onChange={(item) => onChange(item)}
							error={error?.message}
						/>
					)}
				/>

				{/* 3. Title */}
				<Controller
					control={control}
					name="title"
					render={({ field: { onChange, onBlur, value } }) => (
						<FormField
							label="Judul Tugas"
							placeholder="Contoh: Implementasi Otentikasi Supabase"
							labelIconName="checkbox-outline"
							value={value || ""}
							onChangeText={onChange}
							onBlur={onBlur}
							error={errors.title?.message}
						/>
					)}
				/>

				{/* 4. Notes / Description */}
				<Controller
					control={control}
					name="note"
					render={({ field: { onChange, onBlur, value } }) => (
						<FormField
							label="Catatan / Detail (Opsional)"
							placeholder="Tambahkan langkah teknis atau konteks tugas..."
							labelIconName="document-text-outline"
							multiline
							numberOfLines={3}
							value={value || ""}
							onChangeText={onChange}
							onBlur={onBlur}
							error={errors.note?.message}
						/>
					)}
				/>

				{/* 5. Priority */}
				<Controller
					control={control}
					name="priority"
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<PrioritySelector
							value={value || "Medium"}
							onChange={onChange}
							error={error?.message}
						/>
					)}
				/>

				{/* 6. Status */}
				<Controller
					control={control}
					name="status"
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<StatusSelector
							value={value || "Pending"}
							onChange={onChange}
							error={error?.message}
						/>
					)}
				/>

				{/* 7. Action Buttons */}
				<View className="mt-2 mb-8 gap-2.5">
					<Button
						label={isEdit ? "Simpan Perubahan" : "Buat Tugas"}
						iconLeft={
							isEdit ? (
								<Ionicons name="checkmark-outline" size={18} color="#fff" />
							) : (
								<Ionicons name="add" size={18} color="#fff" />
							)
						}
						variant="primary"
						onPress={handleSubmit(onSubmit)}
						isLoading={
							createTaskMutation.isPending || updateTaskMutation.isPending
						}
					/>

					{isEdit && (
						<Button
							label="Hapus Tugas"
							iconLeft={
								<Ionicons name="trash-outline" size={18} color="#fff" />
							}
							variant="danger"
							onPress={() => {
								if (isEdit && initialData?.id) {
									Alert.alert(
										"Hapus Tugas",
										"Apakah Anda yakin ingin menghapus tugas ini?",
										[
											{ text: "Batal", style: "cancel" },
											{
												text: "Hapus",
												style: "destructive",
												onPress: () => {
													deleteTaskMutation.mutate(initialData.id, {
														onSuccess: () => router.back(),
													});
												},
											},
										],
									);
								}
							}}
							isLoading={deleteTaskMutation.isPending}
						/>
					)}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
