import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { MutationConfig, queryClient, QueryConfig } from "@/lib/reactQuery";
import { blockerService } from "../service/blockerService";
import {
  CreateBlockerLogDTO,
  BlockerLog,
  UpdateBlockerLogDTO,
} from "../types/blocker.types";
import { getProjectByIdQueryKey } from "@/features/project/hooks/projectKeys";
import { getBlockerByIdQueryKey, getBlockersQueryKey } from "./blockerKeys";
import type { Project } from "@/features/project/types/project.types";

export * from "./blockerKeys";

export const getBlockersQueryOptions = () => {
  return queryOptions({
    queryKey: getBlockersQueryKey(),
    queryFn: () => blockerService.getAll(),
  });
};

export const getBlockerByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: getBlockerByIdQueryKey(id),
    queryFn: () => blockerService.getById(id),
  });
};

type UseGetBlockersOptions = {
  queryConfig?: QueryConfig<typeof getBlockersQueryOptions>;
};

type UseCreateBlockerOptions = {
  mutationConfig?: MutationConfig<typeof blockerService.create>;
};

type UseUpdateBlockerOptions = {
  mutationConfig?: MutationConfig<typeof blockerService.update>;
};

type UseDeleteBlockerOptions = {
  mutationConfig?: MutationConfig<typeof blockerService.delete>;
};

export const useGetBlockers = ({
  queryConfig = {},
}: UseGetBlockersOptions = {}) => {
  return useQuery({
    ...getBlockersQueryOptions(),
    ...queryConfig,
  });
};

export const useCreateBlocker = ({
  mutationConfig = {},
}: UseCreateBlockerOptions = {}) => {
  return useMutation({
    mutationFn: (data: CreateBlockerLogDTO) => blockerService.create(data),
    ...mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      // 1. Update cache blockers list
      queryClient.setQueryData<BlockerLog[]>(getBlockersQueryKey(), (old) => {
        if (!old) return old;
        return [data, ...old];
      });

      // 2. Update cache detail project (jika terikat dengan project)
      const projectId = data?.project_id || variables.project_id;
      if (projectId) {
        queryClient.setQueryData<Project>(
          getProjectByIdQueryKey(projectId),
          (oldProject) => {
            if (!oldProject) return oldProject;
            return {
              ...oldProject,
              blocker_logs: [data, ...(oldProject.blocker_logs || [])],
            };
          },
        );
        queryClient.invalidateQueries({
          queryKey: getProjectByIdQueryKey(projectId),
          exact: true,
        });
      }

      queryClient.invalidateQueries({
        queryKey: getBlockersQueryKey(),
        exact: true,
        refetchType: "none",
      });
      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useUpdateBlocker = ({
  mutationConfig = {},
}: UseUpdateBlockerOptions = {}) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlockerLogDTO }) =>
      blockerService.update({ id, data }),
    ...mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      // 1. Update cache blockers list
      queryClient.setQueryData<BlockerLog[]>(getBlockersQueryKey(), (old) => {
        if (!old) return old;
        return old.map((b) => (b.id === variables.id ? { ...b, ...data } : b));
      });

      // 2. Update cache detail blocker
      queryClient.setQueryData<BlockerLog>(
        getBlockerByIdQueryKey(variables.id),
        (old) => {
          if (!old) return old;
          return { ...old, ...data };
        },
      );

      // 3. Update cache detail project
      if (data?.project_id) {
        queryClient.setQueryData<Project>(
          getProjectByIdQueryKey(data.project_id),
          (oldProject) => {
            if (!oldProject || !oldProject.blocker_logs) return oldProject;
            return {
              ...oldProject,
              blocker_logs: oldProject.blocker_logs.map((b) =>
                b.id === variables.id ? { ...b, ...data } : b,
              ),
            };
          },
        );
        queryClient.invalidateQueries({
          queryKey: getProjectByIdQueryKey(data.project_id),
          exact: true,
        });
      }

      queryClient.invalidateQueries({
        queryKey: getBlockerByIdQueryKey(variables.id),
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: getBlockersQueryKey(),
        exact: true,
        refetchType: "none",
      });
      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useDeleteBlocker = ({
  mutationConfig = {},
}: UseDeleteBlockerOptions = {}) => {
  return useMutation({
    mutationFn: (id: string) => blockerService.delete(id),
    ...mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      // 1. Update cache blockers list
      queryClient.setQueryData<BlockerLog[]>(getBlockersQueryKey(), (old) => {
        if (!old) return old;
        return old.filter((b) => b.id !== variables);
      });

      // 2. Update cache detail project
      if (data?.project_id) {
        queryClient.setQueryData<Project>(
          getProjectByIdQueryKey(data.project_id),
          (oldProject) => {
            if (!oldProject || !oldProject.blocker_logs) return oldProject;
            return {
              ...oldProject,
              blocker_logs: oldProject.blocker_logs.filter(
                (b) => b.id !== variables,
              ),
            };
          },
        );
        queryClient.invalidateQueries({
          queryKey: getProjectByIdQueryKey(data.project_id),
          exact: true,
        });
      }

      queryClient.invalidateQueries({
        queryKey: getBlockerByIdQueryKey(variables),
        exact: true,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: getBlockersQueryKey(),
        exact: true,
        refetchType: "none",
      });
      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
