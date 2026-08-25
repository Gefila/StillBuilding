import React from "react";
import { View } from "react-native";
import ProjectsStat from "./ProjectsStat";
import { Project } from "@/features/project/types/project.types";
import { PomodoroSession } from "@/features/pomodoro/types/pomodoro.types";

interface ProjectsStatsProps {
  projects?: Project[];
  pomodoros?: PomodoroSession[];
}

export default function ProjectsStats({
  projects = [],
  pomodoros = [],
}: ProjectsStatsProps) {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => (p.status || "Active") === "Active",
  ).length;

  const totalTasks = projects.reduce((sum, p) => sum + (p.total_tasks || 0), 0);
  const doneTasks = projects.reduce((sum, p) => sum + (p.done_tasks || 0), 0);

  /*
   * Optional / Temporary commented Pomodoro calculation
   * const totalFocusMinutes = pomodoros.reduce((sum, session) => {
   *   const rawDuration = session.duration || 25;
   *   const mins = rawDuration > 60 ? Math.round(rawDuration / 60) : rawDuration;
   *   return sum + mins;
   * }, 0);
   */

  return (
    <View className="flex-row gap-2.5">
      <ProjectsStat
        icon="folder-open-outline"
        title="Proyek Aktif"
        value={activeProjects}
        subtitle={`/ ${totalProjects}`}
      />
      <ProjectsStat
        icon="checkmark-circle-outline"
        title="Tugas Selesai"
        value={doneTasks}
        subtitle={`/ ${totalTasks}`}
      />
      {/* 
        Temporary commented: Waktu Fokus stat card
        <ProjectsStat
          icon="timer-outline"
          title="Waktu Fokus"
          value={formatFocusTime(totalFocusMinutes)}
          subtitle={pomodoros.length > 0 ? `${pomodoros.length} sesi` : undefined}
        />
      */}
    </View>
  );
}
