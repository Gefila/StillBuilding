import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NoteCardProps {
  title?: string;
  content: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ title = "Notes", content }) => {
  return (
    <View className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200">
      {/* Header Section */}
      <View className="flex-row items-center mb-3">
        <View className="bg-amber-100 p-2 rounded-lg mr-3">
          <Ionicons name="document-text" size={20} color="#d97706" />
        </View>
        <Text className="text-lg font-semibold text-slate-800 flex-1">
          {title}
        </Text>
        <TouchableOpacity hitSlop={10}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View className="border-t border-slate-50 pt-3">
        <Text className="text-slate-600 text-base leading-6 text-justify">
          {content}
        </Text>
      </View>

      {/* Footer / Date (Optional enhancement) */}
      <View className="mt-4 flex-row items-center">
        <Ionicons name="time-outline" size={14} color="#94a3b8" />
        <Text className="text-xs text-slate-400 ml-1">Updated 2 mins ago</Text>
      </View>
    </View>
  );
};

export default NoteCard;
