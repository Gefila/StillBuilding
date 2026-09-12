import React from "react";
import { View } from "react-native";
import Tasks from "../../../components/tasks/Tasks";
import { Task } from "@/features/task/types/task.types";
import { Project } from "../types/project.types";

export default function ProjectTasks({
  tasks,
  project,
}: {
  tasks: Task[];
  project: Project;
}) {
  return (
    <View>
      <Tasks
        tasks={tasks}
        title="Daftar Tugas Proyek"
        projectId={project.id}
        showProject={false}
      />
    </View>
  );
}
