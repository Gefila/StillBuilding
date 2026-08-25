import React from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { useGetProjects } from "@/features/project/hooks/useProject";
import { Project } from "@/features/project/types/project.types";

interface TaskSelectorProps {
  value: string | number | null;
  onChange: (value: string | number) => void;
  onBlur: () => void;
  error?: string;
  pomodoro?: boolean;
}

const TaskSelector = ({
  value,
  onChange,
  onBlur,
  error,
  pomodoro = false,
}: TaskSelectorProps) => {
  const projectsQuery = useGetProjects({
    queryConfig: {
      staleTime: 1000 * 60,
    },
  });

  const selectedItem = React.useMemo(() => {
    return projectsQuery.data?.find((item) => item.id === value);
  }, [projectsQuery.data, value]);

  const renderItem = (item: Project) => (
    <View className="flex-row items-center p-4">
      <Ionicons
        name={(item.icon as keyof typeof Ionicons.glyphMap) || "folder"}
        size={18}
        color="#6366f1"
      />
      <Text className="text-base font-medium text-slate-700 ml-3">
        {item.name}
      </Text>
    </View>
  );

  if (projectsQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading projects...</Text>
      </View>
    );
  }

  return (
    <View className="mb-5">
      {!pomodoro && (
        <View className="flex-row items-center mb-2 ml-1">
          <Ionicons name="folder-outline" size={14} color="#94a3b8" />
          <Text className="text-xs font-bold text-slate-400 ml-1.5 uppercase tracking-widest">
            Project
          </Text>
        </View>
      )}

      <Dropdown
        data={projectsQuery.data || []}
        labelField="name"
        valueField="id"
        placeholder="Select Project"
        placeholderStyle={{ color: "#64748b", fontSize: 16 }}
        selectedTextStyle={{
          fontSize: 16,
          fontWeight: "600",
          color: "#1e293b",
        }}
        value={value}
        onBlur={onBlur}
        onChange={(item) => onChange(item.value)}
        renderItem={renderItem}
        style={{
          backgroundColor: "white",
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: error ? "#ef4444" : "#e2e8f0",
        }}
        renderLeftIcon={() => (
          <View className="w-8 h-8 bg-indigo-50 rounded-xl items-center justify-center mr-3">
            <Ionicons
              name={
                (selectedItem?.icon as keyof typeof Ionicons.glyphMap) ||
                "briefcase"
              }
              size={16}
              color="#6366f1"
            />
          </View>
        )}
        renderRightIcon={() => (
          <Ionicons name="chevron-down" size={18} color="#cbd5e1" />
        )}
        containerStyle={{ borderRadius: 16, marginTop: 5, overflow: "hidden" }}
      />
      {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
};

export default TaskSelector;
