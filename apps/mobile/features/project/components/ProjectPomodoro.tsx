import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Project } from "../types/project.types";
import { formatDateID, formatTime } from "@/utils/dateHelpers";

interface SessionItem {
  id: string;
  taskTitle: string;
  duration: number;
  completedAt: string;
  startedAt: string;
}

export default function ProjectPomodoro({ project }: { project: Project }) {
  const router = useRouter();

  const activeTasks = (project?.tasks || []).filter(
    (task) => task.status !== "Done",
  );

  // Collect all pomodoro sessions from project tasks (or fallback mock)
  const sessions: SessionItem[] = (project?.tasks || []).flatMap((t) =>
    (t.pomodoro_sessions || []).map((s: any) => ({
      id: s.id,
      taskTitle: t.title,
      duration: s.duration_mins || 25,
      completedAt: s.completed_at || s.started_at,
      startedAt: s.started_at,
    })),
  );

  // Fallback sample sessions if no sessions exist yet
  const displaySessions =
    sessions.length > 0
      ? sessions
      : [
          {
            id: "sample-1",
            taskTitle: activeTasks[0]?.title || "Implementasi Fitur Utama",
            duration: 25,
            completedAt: new Date().toISOString(),
            startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          },
          {
            id: "sample-2",
            taskTitle: activeTasks[1]?.title || "Desain Antarmuka Layar",
            duration: 25,
            completedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            startedAt: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
          },
        ];

  const totalFocusMinutes = displaySessions.reduce(
    (sum, s) => sum + (s.duration || 25),
    0,
  );
  const totalSessionsCount = displaySessions.length;

  const handleStartFocus = (taskId?: string) => {
    if (taskId) {
      router.push({
        pathname: "/(tabs)/focus",
        params: { id: taskId },
      });
    } else {
      router.push("/(tabs)/focus");
    }
  };

  return (
    <View className="flex-1">
      {/* 1. Header */}
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-bold text-foreground tracking-tight">
            Fokus & Pomodoro
          </Text>
          <View className="bg-surface-subtle px-2 py-0.5 rounded-full border border-border">
            <Text className="text-[11px] font-bold text-foreground">
              {totalSessionsCount} Sesi
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Focus Summary Stat Cards */}
      <View className="flex-row gap-2.5 mb-3">
        <View className="flex-1 bg-surface-subtle border border-border rounded-xl p-3">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-[10px] font-bold text-muted uppercase tracking-wider">
              Total Fokus
            </Text>
            <Ionicons name="timer-outline" size={14} color="#71717a" />
          </View>
          <Text className="text-xl font-bold text-foreground tracking-tight">
            {totalFocusMinutes}{" "}
            <Text className="text-xs font-normal text-muted">Menit</Text>
          </Text>
          <Text className="text-[10px] text-muted mt-0.5">Waktu produktif</Text>
        </View>

        <View className="flex-1 bg-surface-subtle border border-border rounded-xl p-3">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-[10px] font-bold text-muted uppercase tracking-wider">
              Sesi Tuntas
            </Text>
            <Ionicons
              name="checkmark-done-circle-outline"
              size={14}
              color="#16a34a"
            />
          </View>
          <Text className="text-xl font-bold text-foreground tracking-tight">
            {totalSessionsCount}{" "}
            <Text className="text-xs font-normal text-muted">Sesi</Text>
          </Text>
          <Text className="text-[10px] text-muted mt-0.5">Interval 25 mnt</Text>
        </View>
      </View>

      {/* 3. Quick Focus CTA Banner */}
      <TouchableOpacity
        onPress={() => handleStartFocus(activeTasks[0]?.id)}
        activeOpacity={0.85}
        className="bg-primary rounded-xl p-3.5 mb-4 border border-primary flex-row items-center justify-between shadow-2xs"
      >
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-9 h-9 rounded-lg bg-white/10 items-center justify-center mr-3 border border-white/15">
            <Ionicons name="flame" size={18} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-xs font-bold tracking-tight">
              Mulai Sesi Fokus Proyek
            </Text>
            <Text
              className="text-zinc-400 text-[11px] mt-0.5"
              numberOfLines={1}
            >
              {activeTasks[0]?.title
                ? `Lanjut: ${activeTasks[0].title}`
                : "Mulai timer 25 menit untuk proyek ini"}
            </Text>
          </View>
        </View>

        <View className="w-7 h-7 rounded-full bg-white items-center justify-center">
          <Ionicons
            name="play"
            size={12}
            color="#18181b"
            style={{ marginLeft: 2 }}
          />
        </View>
      </TouchableOpacity>

      {/* 4. Active Tasks Focus Selector */}
      {activeTasks.length > 0 && (
        <View className="mb-4">
          <Text className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Pilih Tugas untuk Difokuskan
          </Text>
          <View className="gap-2">
            {activeTasks.slice(0, 3).map((task) => (
              <View
                key={task.id}
                className="flex-row items-center justify-between bg-surface border border-border rounded-xl p-3 shadow-2xs"
              >
                <View className="flex-1 mr-3">
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
                  onPress={() => handleStartFocus(task.id)}
                  activeOpacity={0.8}
                  className="bg-surface-subtle border border-border px-2.5 py-1.5 rounded-lg flex-row items-center"
                >
                  <Ionicons
                    name="play"
                    size={10}
                    color="#18181b"
                    style={{ marginRight: 4 }}
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

      {/* 5. Recent Sessions History */}
      <View>
        <Text className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
          Riwayat Sesi Fokus Proyek
        </Text>
        <View className="gap-2">
          {displaySessions.map((session, index) => (
            <View
              key={session.id || index}
              className="flex-row items-center justify-between bg-surface border border-border rounded-xl p-3 shadow-2xs"
            >
              <View className="flex-row items-center gap-2.5 flex-1 mr-2">
                <View className="w-7 h-7 rounded-lg bg-surface-subtle border border-border items-center justify-center">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={15}
                    color="#16a34a"
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-xs font-semibold text-foreground"
                    numberOfLines={1}
                  >
                    {session.taskTitle}
                  </Text>
                  <Text className="text-[10px] text-muted mt-0.5">
                    {formatDateID(session.completedAt)} ·{" "}
                    {formatTime(session.startedAt)}
                  </Text>
                </View>
              </View>

              <View className="bg-surface-subtle border border-border px-2 py-0.5 rounded-md">
                <Text className="text-[10px] font-bold text-foreground">
                  {session.duration} Menit
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
