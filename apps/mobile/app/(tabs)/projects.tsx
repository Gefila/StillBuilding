import React from "react";
import { ScrollView, View, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetProjects } from "@/features/project/hooks/useProject";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/Button";
import ProjectsStats from "@/features/project/components/ProjectsStats";
import ListProject from "@/features/project/components/ListProject";
import { Ionicons } from "@expo/vector-icons";

export default function Projects() {
  const isFocused = useIsFocused();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const projectsQuery = useGetProjects({
    queryConfig: {
      subscribed: isFocused,
      staleTime: 1000,
    },
  });

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Standard Screen Header */}
        <ScreenHeader
          title="Proyek"
          subtitle="Kelola proyek dan pantau pencapaian tugas"
          rightAction={
            <Button
              label="Buat Baru"
              size="sm"
              variant="primary"
              iconLeft={<Ionicons name="add" size={16} color="#ffffff" />}
              onPress={() => router.push("/project/create")}
            />
          }
        />

        {/* 2. Projects Summary Stats */}
        <View className="my-2">
          <ProjectsStats />
        </View>

        {/* 3. Projects List */}
        {projectsQuery.isLoading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="large" color="#18181b" />
            <Text className="text-xs text-muted font-medium mt-2">
              Memuat daftar proyek...
            </Text>
          </View>
        ) : (
          <ListProject projects={projectsQuery.data || []} />
        )}

        <View style={{ height: Math.max(insets.bottom + 40, 60) }} />
      </ScrollView>
    </View>
  );
}
