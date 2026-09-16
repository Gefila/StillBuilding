import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TaskItem } from "./TaskItem";
import type { Task } from "@/features/task/types/task.types";

type FilterType = "all" | "pending" | "done";

function TasksComponent({
  tasks = [],
  title = "Daftar Tugas",
  projectName,
  projectId,
  showProject = !projectId,
}: {
  tasks: Task[];
  title?: string;
  projectName?: string;
  projectId?: string;
  showProject?: boolean;
}) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const { pendingCount, doneCount, filteredTasks } = useMemo(() => {
    let pending = 0;
    let done = 0;
    const filtered: Task[] = [];

    for (const task of tasks) {
      if (task.status === "Done") {
        done++;
        if (activeFilter === "all" || activeFilter === "done") {
          filtered.push(task);
        }
      } else {
        pending++;
        if (activeFilter === "all" || activeFilter === "pending") {
          filtered.push(task);
        }
      }
    }

    return {
      pendingCount: pending,
      doneCount: done,
      filteredTasks: filtered,
    };
  }, [tasks, activeFilter]);

  const filters: { key: FilterType; label: string; count: number }[] = useMemo(
    () => [
      { key: "all", label: "Semua", count: tasks.length },
      { key: "pending", label: "Aktif", count: pendingCount },
      { key: "done", label: "Selesai", count: doneCount },
    ],
    [tasks.length, pendingCount, doneCount],
  );

  const handleCreateTask = () => {
    if (projectId) {
      router.navigate(`/task/create?projectId=${projectId}`);
    } else {
      router.navigate("/task/create");
    }
  };

  return (
    <View>
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-bold text-foreground tracking-tight">
            {title}
          </Text>
          <View className="bg-surface-subtle px-2 py-0.5 rounded-full border border-border">
            <Text className="text-[11px] font-bold text-foreground">
              {filteredTasks.length}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleCreateTask}
          className="flex-row items-center bg-surface px-2.5 py-1 rounded-lg border border-border active:opacity-75"
        >
          <Ionicons name="add" size={14} color="#18181b" />
          <Text className="text-xs font-semibold text-foreground ml-1">
            Tambah
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Segmented Control */}
      <View className="flex-row bg-surface-subtle p-1 rounded-xl mb-3 border border-border">
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setActiveFilter(f.key)}
              className={`will-change-variable flex-1 flex-row items-center justify-center py-1.5 rounded-lg border ${
                isActive
                  ? "bg-surface shadow-xs border-border/80"
                  : "bg-transparent border-transparent"
              }`}
            >
              <Text
                className={`will-change-variable text-xs font-semibold ${
                  isActive ? "text-foreground font-bold" : "text-muted"
                }`}
              >
                {f.label}
              </Text>
              <Text
                className={`text-[10px] ml-1.5 px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-surface-subtle text-foreground font-bold border border-border"
                    : "bg-surface/50 text-muted"
                }`}
              >
                {f.count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Task Items List / Empty State */}
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            projectName={projectName}
            showProject={showProject}
          />
        ))
      ) : (
        <View className="bg-surface p-6 rounded-2xl border border-dashed border-border items-center justify-center my-2">
          <View className="w-11 h-11 rounded-full bg-surface-subtle border border-border items-center justify-center mb-2.5">
            <Ionicons
              name={
                activeFilter === "done" ? "checkmark-done" : "checkbox-outline"
              }
              size={20}
              color="#18181b"
            />
          </View>
          <Text className="text-sm font-semibold text-foreground text-center">
            {activeFilter === "done"
              ? "Belum ada tugas yang diselesaikan"
              : "Belum ada tugas dalam proyek ini"}
          </Text>
          <Text className="text-xs text-muted text-center mt-0.5 px-2">
            {activeFilter === "done"
              ? "Tugas yang selesai akan otomatis tercatat di sini."
              : "Buat tugas baru untuk mulai mengorganisir target proyek."}
          </Text>
          {activeFilter !== "done" && (
            <TouchableOpacity
              onPress={handleCreateTask}
              className="mt-3 px-3.5 py-1.5 bg-primary rounded-xl flex-row items-center active:opacity-80"
            >
              <Ionicons name="add" size={15} color="#ffffff" />
              <Text className="text-xs font-semibold text-primary-foreground ml-1">
                Buat Tugas Sekarang
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export default React.memo(TasksComponent);
