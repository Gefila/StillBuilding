import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { projectService } from "../services/projectService";
import { MutationConfig, queryClient, QueryConfig } from "@/lib/reactQuery";
import { CreateProjectDTO, Project } from "../types/project.types";
import { getTaskQueryKey } from "@/features/task/hooks/useTask";
import { getBlockersQueryKey } from "@/features/blocker/hooks/useBlocker";
import type { Task } from "@/features/task/types/task.types";

export const getProjectQueryKey = () => ["project"];
export const getProjectByIdQueryKey = (id: string) => ["project", id];

export const getProjectsQueryOptions = () => {
  return queryOptions({
    queryKey: getProjectQueryKey(),
    queryFn: () => projectService.getAll(),
  });
};

export const getProjectByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: getProjectByIdQueryKey(id),
    queryFn: () => projectService.getById(id),
  });
};

type UseGetProjectsOptions = {
  queryConfig?: QueryConfig<typeof getProjectsQueryOptions>;
};

type UseGetProjectByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getProjectByIdQueryOptions>;
};

type UseCreateProjectOptions = {
  mutationConfig?: MutationConfig<typeof projectService.create>;
};

type UseUpdateProjectOptions = {
  mutationConfig?: MutationConfig<typeof projectService.update>;
};

type UseDeleteProjectOptions = {
  mutationConfig?: MutationConfig<typeof projectService.delete>;
};

export const useGetProjects = ({
  queryConfig = {},
}: UseGetProjectsOptions = {}) => {
  return useQuery({
    ...getProjectsQueryOptions(),
    ...queryConfig,
  });
};

export const useGetProjectById = ({
  id,
  queryConfig = {},
}: UseGetProjectByIdOptions) => {
  return useQuery({
    ...getProjectByIdQueryOptions(id),
    ...queryConfig,
  });
};

export const useUpdateProject = ({
  mutationConfig = {},
}: UseUpdateProjectOptions = {}) => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateProjectDTO>;
    }) => projectService.update({ id, data }),
    ...mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      // 1. Update cache detail project
      queryClient.setQueryData<Project>(
        getProjectByIdQueryKey(variables.id),
        (old) => {
          if (!old) return old;
          return { ...old, ...data };
        },
      );

      // 2. Update cache list projects
      queryClient.setQueryData<Project[]>(getProjectQueryKey(), (old) => {
        if (!old) return old;
        return old.map((p) => (p.id === variables.id ? { ...p, ...data } : p));
      });

      // 3. Update nested project data in cached task list
      queryClient.setQueryData<Task[]>(getTaskQueryKey(), (old) => {
        if (!old) return old;
        return old.map((t) => {
          if (t.project_id === variables.id || t.project?.id === variables.id) {
            return {
              ...t,
              project: {
                ...(t.project || { id: variables.id, name: "" }),
                ...data,
              },
            };
          }
          return t;
        });
      });

      // 4. Invalidate queries
      queryClient.invalidateQueries({
        queryKey: getProjectByIdQueryKey(variables.id),
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(),
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: getTaskQueryKey(),
        exact: true,
        refetchType: "none",
      });

      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useCreateProject = ({
  mutationConfig = {},
}: UseCreateProjectOptions = {}) => {
  return useMutation({
    mutationFn: (projectData: CreateProjectDTO) =>
      projectService.create(projectData),
    ...mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData<Project[]>(getProjectQueryKey(), (old) => {
        if (!old) return old;
        return [data, ...old];
      });

      queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(),
        exact: true,
      });
      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useDeleteProject = ({
  mutationConfig = {},
}: UseDeleteProjectOptions = {}) => {
  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    ...mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData<Project[]>(getProjectQueryKey(), (old) => {
        if (!old) return old;
        return old.filter((p) => p.id !== variables);
      });

      queryClient.invalidateQueries({
        queryKey: getProjectByIdQueryKey(variables),
        exact: true,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(),
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: getTaskQueryKey(),
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
