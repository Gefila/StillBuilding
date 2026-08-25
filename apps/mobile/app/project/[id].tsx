import React, { useState } from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetProjectById } from "@/features/project/hooks/useProject";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/Button";
import ProjectHeader from "@/features/project/components/ProjectHeader";
import ProjectTabs from "@/features/project/components/ProjectTabs";
import ProjectTabsContent from "@/features/project/components/ProjectTabsContent";
import { Ionicons } from "@expo/vector-icons";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("tasks");

  const { data: projectData, isLoading } = useGetProjectById({
    id: id as string,
    queryConfig: {
      enabled: !!id,
      staleTime: 3000,
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#18181b" />
        <Text className="text-xs text-muted font-medium mt-2">
          Memuat detail proyek...
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header with back and edit action */}
        <ScreenHeader
          title={projectData?.name || "Detail Proyek"}
          subtitle="Kelola tugas dan catatan proyek"
          showBackButton={true}
          rightAction={
            <Button
              label="Edit"
              size="sm"
              variant="outline"
              iconLeft={
                <Ionicons name="pencil-outline" size={14} color="#18181b" />
              }
              onPress={() => router.push(`/project/edit?id=${id}`)}
            />
          }
        />

        {/* 2. Content */}
        <View className="flex-col gap-3 my-2">
          {projectData && <ProjectHeader project={projectData} />}
          <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {projectData && (
            <ProjectTabsContent activeTab={activeTab} project={projectData} />
          )}
        </View>

        <View style={{ height: Math.max(insets.bottom + 24, 40) }} />
      </ScrollView>
    </View>
  );
}
