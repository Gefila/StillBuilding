import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useDeleteTask,
  useGetTaskById,
  useSetActiveTask,
  useUpdateTask,
} from "@/features/task/hooks/useTask";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import TaskHeaderHero from "@/features/task/components/TaskHeaderHero";
import TaskFocusStats from "@/features/task/components/TaskFocusStats";
import { usePomodoroStore } from "@/features/pomodoro/store/usePomodoroStore";

export default function TaskDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();

  const taskQuery = useGetTaskById({
    id: id as string,
    queryConfig: {
      enabled: !!id,
      staleTime: 0,
    },
  });

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const setActiveTaskMutation = useSetActiveTask();

  const task = taskQuery.data;

  if (taskQuery.isLoading || !task) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#18181b" />
        <Text className="text-xs text-muted font-medium mt-2">
          Memuat rincian tugas...
        </Text>
      </View>
    );
  }

  const handleToggleStatus = () => {
    const isDone = task.status === "Done";
    const nextStatus = isDone ? "Pending" : "Done";

    updateTaskMutation.mutate({
      id: task.id,
      data: {
        status: nextStatus,
        completed_at: nextStatus === "Done" ? new Date().toISOString() : null,
      },
    });
  };

  const handleSelectStatus = (newStatus: string) => {
    updateTaskMutation.mutate({
      id: task.id,
      data: {
        status: newStatus,
        completed_at: newStatus === "Done" ? new Date().toISOString() : null,
      },
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Hapus Tugas",
      "Apakah Anda yakin ingin menghapus tugas ini secara permanen?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            deleteTaskMutation.mutate(task.id, {
              onSuccess: () => router.back(),
            });
          },
        },
      ],
    );
  };

  const handleStartFocus = () => {
    const prevTask = usePomodoroStore.getState().activeTask;

    usePomodoroStore.getState().setActiveTask({
      id: task.id,
      title: task.title,
      project_id: task.project_id || task.project?.id,
      projectName: task.project?.name,
    });

    if (task.status !== "Active" || (prevTask && prevTask.id !== task.id)) {
      setActiveTaskMutation.mutate({
        prevTaskId: prevTask && prevTask.id !== task.id ? prevTask.id : null,
        newTaskId: task.status !== "Active" ? task.id : null,
      });
    }

    router.push("/(tabs)/focus");
  };

  const noteContent = task.note || (task as any).notes;

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      {/* Top Header with Back Button & Action Controls */}
      <View className="px-4">
        <ScreenHeader
          title="Detail Tugas"
          subtitle={
            task.project?.name
              ? `Proyek: ${task.project.name}`
              : "Tugas Personal"
          }
          showBackButton={true}
          rightAction={
            <View className="flex-row items-center gap-1.5">
              {/* Edit Button */}
              <TouchableOpacity
                onPress={() => router.push(`/task/edit?id=${task.id}`)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className="p-2 rounded-xl bg-surface border border-border items-center justify-center"
              >
                <Ionicons name="pencil-outline" size={17} color="#18181b" />
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                onPress={handleDelete}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className="p-2 rounded-xl bg-surface border border-red-200 items-center justify-center"
              >
                <Ionicons name="trash-outline" size={17} color="#dc2626" />
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      <ScrollView
        className="flex-1 px-4 pt-1"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Hero Card (Interactive Checkbox, Title, Status Selector, Metadata) */}
        <TaskHeaderHero
          task={task}
          onToggleStatus={handleToggleStatus}
          onSelectStatus={handleSelectStatus}
          isUpdating={updateTaskMutation.isPending}
        />

        {/* 2. Notes Section */}
        <Card className="mb-3">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-1.5">
              <Ionicons
                name="document-text-outline"
                size={15}
                color="#18181b"
              />
              <Text className="text-xs font-bold uppercase tracking-wider text-muted">
                Catatan & Instruksi
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push(`/task/edit?id=${task.id}`)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text className="text-xs font-semibold text-primary">
                {noteContent ? "Edit" : "Tambah"}
              </Text>
            </TouchableOpacity>
          </View>

          {noteContent ? (
            <Text className="text-xs text-foreground leading-relaxed">
              {noteContent}
            </Text>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/task/edit?id=${task.id}`)}
              className="py-3 items-center justify-center border border-dashed border-border rounded-xl bg-surface-subtle"
            >
              <Ionicons name="add-circle-outline" size={18} color="#a1a1aa" />
              <Text className="text-xs text-muted font-medium mt-1">
                Tambahkan catatan atau instruksi pengerjaan
              </Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* 3. Pomodoro Focus Stats & History */}
        <TaskFocusStats
          sessions={task.pomodoro_sessions || []}
          onStartFocus={handleStartFocus}
        />

        {/* Scroll bottom spacer */}
        <View style={{ height: Math.max(insets.bottom + 80, 100) }} />
      </ScrollView>

      {/* Sticky Bottom Action (Primary Focus Button) */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="px-4 pt-3 bg-surface border-t border-border shadow-md"
      >
        <Button
          label={
            task.status === "Active"
              ? "Lanjutkan Sesi Fokus"
              : task.status === "Done"
                ? "Mulai Fokus Ulang"
                : "Mulai Sesi Fokus Pomodoro"
          }
          iconLeft={
            <Ionicons
              name={task.status === "Active" ? "flame" : "play"}
              size={17}
              color="#ffffff"
            />
          }
          variant="primary"
          size="lg"
          onPress={handleStartFocus}
        />
      </View>
    </View>
  );
}
