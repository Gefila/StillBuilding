import React from "react";
import { Text, View } from "react-native";
import ProjectItem from "./ProjectItem";
import { Project } from "@/features/project/types/project.types";

export default function ListProject({
  projects = [],
}: {
  projects: Project[];
}) {
  return (
    <View className="mt-2">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-base font-bold text-foreground tracking-tight">
          Daftar Proyek
        </Text>
        <View className="bg-surface-subtle px-2 py-0.5 rounded-full border border-border">
          <Text className="text-[11px] font-bold text-foreground">
            {projects.length}
          </Text>
        </View>
      </View>
      {projects.length > 0 ? (
        projects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))
      ) : (
        <View className="bg-surface p-8 rounded-2xl border border-dashed border-border items-center justify-center my-2">
          <Text className="text-sm font-semibold text-foreground text-center">
            Belum ada proyek
          </Text>
          <Text className="text-xs text-muted text-center mt-1">
            Buat proyek baru untuk mengelompokkan tugas-tugas Anda.
          </Text>
        </View>
      )}
    </View>
  );
}
