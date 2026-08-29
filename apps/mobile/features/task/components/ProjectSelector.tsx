import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useGetProjects } from "@/features/project/hooks/useProject";
import { Project } from "@/features/project/types/project.types";

interface ProjectSelectorProps {
  value: string | number | null;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  error?: string;
  pomodoro?: boolean;
}

export const ProjectSelector = ({
  value,
  onChange,
  onBlur,
  error,
  pomodoro = false,
}: ProjectSelectorProps) => {
  const router = useRouter();
  const projectsQuery = useGetProjects();

  const hasNoProjects =
    !projectsQuery.isLoading &&
    (!projectsQuery.data || projectsQuery.data.length === 0);

  const selectedItem = React.useMemo(() => {
    return projectsQuery.data?.find((item) => item.id === value);
  }, [projectsQuery.data, value]);

  const renderItem = (item: Project) => {
    const isSelected = item.id === value;
    return (
      <View
        className={`flex-row items-center p-3.5 ${
          isSelected ? "bg-surface-subtle" : "bg-surface"
        }`}
      >
        <View className="w-7 h-7 rounded-lg bg-surface-subtle border border-border items-center justify-center mr-3">
          <Ionicons
            name={(item.icon as any) || "folder-outline"}
            size={15}
            color="#18181b"
          />
        </View>
        <Text
          className={`text-sm flex-1 ${
            isSelected
              ? "text-foreground font-bold"
              : "text-foreground font-medium"
          }`}
        >
          {item.name}
        </Text>
        {isSelected && <Ionicons name="checkmark" size={16} color="#18181b" />}
      </View>
    );
  };

  return (
    <View className="mb-4">
      {!pomodoro && (
        <View className="flex-row items-center justify-between mb-1.5 ml-0.5">
          <View className="flex-row items-center">
            <Ionicons
              name="folder-outline"
              size={13}
              color={error ? "#dc2626" : "#71717a"}
            />
            <Text
              className={`text-xs font-semibold ml-1.5 uppercase tracking-wider ${
                error ? "text-error" : "text-muted"
              }`}
            >
              Pilih Proyek
            </Text>
          </View>
          {!hasNoProjects && !projectsQuery.isLoading && (
            <TouchableOpacity
              onPress={() => router.push("/project/create")}
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <Ionicons name="add" size={14} color="#18181b" />
              <Text className="text-xs font-semibold text-foreground ml-0.5">
                Proyek Baru
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {hasNoProjects ? (
        <View
          className={`p-3.5 rounded-xl border ${
            error ? "border-error bg-red-50/10" : "border-border bg-surface"
          } flex-row items-center justify-between`}
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-8 h-8 rounded-lg bg-surface-subtle border border-border items-center justify-center mr-2.5">
              <Ionicons name="folder-open-outline" size={16} color="#71717a" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-foreground">
                Belum ada proyek
              </Text>
              <Text className="text-[11px] text-muted mt-0.5">
                Buat proyek terlebih dahulu untuk membuat tugas.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/project/create")}
            className="bg-foreground px-3 py-2 rounded-lg flex-row items-center shadow-xs"
          >
            <Ionicons name="add" size={14} color="#ffffff" />
            <Text className="text-xs font-bold text-background ml-1">
              Buat Proyek
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Dropdown
          data={projectsQuery.data || []}
          labelField="name"
          valueField="id"
          placeholder={
            projectsQuery.isLoading
              ? "Memuat proyek..."
              : "Pilih Proyek Terkait"
          }
          placeholderStyle={{ color: "#a1a1aa", fontSize: 14 }}
          selectedTextStyle={{
            fontSize: 14,
            fontWeight: "600",
            color: "#09090b",
          }}
          value={value}
          onBlur={onBlur}
          onChange={(item) => onChange(item.id)}
          renderItem={renderItem}
          style={{
            backgroundColor: "#ffffff",
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: error ? "#dc2626" : "#e4e4e7",
            minHeight: 48,
          }}
          renderLeftIcon={() => (
            <View className="w-7 h-7 bg-surface-subtle border border-border rounded-lg items-center justify-center mr-2.5">
              <Ionicons
                name={(selectedItem?.icon as any) || "folder-outline"}
                size={15}
                color="#18181b"
              />
            </View>
          )}
          renderRightIcon={() => (
            <Ionicons name="chevron-down" size={16} color="#71717a" />
          )}
          containerStyle={{
            borderRadius: 14,
            marginTop: 4,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#e4e4e7",
            backgroundColor: "#ffffff",
          }}
        />
      )}

      {error && (
        <View className="flex-row items-center mt-1.5 ml-0.5">
          <Ionicons
            name="alert-circle"
            size={13}
            color="#dc2626"
            style={{ marginRight: 4 }}
          />
          <Text className="text-error text-xs font-medium">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default ProjectSelector;
