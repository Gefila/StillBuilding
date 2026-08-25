import React, { useState, useMemo } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProjectItem from "./ProjectItem";
import { Project, ProjectStatus } from "@/features/project/types/project.types";

interface ListProjectProps {
  projects?: Project[];
}

type FilterStatus = "ALL" | ProjectStatus;

export default function ListProject({ projects = [] }: ListProjectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("ALL");

  const counts = useMemo(() => {
    return {
      all: projects.length,
      active: projects.filter((p) => (p.status || "Active") === "Active")
        .length,
      onHold: projects.filter((p) => p.status === "On Hold").length,
      completed: projects.filter((p) => p.status === "Completed").length,
    };
  }, [projects]);

  const filterOptions: { key: FilterStatus; label: string; count: number }[] = [
    { key: "ALL", label: "Semua", count: counts.all },
    { key: "Active", label: "Aktif", count: counts.active },
    { key: "On Hold", label: "On Hold", count: counts.onHold },
    { key: "Completed", label: "Selesai", count: counts.completed },
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const currentStatus = project.status || "Active";
      const matchesStatus =
        selectedStatus === "ALL" || currentStatus === selectedStatus;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        project.name.toLowerCase().includes(q) ||
        (project.description && project.description.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [projects, selectedStatus, searchQuery]);

  const isFiltering = searchQuery.trim() !== "" || selectedStatus !== "ALL";

  const handleResetFilter = () => {
    setSearchQuery("");
    setSelectedStatus("ALL");
  };

  return (
    <View className="mt-1">
      {/* Search Bar & Section Header */}
      <View className="flex-row justify-between items-center mb-2.5">
        <Text className="text-base font-bold text-foreground tracking-tight">
          Daftar Proyek
        </Text>
        <View className="bg-surface-subtle px-2 py-0.5 rounded-full border border-border">
          <Text className="text-[11px] font-bold text-foreground">
            {filteredProjects.length}
            {isFiltering && ` dari ${projects.length}`}
          </Text>
        </View>
      </View>

      {/* Search Input Box */}
      <View className="flex-row items-center bg-surface border border-border rounded-xl px-3 py-2 mb-2.5 shadow-2xs">
        <Ionicons name="search-outline" size={16} color="#71717a" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Cari nama atau deskripsi proyek..."
          placeholderTextColor="#a1a1aa"
          className="flex-1 ml-2 text-xs text-foreground p-0"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={16} color="#a1a1aa" />
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3"
        contentContainerStyle={{ gap: 6 }}
      >
        {filterOptions.map((opt) => {
          const isActive = selectedStatus === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              activeOpacity={0.7}
              onPress={() => setSelectedStatus(opt.key)}
              className={`flex-row items-center px-3 py-1.5 rounded-full border ${
                isActive
                  ? "bg-foreground border-foreground"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isActive ? "text-background" : "text-muted"
                }`}
              >
                {opt.label}
              </Text>
              <View
                className={`ml-1.5 px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-background/20" : "bg-surface-subtle"
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    isActive ? "text-background" : "text-muted"
                  }`}
                >
                  {opt.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Projects List or Empty State */}
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))
      ) : projects.length === 0 ? (
        <View className="bg-surface p-8 rounded-2xl border border-dashed border-border items-center justify-center my-2">
          <View className="w-12 h-12 rounded-full bg-surface-subtle border border-border items-center justify-center mb-3">
            <Ionicons name="folder-open-outline" size={24} color="#71717a" />
          </View>
          <Text className="text-sm font-semibold text-foreground text-center">
            Belum ada proyek
          </Text>
          <Text className="text-xs text-muted text-center mt-1">
            Buat proyek baru untuk mengelompokkan tugas-tugas Anda.
          </Text>
        </View>
      ) : (
        <View className="bg-surface p-6 rounded-2xl border border-border items-center justify-center my-2">
          <View className="w-10 h-10 rounded-full bg-surface-subtle border border-border items-center justify-center mb-2.5">
            <Ionicons name="search-outline" size={20} color="#71717a" />
          </View>
          <Text className="text-sm font-semibold text-foreground text-center">
            Proyek tidak ditemukan
          </Text>
          <Text className="text-xs text-muted text-center mt-1 mb-3">
            Tidak ada proyek yang sesuai dengan pencarian atau filter yang
            dipilih.
          </Text>
          <TouchableOpacity
            onPress={handleResetFilter}
            className="px-3.5 py-1.5 bg-surface-subtle border border-border rounded-xl"
          >
            <Text className="text-xs font-semibold text-foreground">
              Reset Filter
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
