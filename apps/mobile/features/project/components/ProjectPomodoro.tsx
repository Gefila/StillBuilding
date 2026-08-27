import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { Project } from "../types/project.types";
import type { Task } from "@/features/task/types/task.types";
import { formatLastSessionTime } from "@/utils/dateHelpers";
import { usePomodoroStore } from "@/features/pomodoro/store/usePomodoroStore";
import { useSetActiveTask } from "@/features/task/hooks/useTask";
import ProjectSessionRow, {
  type ProjectSessionItem,
  getSessionDurationMinutes,
} from "./ProjectSessionRow";

interface ProjectPomodoroProps {
  project: Project;
}

export default function ProjectPomodoro({ project }: ProjectPomodoroProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  // Active / Uncompleted tasks in the project
  const activeTasks = useMemo(
    () => (project?.tasks || []).filter((task) => task.status !== "Done"),
    [project?.tasks],
  );

  const topActiveTask = activeTasks[0];

  // Aggregate all real pomodoro sessions across project tasks
  const {
    sortedSessions,
    totalSessionsCount,
    formattedTotalTime,
    lastSessionText,
  } = useMemo(() => {
    const rawSessions: ProjectSessionItem[] = (project?.tasks || []).flatMap(
      (task) =>
        (task.pomodoro_sessions || []).map((session) => ({
          ...session,
          taskTitle: task.title || "Tugas Proyek",
        })),
    );

    const sorted = rawSessions.sort(
      (a, b) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
    );

    const focusSessions = sorted.filter(
      (s) => s.mode === "pomodoro" || !s.mode,
    );
    const totalMinutes = focusSessions.reduce(
      (sum, s) => sum + getSessionDurationMinutes(s),
      0,
    );
    const count = focusSessions.length;

    const formattedTime =
      totalMinutes >= 60
        ? `${Math.floor(totalMinutes / 60)}j ${
            totalMinutes % 60 > 0 ? `${totalMinutes % 60}m` : ""
          }`
        : `${totalMinutes}m`;

    const latest = sorted[0];
    const lastSession = latest
      ? formatLastSessionTime(latest.ended_at || latest.started_at)
      : null;

    return {
      sortedSessions: sorted,
      totalSessionsCount: count,
      formattedTotalTime: formattedTime,
      lastSessionText: lastSession,
    };
  }, [project?.tasks]);

  const visibleSessions = isExpanded
    ? sortedSessions
    : sortedSessions.slice(0, 4);
  const hasMoreSessions = sortedSessions.length > 4;

  const setActiveTaskMutation = useSetActiveTask();

  const handleStartFocus = (task?: Task) => {
    if (task) {
      const prevTask = usePomodoroStore.getState().activeTask;

      usePomodoroStore.getState().setActiveTask({
        id: task.id,
        title: task.title,
        project_id: task.project_id || project.id,
        projectName: project.name,
      });

      if (task.status !== "Active" || (prevTask && prevTask.id !== task.id)) {
        setActiveTaskMutation.mutate({
          prevTaskId: prevTask && prevTask.id !== task.id ? prevTask.id : null,
          newTaskId: task.status !== "Active" ? task.id : null,
        });
      }
    }
    router.push("/(tabs)/focus");
  };

  return (
    <View className="flex-1">
      {/* 1. Header dengan Timestamp Sesi Terakhir */}
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="timer-outline" size={16} color="#18181b" />
          <Text className="text-xs font-bold uppercase tracking-wider text-muted">
            Fokus & Pomodoro
          </Text>
        </View>

        {lastSessionText && (
          <View className="flex-row items-center gap-1 bg-surface-subtle border border-border px-2 py-0.5 rounded-full">
            <Ionicons name="time-outline" size={10} color="#71717a" />
            <Text className="text-[10px] font-semibold text-muted">
              Terakhir:{" "}
              <Text className="font-bold text-foreground">
                {lastSessionText}
              </Text>
            </Text>
          </View>
        )}
      </View>

      {/* 2. Bar Rangkuman 2 Metrik (Total Waktu & Total Selesai) */}
      {totalSessionsCount > 0 && (
        <View className="flex-row items-center justify-around bg-surface-subtle border border-border rounded-xl px-3 py-2 mb-3">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="hourglass-outline" size={12} color="#71717a" />
            <Text className="text-[11px] text-muted font-medium">
              Total Waktu:
            </Text>
            <Text className="text-xs font-bold text-foreground">
              {formattedTotalTime}
            </Text>
          </View>

          <View className="w-px h-3.5 bg-border" />

          <View className="flex-row items-center gap-1.5">
            <Ionicons
              name="checkmark-circle-outline"
              size={12}
              color="#71717a"
            />
            <Text className="text-[11px] text-muted font-medium">Selesai:</Text>
            <Text className="text-xs font-bold text-foreground">
              {totalSessionsCount} Sesi Fokus
            </Text>
          </View>
        </View>
      )}

      {/* 3. Quick Focus CTA Banner */}
      <TouchableOpacity
        onPress={() => handleStartFocus(topActiveTask)}
        activeOpacity={0.85}
        className="bg-primary rounded-xl p-3 mb-3.5 border border-primary flex-row items-center justify-between shadow-2xs"
      >
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-8 h-8 rounded-lg bg-white/10 items-center justify-center mr-2.5 border border-white/15">
            <Ionicons name="flame" size={16} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-xs font-bold tracking-tight">
              Mulai Sesi Fokus Proyek
            </Text>
            <Text
              className="text-zinc-400 text-[11px] mt-0.5"
              numberOfLines={1}
            >
              {topActiveTask?.title
                ? `Lanjut: ${topActiveTask.title}`
                : "Mulai sesi Pomodoro 25 menit"}
            </Text>
          </View>
        </View>

        <View className="w-6 h-6 rounded-full bg-white items-center justify-center">
          <Ionicons
            name="play"
            size={11}
            color="#18181b"
            style={{ marginLeft: 1.5 }}
          />
        </View>
      </TouchableOpacity>

      {/* 4. Quick Active Tasks Focus Selector (jika ada > 1 task) */}
      {activeTasks.length > 1 && (
        <View className="mb-3.5">
          <Text className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Pilih Tugas untuk Difokuskan
          </Text>
          <View className="gap-1.5">
            {activeTasks.slice(0, 3).map((task) => (
              <View
                key={task.id}
                className="flex-row items-center justify-between bg-surface-subtle border border-border rounded-xl px-3 py-2"
              >
                <View className="flex-1 mr-2.5">
                  <Text
                    className="text-xs font-semibold text-foreground"
                    numberOfLines={1}
                  >
                    {task.title}
                  </Text>
                  <Text className="text-[10px] text-muted mt-0.5">
                    Prioritas {task.priority || "Normal"}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleStartFocus(task)}
                  activeOpacity={0.8}
                  className="bg-surface border border-border px-2.5 py-1 rounded-lg flex-row items-center"
                >
                  <Ionicons
                    name="play"
                    size={9}
                    color="#18181b"
                    style={{ marginRight: 3 }}
                  />
                  <Text className="text-[11px] font-bold text-foreground">
                    Fokus
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 5. Riwayat Sesi Fokus Proyek Teragregasi */}
      {sortedSessions.length > 0 ? (
        <View>
          <Text className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Riwayat Sesi Proyek
          </Text>

          <View className="gap-1.5">
            {visibleSessions.map((session, index) => (
              <ProjectSessionRow
                key={session.id || index}
                session={session}
                index={index}
                total={sortedSessions.length}
              />
            ))}

            {hasMoreSessions && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsExpanded((prev) => !prev)}
                className="py-1.5 rounded-lg bg-surface-subtle border border-border flex-row items-center justify-center mt-1"
              >
                <Text className="text-[11px] font-semibold text-foreground mr-1">
                  {isExpanded
                    ? "Sembunyikan"
                    : `Lihat Semua (${sortedSessions.length} Sesi)`}
                </Text>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={12}
                  color="#18181b"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        /* Empty State */
        <View className="py-3 px-3 items-center justify-center bg-surface-subtle border border-dashed border-border rounded-xl">
          <View className="flex-row items-center gap-2 mb-1">
            <Ionicons name="timer-outline" size={15} color="#71717a" />
            <Text className="text-xs font-semibold text-foreground">
              Belum ada riwayat fokus pada proyek ini
            </Text>
          </View>
          <Text className="text-[10px] text-muted text-center mb-2">
            Sesi fokus yang Anda selesaikan pada tugas proyek akan otomatis
            tercatat di sini.
          </Text>
          <TouchableOpacity
            onPress={() => handleStartFocus(topActiveTask)}
            activeOpacity={0.8}
            className="flex-row items-center bg-primary px-3 py-1.5 rounded-lg"
          >
            <Ionicons name="play" size={12} color="#ffffff" />
            <Text className="text-xs font-semibold text-primary-foreground ml-1">
              Mulai Sesi Fokus Pertama
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
