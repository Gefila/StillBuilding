import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetTasks } from "@/features/task/hooks/useTask";
import HomeHeader from "@/components/home/HomeHeader";
import DailySummaryCards from "@/components/home/DailySummaryCards";
import QuickFocusBanner from "@/components/home/QuickFocusBanner";
import Tasks from "@/components/tasks/Tasks";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export default function Home() {
  const isFocused = useIsFocused();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((state) => state.user);

  const {
    data: tasks,
    isLoading,
    refetch,
  } = useGetTasks({
    queryConfig: {
      subscribed: isFocused,
    },
  });
  const taskList = Array.isArray(tasks) ? tasks : [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const completedCount = taskList.filter((t) => t.status === "Done").length;
  const activeTask = taskList.find((t) => t.status === "Active");
  const userName =
    user?.name || user?.full_name || user?.username || "Pengguna";

  return (
    <View
      className="flex-1 bg-background relative"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#18181b"
            colors={["#18181b"]}
          />
        }
      >
        {/* 1. Header Greeting & User Info */}
        <HomeHeader userName={userName} />

        {/* 2. Daily Productivity Summary Cards */}
        <DailySummaryCards
          totalTasks={taskList.length}
          completedTasks={completedCount}
          focusMinutes={50}
        />

        {/* 3. Quick Focus / Active Pomodoro Banner */}
        <QuickFocusBanner activeTaskTitle={activeTask?.title} />

        {/* 4. Filterable Tasks List */}
        {isLoading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="large" color="#18181b" />
            <Text className="text-xs text-muted font-medium mt-2">
              Memuat daftar tugas...
            </Text>
          </View>
        ) : (
          <Tasks tasks={taskList} title="Tugas Hari Ini" />
        )}

        {/* Spacing for FAB and Bottom Insets */}
        <View style={{ height: Math.max(insets.bottom + 80, 96) }} />
      </ScrollView>

      {/* 5. Floating Action Button (FAB) for Create Task */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/task/create")}
        style={{
          position: "absolute",
          bottom: Math.max(insets.bottom + 16, 24),
          right: 20,
          elevation: 4,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
        }}
        className="w-13 h-13 bg-primary rounded-full items-center justify-center border border-primary"
      >
        <Ionicons name="add" size={26} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}
