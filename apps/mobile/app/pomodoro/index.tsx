import { Button } from "@/components/Button";
import PomodoroTimer from "@/features/pomodoro/components/PomodoroTimer";
import ProjectSelector from "@/features/task/components/ProjectSelector";
import { useGetTaskById } from "@/features/task/hooks/useTask";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Pomodoro() {
  const [selectedProject, setSelectedProject] = useState<
    string | number | null
  >(null);
  const handleProjectChange = (value: string | number) =>
    setSelectedProject(value);

  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const taskQuery = useGetTaskById({
    id: id as string,
    queryConfig: {
      enabled: !!id,
    },
  });
  return (
    <View className="flex-1">
      <ScrollView className="bg-background p-2">
        {/* Active Task Info */}
        {/* <ProjectSelector
					pomodoro={true}
					value={selectedProject}
					onChange={handleProjectChange}
				/> */}
        <View className="bg-white p-4 rounded-2xl flex-row items-center mb-8 border border-border">
          <View className="w-10 h-10 rounded-xl bg-indigo-500/10 items-center justify-center mr-3">
            <Ionicons name="code-slash-outline" size={20} color="#6366f1" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-400 text-xs">Tugas Aktif</Text>
            <Text className="text-slate-800 text-sm font-medium">
              {taskQuery.data?.title || "Implementasi Autentikasi Supabase"}
            </Text>
          </View>
          <View className="bg-yellow-100 px-2 py-1 rounded-full">
            <Text className="text-yellow-700 text-[10px]">25 menit</Text>
          </View>
        </View>

        <PomodoroTimer />
      </ScrollView>
      <View className="px-4 pt-3 bg-white border-t border-slate-100">
        <Button
          iconLeft={
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
          }
          label="Mark as Complete"
          variant="primary"
          onPress={() => {
            console.log("Marked as complete");
          }}
        />
      </View>
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className=" bg-white "
      />
    </View>
  );
}
