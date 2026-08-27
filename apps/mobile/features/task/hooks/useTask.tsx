import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { MutationConfig, queryClient, QueryConfig } from "@/lib/reactQuery";
import { taskService } from "../service/taskService";
import { CreateTaskDTO, Task, UpdateTaskDTO } from "../types/task.types";
import {
  getProjectByIdQueryKey,
  getProjectQueryKey,
} from "@/features/project/hooks/useProject";

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
      queryClient.invalidateQueries({
        queryKey: getTaskQueryKey(),
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(),
        exact: true,
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
      queryClient.setQueryData<Task[]>(getTaskQueryKey(), (old) => {
        if (!old) return old;
        return old.map((t) => (t.id === variables.id ? { ...t, ...data } : t));
      });
      queryClient.invalidateQueries({
        queryKey: getTaskByIdQueryKey(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: getTaskQueryKey(),
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(),
        exact: true,
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
      if (variables.project_id) {
        queryClient.invalidateQueries({
          queryKey: getProjectByIdQueryKey(variables.project_id),
        });
      }
      queryClient.invalidateQueries({ queryKey: getTaskQueryKey() });
      queryClient.invalidateQueries({ queryKey: getProjectQueryKey() });
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
      queryClient.invalidateQueries({
        queryKey: getTaskByIdQueryKey(variables),
      });
      queryClient.invalidateQueries({ queryKey: getTaskQueryKey() });
      queryClient.invalidateQueries({ queryKey: getProjectQueryKey() });
      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
