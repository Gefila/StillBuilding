import React, { useState, useMemo } from "react";
import { View } from "react-native";
import ProjectItem from "./ProjectItem";
import ProjectSearchBar from "./ProjectSearchBar";
import ProjectFilters, { FilterStatus, FilterCategory } from "./ProjectFilters";
import ProjectEmptyState from "./ProjectEmptyState";
import { Project } from "@/features/project/types/project.types";
import { PROJECT_CATEGORIES } from "../constants/projectCategories";

interface ListProjectProps {
  projects?: Project[];
}

export default function ListProject({ projects = [] }: ListProjectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("ALL");
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("ALL");

  const counts = useMemo(() => {
    return {
      all: projects.length,
      active: projects.filter((p) => (p.status || "Active") === "Active")
        .length,
      onHold: projects.filter((p) => p.status === "On Hold").length,
      completed: projects.filter((p) => p.status === "Completed").length,
    };
  }, [projects]);

  const categoryCounts = useMemo(() => {
    const acc: Record<string, number> = { ALL: projects.length };
    for (const cat of PROJECT_CATEGORIES) {
      acc[cat.key] = projects.filter(
        (p) => (p.category || "coding") === cat.key,
      ).length;
    }
    return acc;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const currentStatus = project.status || "Active";
      const matchesStatus =
        selectedStatus === "ALL" || currentStatus === selectedStatus;

      const currentCategory = project.category || "coding";
      const matchesCategory =
        selectedCategory === "ALL" || currentCategory === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        project.name.toLowerCase().includes(q) ||
        (project.description && project.description.toLowerCase().includes(q));

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [projects, selectedStatus, selectedCategory, searchQuery]);

  const isFiltering =
    searchQuery.trim() !== "" ||
    selectedStatus !== "ALL" ||
    selectedCategory !== "ALL";

  const handleResetFilter = () => {
    setSearchQuery("");
    setSelectedStatus("ALL");
    setSelectedCategory("ALL");
  };

  return (
    <View className="mt-1">
      {/* Search Bar & Counter Header */}
      <ProjectSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredCount={filteredProjects.length}
        totalCount={projects.length}
        isFiltering={isFiltering}
      />

      {/* Filter Row: Compact Status & Category Dropdowns */}
      <ProjectFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        statusCounts={counts}
        categoryCounts={categoryCounts}
        isFiltering={isFiltering}
        onResetFilter={handleResetFilter}
      />

      {/* Projects List or Empty State */}
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))
      ) : projects.length === 0 ? (
        <ProjectEmptyState type="no_projects" />
      ) : (
        <ProjectEmptyState
          type="no_results"
          onResetFilter={handleResetFilter}
        />
      )}
    </View>
  );
}
