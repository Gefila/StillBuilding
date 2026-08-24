import React from 'react';
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    subValue: string;
    iconColor: string;
    bgColor?: string;
}

// Sub-komponen agar lebih mudah diatur
const StatCard = ({ icon, label, value, subValue, iconColor }: StatCardProps) => (
    <View className="flex-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm shadow-slate-200">
        <View className="flex-row items-center justify-between mb-3">
            <View 
                className="p-2 rounded-xl" 
                style={{ backgroundColor: `${iconColor}15` }} // Transparansi 15%
            >
                <Ionicons name={icon} size={18} color={iconColor} />
            </View>
            <Ionicons name="trending-up-outline" size={14} color="#cbd5e1" />
        </View>
        
        <View>
            <Text className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                {label}
            </Text>
            <Text className="text-xl font-bold text-slate-800 my-0.5">
                {value}
            </Text>
            <View className="flex-row items-center">
                <Text className="text-[10px] text-slate-400 font-medium">
                    {subValue}
                </Text>
            </View>
        </View>
    </View>
);

export default function StatsGrid() {
    return (
        <View className="flex-row bg-transparent gap-3 ">
            <StatCard 
                icon="time" 
                label="Est. Duration" 
                value="25 min" 
                subValue="Max 30 min limit"
                iconColor="#3b82f6" // Biru
            />
            
            <StatCard 
                icon="flash" 
                label="Time Spent" 
                value="50 min" 
                subValue="2 active sessions"
                iconColor="#10b981" // Hijau
            />
        </View>
    );
}