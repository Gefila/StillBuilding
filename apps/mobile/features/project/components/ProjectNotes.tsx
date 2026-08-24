import React, { useState, useMemo } from "react";
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

interface NoteItem {
	id: string;
	title: string;
	content: string;
	tags: string[];
	createdAt: string;
}

const INITIAL_NOTES: NoteItem[] = [
	{
		id: "1",
		title: "Tech Stack & Arsitektur Database",
		content:
			"Memutuskan menggunakan Supabase PostgreSQL untuk backend karena kemudahan integrasi dengan React Native dan sistem autentikasi JWT yang stabil.",
		tags: ["tech-stack", "database"],
		createdAt: "2 hari yang lalu",
	},
	{
		id: "2",
		title: "Standarisasi Respon API & Error Handling",
		content:
			"Format payload respon RESTful distandarkan menggunakan wrapper Zod schema di setiap module controller backend.",
		tags: ["api", "backend"],
		createdAt: "5 hari yang lalu",
	},
	{
		id: "3",
		title: "Catatan Rapat Kickoff & Milestone",
		content:
			"Sprint 1 fokus pada penyelesaian modul Task, Pomodoro Timer, dan Blocker Logger sebelum integrasi analitik mingguan.",
		tags: ["meeting", "milestone"],
		createdAt: "1 minggu yang lalu",
	},
];

const PRESET_TAGS = ["tech-stack", "database", "api", "backend", "meeting", "ide", "arsitektur"];

export default function ProjectNotes() {
	const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
	const [activeTag, setActiveTag] = useState<string>("Semua");
	const [modalVisible, setModalVisible] = useState(false);

	// Form State
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>(["tech-stack"]);
	const [customTag, setCustomTag] = useState("");
	const [formError, setFormError] = useState("");

	// Get all unique tags from notes
	const allTags = useMemo(() => {
		const tagSet = new Set<string>();
		notes.forEach((note) => note.tags.forEach((t) => tagSet.add(t)));
		return ["Semua", ...Array.from(tagSet)];
	}, [notes]);

	const filteredNotes = useMemo(() => {
		if (activeTag === "Semua") return notes;
		return notes.filter((note) => note.tags.includes(activeTag));
	}, [notes, activeTag]);

	const handleToggleTag = (tag: string) => {
		if (selectedTags.includes(tag)) {
			setSelectedTags(selectedTags.filter((t) => t !== tag));
		} else {
			setSelectedTags([...selectedTags, tag]);
		}
	};

	const handleAddCustomTag = () => {
		const cleanTag = customTag.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
		if (cleanTag && !selectedTags.includes(cleanTag)) {
			setSelectedTags([...selectedTags, cleanTag]);
			setCustomTag("");
		}
	};

	const handleCreateNote = () => {
		if (!title.trim()) {
			setFormError("Judul catatan wajib diisi");
			return;
		}

		if (!content.trim()) {
			setFormError("Isi catatan tidak boleh kosong");
			return;
		}

		const newNote: NoteItem = {
			id: Date.now().toString(),
			title: title.trim(),
			content: content.trim(),
			tags: selectedTags.length > 0 ? selectedTags : ["umum"],
			createdAt: "Baru saja",
		};

		setNotes([newNote, ...notes]);
		setTitle("");
		setContent("");
		setSelectedTags(["tech-stack"]);
		setFormError("");
		setModalVisible(false);
	};

	const handleDeleteNote = (id: string) => {
		setNotes((prev) => prev.filter((n) => n.id !== id));
	};

	return (
		<View className="flex-1">
			{/* 1. Header & Add Note Button */}
			<View className="flex-row items-center justify-between mb-2.5">
				<View className="flex-row items-center gap-2">
					<Text className="text-base font-bold text-foreground tracking-tight">
						Catatan & Dokumentasi
					</Text>
					<View className="bg-surface-subtle px-2 py-0.5 rounded-full border border-border">
						<Text className="text-[11px] font-bold text-foreground">
							{filteredNotes.length}
						</Text>
					</View>
				</View>

				<TouchableOpacity
					onPress={() => setModalVisible(true)}
					activeOpacity={0.8}
					className="flex-row items-center bg-surface px-2.5 py-1 rounded-lg border border-border"
				>
					<Ionicons name="add" size={14} color="#18181b" />
					<Text className="text-xs font-semibold text-foreground ml-1">Tambah Catatan</Text>
				</TouchableOpacity>
			</View>

			{/* 2. Tag Filter Chips */}
			{allTags.length > 1 && (
				<View className="mb-3">
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ gap: 6, paddingHorizontal: 1 }}
					>
						{allTags.map((tag) => {
							const isActive = activeTag === tag;
							return (
								<TouchableOpacity
									key={tag}
									onPress={() => setActiveTag(tag)}
									activeOpacity={0.8}
									className={`will-change-variable px-3 py-1.5 rounded-xl border ${
										isActive
											? "bg-primary border-primary"
											: "bg-surface-subtle border-border"
									}`}
								>
									<Text
										className={`will-change-variable text-xs font-semibold ${
											isActive ? "text-primary-foreground" : "text-muted"
										}`}
									>
										{tag === "Semua" ? "Semua" : `#${tag}`}
									</Text>
								</TouchableOpacity>
							);
						})}
					</ScrollView>
				</View>
			)}

			{/* 3. Notes List */}
			{filteredNotes.length > 0 ? (
				<View className="gap-2.5">
					{filteredNotes.map((note) => (
						<View
							key={note.id}
							className="bg-surface rounded-2xl p-3.5 border border-border shadow-xs"
						>
							{/* Note Header */}
							<View className="flex-row justify-between items-start gap-2 mb-1.5">
								<Text
									className="font-bold text-sm text-foreground flex-1"
									numberOfLines={1}
								>
									{note.title}
								</Text>
								<TouchableOpacity
									onPress={() => handleDeleteNote(note.id)}
									activeOpacity={0.7}
									className="p-1"
								>
									<Ionicons name="trash-outline" size={14} color="#a1a1aa" />
								</TouchableOpacity>
							</View>

							{/* Note Content */}
							<Text className="text-xs text-muted leading-relaxed mb-3">
								{note.content}
							</Text>

							{/* Footer: Tags & Date */}
							<View className="flex-row items-center justify-between pt-2 border-t border-divider">
								<View className="flex-row flex-wrap gap-1 flex-1 mr-2">
									{note.tags.map((tag) => (
										<View
											key={tag}
											className="bg-surface-subtle border border-border px-2 py-0.5 rounded-md"
										>
											<Text className="text-[10px] font-semibold text-foreground">
												#{tag}
											</Text>
										</View>
									))}
								</View>
								<Text className="text-[11px] text-muted">{note.createdAt}</Text>
							</View>
						</View>
					))}
				</View>
			) : (
				<View className="bg-surface p-6 rounded-2xl border border-dashed border-border items-center justify-center my-2">
					<View className="w-11 h-11 rounded-full bg-surface-subtle border border-border items-center justify-center mb-2.5">
						<Ionicons name="document-text-outline" size={20} color="#18181b" />
					</View>
					<Text className="text-sm font-semibold text-foreground text-center">
						Belum ada catatan
					</Text>
					<Text className="text-xs text-muted text-center mt-0.5 px-2">
						{activeTag === "Semua"
							? "Dokumentasikan arsitektur, keputusan teknis, atau catatan rapat proyek."
							: `Tidak ada catatan dengan tag #${activeTag}`}
					</Text>
					<TouchableOpacity
						onPress={() => setModalVisible(true)}
						className="mt-3 px-3.5 py-1.5 bg-primary rounded-xl flex-row items-center active:opacity-80"
					>
						<Ionicons name="add" size={15} color="#ffffff" />
						<Text className="text-xs font-semibold text-primary-foreground ml-1">
							Buat Catatan Baru
						</Text>
					</TouchableOpacity>
				</View>
			)}

			{/* 4. Create Note Modal Bottom Sheet */}
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
				<View className="bg-surface rounded-t-3xl p-5 pb-8 border-t border-border shadow-2xl max-h-[85%]">
					{/* Modal Header */}
					<View className="flex-row justify-between items-center mb-4">
						<View>
							<Text className="text-base font-bold text-foreground">
								Tambah Catatan Proyek
							</Text>
							<Text className="text-xs text-muted mt-0.5">
								Dokumentasi teknis, konteks ide, atau ringkasan diskusi
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

					{/* Form Content */}
					<ScrollView showsVerticalScrollIndicator={false}>
						<FormField
							label="Judul Catatan"
							placeholder="Contoh: Keputusan Arsitektur Autentikasi"
							labelIconName="bookmark-outline"
							value={title}
							onChangeText={(val) => {
								setTitle(val);
								if (val.trim()) setFormError("");
							}}
							error={formError}
						/>

						<FormField
							label="Isi Catatan / Dokumentasi"
							placeholder="Tuliskan detail catatan, referensi kode, atau instruksi..."
							labelIconName="document-text-outline"
							multiline
							numberOfLines={4}
							value={content}
							onChangeText={setContent}
						/>

						{/* Tag Selector */}
						<View className="mb-4">
							<Text className="text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">
								Pilih Tag / Topik
							</Text>
							<View className="flex-row flex-wrap gap-1.5 mb-2">
								{PRESET_TAGS.map((tag) => {
									const isSelected = selectedTags.includes(tag);
									return (
										<TouchableOpacity
											key={tag}
											onPress={() => handleToggleTag(tag)}
											activeOpacity={0.75}
											className={`px-2.5 py-1 rounded-lg border ${
												isSelected
													? "bg-primary border-primary"
													: "bg-surface-subtle border-border"
											}`}
										>
											<Text
												className={`text-xs font-semibold ${
													isSelected ? "text-primary-foreground" : "text-foreground"
												}`}
											>
												#{tag}
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>
						</View>

						{/* Action Buttons */}
						<View className="mt-2 gap-2">
							<Button
								label="Simpan Catatan"
								variant="primary"
								onPress={handleCreateNote}
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
