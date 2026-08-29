import React from "react";
import { Text, View } from "react-native";
import ProjectTasks from "./ProjectTasks";
import ProjectBlockers from "./ProjectBlockers";
import ProjectPomodoro from "./ProjectPomodoro";
import ProjectNotes from "./ProjectNotes";
import { Project } from "../types/project.types";

type Props = {
  activeTab: string;
  project: Project;
};

export default function ProjectTabsContent({ activeTab, project }: Props) {
  let content: React.ReactNode;
  switch (activeTab) {
    case "tasks":
      content = <ProjectTasks tasks={project.tasks || []} project={project} />;
      break;
    case "blockers":
      content = (
        <ProjectBlockers
          projectId={project.id}
          blockers={project.blocker_logs || []}
        />
      );
      break;
    case "pomodoro":
      content = <ProjectPomodoro project={project} />;
      break;
    case "notes":
      content = <ProjectNotes />;
      break;
    default:
      content = (
        <Text className="text-muted text-xs">Konten tidak ditemukan</Text>
      );
  }

  return (
    <View className="bg-surface rounded-2xl border border-border p-4 mb-4 shadow-xs">
      {content}
    </View>
  );
}
