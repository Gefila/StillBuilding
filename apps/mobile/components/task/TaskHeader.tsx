import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Task } from "@/features/task/types/task.types";

// 1. Tipe data dan Helper untuk Komponen Badge
type BadgeConfig = {
    bg: string;
    border: string;
    text: string;
    icon: string;
};

// Fungsi untuk mendapatkan warna berdasarkan prioritas
const getPriorityStyles = (priority?: string): BadgeConfig => {
    switch (priority?.toLowerCase()) {
        case "high": return { bg: "bg-red-50", border: "border-red-100", text: "text-red-600", icon: "#ef4444" };
        case "medium": return { bg: "bg-orange-50", border: "border-orange-100", text: "text-orange-600", icon: "#f97316" };
        case "low": return { bg: "bg-green-50", border: "border-green-100", text: "text-green-600", icon: "#22c55e" };
        default: return { bg: "bg-slate-50", border: "border-slate-100", text: "text-slate-600", icon: "#64748b" };
    }
};

// Fungsi untuk mendapatkan warna berdasarkan status
const getStatusStyles = (status?: string): BadgeConfig => {
    switch (status?.toLowerCase()) {
        case "completed": return { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600", icon: "#10b981" };
        case "in progress": return { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600", icon: "#3b82f6" };
        default: return { bg: "bg-slate-50", border: "border-slate-100", text: "text-slate-600", icon: "#64748b" };
    }
};

// 2. Sub-komponen Reusable untuk Badge
const TaskBadge = ({ iconName, label, config }: { iconName: keyof typeof Ionicons.glyphMap, label?: string, config: BadgeConfig }) => {
    if (!label) return null;
    return (
        <View className={`flex-row items-center px-2.5 py-1.5 rounded-lg border ${config.bg} ${config.border}`}>
            <Ionicons name={iconName} size={14} color={config.icon} />
            <Text className={`text-[11px] font-bold ml-1.5 uppercase tracking-tight ${config.text}`}>
                {label}
            </Text>
        </View>
    );
};

// 3. Komponen Utama TaskHeader
export default function TaskHeader({ task }: { task: Task }) {
    const router = useRouter();

    return (
        <View className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200">
            {/* Header Row: Title & Action */}
            <View className="flex-row justify-between items-start mb-3">
                <Text className="text-2xl font-extrabold text-slate-800 leading-tight flex-1 mr-3">
                    {task.title}
                </Text>
                
                {/* Tombol Edit dipindah ke atas agar lebih rapi */}
                <TouchableOpacity 
                    onPress={() => router.push(`/task/edit/${task.id}`)} // Sesuaikan dengan routing Anda
                    className="p-2 bg-slate-50 rounded-full border border-slate-100 active:bg-slate-100"
                >
                    <Ionicons name="pencil" size={18} color="#64748b" />
                </TouchableOpacity>
            </View>

            {/* Badge Row (Menggunakan Komponen Reusable) */}
            <View className="flex-row flex-wrap items-center gap-2 mb-4">
                <TaskBadge 
                    iconName="briefcase-outline" 
                    label={task.project?.name || "No Project"} 
                    config={{ bg: "bg-slate-50", border: "border-slate-100", text: "text-slate-600", icon: "#64748b" }} 
                />
                <TaskBadge 
                    iconName="time-outline" 
                    label={task.status} 
                    config={getStatusStyles(task.status)} 
                />
                <TaskBadge 
                    iconName="flag" 
                    label={task.priority} 
                    config={getPriorityStyles(task.priority)} 
                />
            </View>

            {/* Description Section */}
            <View className="pt-4 border-t border-slate-100">
                <View className="flex-row items-center mb-2">
                    <Ionicons name="document-text-outline" size={14} color="#94a3b8" />
                    <Text className="text-sm font-bold text-slate-400 uppercase tracking-[1px] ml-1.5">
                        Description
                    </Text>
                </View>
                <Text className="text-slate-600 text-base leading-6 text-justify">
                    {task.note ? task.note : "No description provided for this task."}
                </Text>
            </View>
        </View>
    );
}