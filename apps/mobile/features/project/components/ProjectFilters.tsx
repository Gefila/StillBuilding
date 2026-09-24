import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import {
  ProjectCategory,
  ProjectStatus,
} from "@/features/project/types/project.types";
import {
  PROJECT_CATEGORIES,
  getCategoryConfig,
} from "../constants/projectCategories";

export type FilterStatus = "ALL" | ProjectStatus;
export type FilterCategory = "ALL" | ProjectCategory;

interface ProjectFiltersProps {
  selectedStatus: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  selectedCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
  statusCounts: {
    all: number;
    active: number;
    onHold: number;
    completed: number;
  };
  categoryCounts: Record<string, number>;
  isFiltering: boolean;
  onResetFilter: () => void;
}

export default function ProjectFilters({
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  statusCounts,
  categoryCounts,
  isFiltering,
  onResetFilter,
}: ProjectFiltersProps) {
  const filterOptions = useMemo(
    () => [
      {
        key: "ALL" as FilterStatus,
        label: "Semua",
        chipLabel: "Status: Semua",
        count: statusCounts.all,
      },
      {
        key: "Active" as FilterStatus,
        label: "Aktif",
        chipLabel: "Status: Aktif",
        count: statusCounts.active,
      },
      {
        key: "On Hold" as FilterStatus,
        label: "On Hold",
        chipLabel: "Status: On Hold",
        count: statusCounts.onHold,
      },
      {
        key: "Completed" as FilterStatus,
        label: "Selesai",
        chipLabel: "Status: Selesai",
        count: statusCounts.completed,
      },
    ],
    [statusCounts],
  );

  const categoryFilterOptions = useMemo(
    () => [
      {
        key: "ALL" as FilterCategory,
        label: "Semua",
        chipLabel: "Kategori: Semua",
        icon: "grid-outline" as keyof typeof Ionicons.glyphMap,
        color: "#71717a",
        bgColor: "#f4f4f5",
        count: categoryCounts.ALL ?? 0,
      },
      ...PROJECT_CATEGORIES.map((cat) => ({
        key: cat.key as FilterCategory,
        label: cat.label,
        chipLabel: `Kategori: ${cat.label}`,
        icon: cat.icon,
        color: cat.color,
        bgColor: cat.bgColor,
        count: categoryCounts[cat.key] || 0,
      })),
    ],
    [categoryCounts],
  );

  const isStatusActive = selectedStatus !== "ALL";
  const isCategoryActive = selectedCategory !== "ALL";
  const activeCategoryConfig = isCategoryActive
    ? getCategoryConfig(selectedCategory)
    : null;

  return (
    <View className="flex-row items-center gap-2 mb-3">
      {/* Status Dropdown Chip */}
      <Dropdown
        data={filterOptions}
        labelField="chipLabel"
        valueField="key"
        value={selectedStatus}
        onChange={(item) => onStatusChange(item.key)}
        activeColor="#f4f4f5"
        showsVerticalScrollIndicator={false}
        maxHeight={240}
        style={{
          flex: 1,
          height: 38,
          paddingHorizontal: 10,
          borderRadius: 9999,
          borderWidth: 1,
          borderColor: isStatusActive ? "#18181b" : "#e4e4e7",
          backgroundColor: isStatusActive ? "#18181b" : "#ffffff",
          flexDirection: "row",
          alignItems: "center",
        }}
        selectedTextStyle={{
          fontSize: 12,
          fontWeight: "600",
          color: isStatusActive ? "#ffffff" : "#09090b",
        }}
        selectedTextProps={{ numberOfLines: 1, ellipsizeMode: "tail" }}
        renderLeftIcon={() => (
          <Ionicons
            name="filter-outline"
            size={12}
            color={isStatusActive ? "#ffffff" : "#71717a"}
            style={{ marginRight: 5 }}
          />
        )}
        renderRightIcon={(visible) => (
          <Ionicons
            name={visible ? "chevron-up" : "chevron-down"}
            size={13}
            color={isStatusActive ? "#a1a1aa" : "#71717a"}
            style={{ marginLeft: 3 }}
          />
        )}
        containerStyle={{
          borderRadius: 14,
          marginTop: 4,
          borderWidth: 1,
          borderColor: "#e4e4e7",
          backgroundColor: "#ffffff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          overflow: "hidden",
          paddingVertical: 4,
        }}
        renderItem={(item) => {
          const isSelected = item.key === selectedStatus;
          return (
            <View
              className={`flex-row items-center justify-between px-3 py-2.5 ${
                isSelected ? "bg-surface-subtle" : "bg-surface"
              }`}
            >
              <Text
                numberOfLines={1}
                className={`text-xs ${
                  isSelected
                    ? "font-bold text-foreground"
                    : "font-medium text-foreground"
                }`}
              >
                {item.label}
              </Text>
              <View className="flex-row items-center gap-1.5 ml-2">
                <View className="bg-surface-subtle border border-border px-1.5 py-0.2 rounded-full">
                  <Text className="text-[10px] font-semibold text-muted">
                    {item.count}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color="#18181b" />
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Category Dropdown Chip */}
      <Dropdown
        data={categoryFilterOptions}
        labelField="chipLabel"
        valueField="key"
        value={selectedCategory}
        onChange={(item) => onCategoryChange(item.key)}
        activeColor="#f4f4f5"
        showsVerticalScrollIndicator={false}
        maxHeight={260}
        style={{
          flex: 1,
          height: 38,
          paddingHorizontal: 10,
          borderRadius: 9999,
          borderWidth: 1,
          borderColor: isCategoryActive
            ? (activeCategoryConfig?.color ?? "#18181b")
            : "#e4e4e7",
          backgroundColor: isCategoryActive
            ? (activeCategoryConfig?.bgColor ?? "#f4f4f5")
            : "#ffffff",
          flexDirection: "row",
          alignItems: "center",
        }}
        selectedTextStyle={{
          fontSize: 12,
          fontWeight: "600",
          color: isCategoryActive
            ? (activeCategoryConfig?.color ?? "#18181b")
            : "#09090b",
        }}
        selectedTextProps={{ numberOfLines: 1, ellipsizeMode: "tail" }}
        renderLeftIcon={() => (
          <Ionicons
            name={
              isCategoryActive && activeCategoryConfig
                ? activeCategoryConfig.icon
                : "grid-outline"
            }
            size={12}
            color={
              isCategoryActive && activeCategoryConfig
                ? activeCategoryConfig.color
                : "#71717a"
            }
            style={{ marginRight: 5 }}
          />
        )}
        renderRightIcon={(visible) => (
          <Ionicons
            name={visible ? "chevron-up" : "chevron-down"}
            size={13}
            color={
              isCategoryActive && activeCategoryConfig
                ? activeCategoryConfig.color
                : "#71717a"
            }
            style={{ marginLeft: 3 }}
          />
        )}
        containerStyle={{
          borderRadius: 14,
          marginTop: 4,
          borderWidth: 1,
          borderColor: "#e4e4e7",
          backgroundColor: "#ffffff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          overflow: "hidden",
          paddingVertical: 4,
        }}
        renderItem={(item) => {
          const isSelected = item.key === selectedCategory;
          return (
            <View
              className={`flex-row items-center justify-between px-3 py-2.5 ${
                isSelected ? "bg-surface-subtle" : "bg-surface"
              }`}
            >
              <View className="flex-row items-center flex-1 mr-2">
                <View
                  style={{ backgroundColor: item.bgColor }}
                  className="w-5 h-5 rounded-md items-center justify-center mr-2 border border-black/5"
                >
                  <Ionicons name={item.icon} size={11} color={item.color} />
                </View>
                <Text
                  numberOfLines={1}
                  className={`text-xs ${
                    isSelected
                      ? "font-bold text-foreground"
                      : "font-medium text-foreground"
                  }`}
                >
                  {item.label}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5 ml-1">
                <View className="bg-surface-subtle border border-border px-1.5 py-0.2 rounded-full">
                  <Text className="text-[10px] font-semibold text-muted">
                    {item.count}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color="#18181b" />
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Quick Reset Button */}
      {isFiltering && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onResetFilter}
          className="h-[38px] px-2.5 rounded-full bg-surface-subtle border border-border items-center justify-center flex-row"
        >
          <Ionicons name="close" size={13} color="#71717a" />
          <Text className="text-[11px] font-semibold text-muted ml-0.5">
            Reset
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
