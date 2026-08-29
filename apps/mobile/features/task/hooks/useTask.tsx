import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { MutationConfig, queryClient, QueryConfig } from "@/lib/reactQuery";
import { taskService } from "../service/taskService";
import { CreateTaskDTO, Task, UpdateTaskDTO } from "../types/task.types";
import {
  getProjectByIdQueryKey,
  getProjectQueryKey,
} from "@/features/project/hooks/useProject";
import type { Project } from "@/features/project/types/project.types";

export const getTaskQueryKey = () => ["task"];
export const getTaskByIdQueryKey = (id: string) => ["task", id];

export const getTasksQueryOptions = () => {
  return queryOptions({
    queryKey: getTaskQueryKey(),
    queryFn: () => taskService.getAll(),
  });
};

export const getTaskByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: getTaskByIdQueryKey(id),
    queryFn: () => taskService.getById(id),
  });
};

type UseGetTasksOptions = {
  queryConfig?: QueryConfig<typeof getTasksQueryOptions>;
};

type UseGetTaskByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getTaskByIdQueryOptions>;
};

type UseCreateTaskOptions = {
  mutationConfig?: MutationConfig<typeof taskService.create>;
};

type UseUpdateTaskOptions = {
  mutationConfig?: MutationConfig<typeof taskService.update>;
};

type UseDeleteTaskOptions = {
  mutationConfig?: MutationConfig<typeof taskService.delete>;
};

export const useGetTasks = ({ queryConfig = {} }: UseGetTasksOptions = {}) => {
  return useQuery({
    ...getTasksQueryOptions(),
    ...queryConfig,
  });
};

export const useGetTaskById = ({
  id,
  queryConfig = {},
}: UseGetTaskByIdOptions) => {
  return useQuery({
    ...getTaskByIdQueryOptions(id),
    ...queryConfig,
  });
};

export const useSetActiveTask = () => {
  return useMutation({
    mutationFn: async ({
      newTaskId,
      prevTaskId,
    }: {
      newTaskId?: string | null;
      prevTaskId?: string | null;
    }) => {
      // Backend automatically demotes all other active tasks to "Pending" when a task is updated to "Active".
      // Hence, if newTaskId is provided, only 1 PUT request is needed!
      if (newTaskId) {
        return taskService.update({
          id: newTaskId,
          data: { status: "Active" },
        });
      }
      // If user chose Standalone Focus (no target task), demote previous task to "Pending"
      if (prevTaskId) {
        return taskService.update({
          id: prevTaskId,
          data: { status: "Pending" },
        });
      }
      return null;
    },
    onSuccess: (_data, variables) => {
      // Snapshot current tasks BEFORE cache update to find all affected projects
      const cachedTasks = queryClient.getQueryData<Task[]>(getTaskQueryKey());
      const affectedProjectIds = new Set<string>();

      if (cachedTasks) {
        if (variables.newTaskId) {
          // New active task's project
          const newTask = cachedTasks.find(
            (t) => t.id === variables.newTaskId,
          );
          if (newTask?.project_id)
            affectedProjectIds.add(newTask.project_id);
          // Previously active tasks that will be demoted (could be in different projects)
          cachedTasks
            .filter(
              (t) => t.status === "Active" && t.id !== variables.newTaskId,
            )
            .forEach((t) => {
              if (t.project_id) affectedProjectIds.add(t.project_id);
            });
        } else if (variables.prevTaskId) {
          // Standalone focus — demoting previous task
          const prevTask = cachedTasks.find(
            (t) => t.id === variables.prevTaskId,
          );
          if (prevTask?.project_id)
            affectedProjectIds.add(prevTask.project_id);
        }
      }

      // 1. Update task list cache
      queryClient.setQueryData<Task[]>(getTaskQueryKey(), (old) => {
        if (!old) return old;
        return old.map((t) => {
          if (variables.newTaskId) {
            if (t.id === variables.newTaskId) return { ...t, status: "Active" };
            if (t.status === "Active") return { ...t, status: "Pending" };
          } else if (variables.prevTaskId && t.id === variables.prevTaskId) {
            return { ...t, status: "Pending" };
          }
          return t;
        });
      });

      // 2. Update ALL affected project detail caches
      for (const projectId of affectedProjectIds) {
        queryClient.setQueryData<Project>(
          getProjectByIdQueryKey(projectId),
          (oldProject) => {
            if (!oldProject || !oldProject.tasks) return oldProject;
            const updatedTasks = oldProject.tasks.map((t) => {
              if (variables.newTaskId) {
                if (t.id === variables.newTaskId)
                  return { ...t, status: "Active" };
                if (t.status === "Active") return { ...t, status: "Pending" };
              } else if (
                variables.prevTaskId &&
                t.id === variables.prevTaskId
              ) {
                return { ...t, status: "Pending" };
              }
              return t;
            });
            return { ...oldProject, tasks: updatedTasks };
          },
        );
        queryClient.invalidateQueries({
          queryKey: getProjectByIdQueryKey(projectId),
          exact: true,
          refetchType: "none",
        });
      }

      // 3. Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: getTaskQueryKey(),
        exact: true,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(),
        exact: true,
        refetchType: "none",
      });
    },
  });
};

export const useUpdateTask = ({
  mutationConfig = {},
}: UseUpdateTaskOptions = {}) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDTO }) =>
      taskService.update({ id, data }),
    ...mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      // Snapshot old task to detect project changes
      const oldTasks = queryClient.getQueryData<Task[]>(getTaskQueryKey());
      const oldTask = oldTasks?.find((t) => t.id === variables.id);
      const oldProjectId = oldTask?.project_id;
      const newProjectId = data?.project_id;

      // 1. Update cache task list
      queryClient.setQueryData<Task[]>(getTaskQueryKey(), (old) => {
        if (!old) return old;
        return old.map((t) => (t.id === variables.id ? { ...t, ...data } : t));
      });

      // 2. Update cache detail task (jika ada)
      queryClient.setQueryData<Task>(
        getTaskByIdQueryKey(variables.id),
        (old) => {
          if (!old) return old;
          return { ...old, ...data };
        },
      );

      // 3. Update new project cache (jika task punya project_id)
      if (newProjectId) {
        queryClient.setQueryData<Project>(
          getProjectByIdQueryKey(newProjectId),
          (oldProject) => {
            if (!oldProject || !oldProject.tasks) return oldProject;
            const taskExists = oldProject.tasks.some(
              (t) => t.id === variables.id,
            );
            // Jika task sudah ada di project, update in-place; jika baru pindah, tambahkan
            const updatedTasks = taskExists
              ? oldProject.tasks.map((t) =>
                  t.id === variables.id ? { ...t, ...data } : t,
                )
              : [...oldProject.tasks, data as Task];
            const total_tasks = updatedTasks.length;
            const done_tasks = updatedTasks.filter(
              (t) => t.status === "Done",
            ).length;
            return {
              ...oldProject,
              tasks: updatedTasks,
              total_tasks,
              done_tasks,
            };
          },
        );
        queryClient.invalidateQueries({
          queryKey: getProjectByIdQueryKey(newProjectId),
          exact: true,
          refetchType: "none",
        });
      }

      // 4. Clean up old project cache jika task pindah ke project lain
      if (oldProjectId && oldProjectId !== newProjectId) {
        queryClient.setQueryData<Project>(
          getProjectByIdQueryKey(oldProjectId),
          (oldProject) => {
            if (!oldProject) return oldProject;
            const tasks = (oldProject.tasks || []).filter(
              (t) => t.id !== variables.id,
            );
            const total_tasks = tasks.length;
            const done_tasks = tasks.filter(
              (t) => t.status === "Done",
            ).length;
            return { ...oldProject, tasks, total_tasks, done_tasks };
          },
        );
        queryClient.invalidateQueries({
          queryKey: getProjectByIdQueryKey(oldProjectId),
          exact: true,
          refetchType: "none",
        });
      }

      // 5. Invalidate specific queries tanpa menduplikasi request ke active screens
      queryClient.invalidateQueries({
        queryKey: getTaskByIdQueryKey(variables.id),
        exact: true,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: getTaskQueryKey(),
        exact: true,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(),
        exact: true,
        refetchType: "none",
      });
      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useCreateTask = ({
  mutationConfig = {},
}: UseCreateTaskOptions = {}) => {
  return useMutation({
    mutationFn: (taskData: CreateTaskDTO) => taskService.create(taskData),
    ...mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      // 1. Update cache task list
      if (data) {
        queryClient.setQueryData<Task[]>(getTaskQueryKey(), (old) => {
          if (!old) return [data];
          return [data, ...old];
        });
      }

      // 2. Update cache detail project (jika task terikat project)
      const projectId = data?.project_id || variables.project_id;
      if (projectId && data) {
        queryClient.setQueryData<Project>(
          getProjectByIdQueryKey(projectId),
          (oldProject) => {
            if (!oldProject) return oldProject;
            const tasks = [...(oldProject.tasks || []), data];
            const total_tasks = tasks.length;
            const done_tasks = tasks.filter((t) => t.status === "Done").length;
            return {
              ...oldProject,
              tasks,
              total_tasks,
              done_tasks,
            };
          },
        );
        queryClient.invalidateQueries({
          queryKey: getProjectByIdQueryKey(projectId),
          exact: true,
          refetchType: "none",
        });
      }

      queryClient.invalidateQueries({
        queryKey: getTaskQueryKey(),
        exact: true,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(),
        exact: true,
        refetchType: "none",
      });
      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useDeleteTask = ({
  mutationConfig = {},
}: UseDeleteTaskOptions = {}) => {
  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    ...mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData<Task[]>(getTaskQueryKey(), (old) => {
        if (!old) return old;
        return old.filter((t) => t.id !== variables);
      });
      if (data?.project_id) {
        queryClient.setQueryData<Project>(
          getProjectByIdQueryKey(data.project_id),
          (oldProject) => {
            if (!oldProject) return oldProject;
            const tasks = (oldProject.tasks || []).filter(
              (t) => t.id !== variables,
            );
            const total_tasks = tasks.length;
            const done_tasks = tasks.filter((t) => t.status === "Done").length;
            return {
              ...oldProject,
              tasks,
              total_tasks,
              done_tasks,
            };
          },
        );
        queryClient.invalidateQueries({
          queryKey: getProjectByIdQueryKey(data.project_id),
          exact: true,
          refetchType: "none",
        });
      }
      queryClient.invalidateQueries({
        queryKey: getTaskByIdQueryKey(variables),
        exact: true,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: getTaskQueryKey(),
        exact: true,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(),
        exact: true,
        refetchType: "none",
      });
      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
