import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProjectSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredCount: number;
  totalCount: number;
  isFiltering: boolean;
}

export default function ProjectSearchBar({
  searchQuery,
  onSearchChange,
  filteredCount,
  totalCount,
  isFiltering,
}: ProjectSearchBarProps) {
  return (
    <>
      {/* Search Bar & Section Header */}
      <View className="flex-row justify-between items-center mb-2.5">
        <Text className="text-base font-bold text-foreground tracking-tight">
          Daftar Proyek
        </Text>
        <View className="bg-surface-subtle px-2 py-0.5 rounded-full border border-border">
          <Text className="text-[11px] font-bold text-foreground">
            {filteredCount}
            {isFiltering && ` dari ${totalCount}`}
          </Text>
        </View>
      </View>

      {/* Search Input Box */}
      <View className="flex-row items-center bg-surface border border-border rounded-xl px-3 py-2 mb-2.5 shadow-2xs">
        <Ionicons name="search-outline" size={16} color="#71717a" />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Cari nama atau deskripsi proyek..."
          placeholderTextColor="#a1a1aa"
          className="flex-1 ml-2 text-xs text-foreground p-0"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange("")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={16} color="#a1a1aa" />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
