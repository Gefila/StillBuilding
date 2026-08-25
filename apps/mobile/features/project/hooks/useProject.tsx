import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { projectService } from "../services/projectService";
import { MutationConfig, queryClient, QueryConfig } from "@/lib/reactQuery";
import { CreateProjectDTO } from "../types/project.types";

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
      queryClient.invalidateQueries({
        queryKey: getProjectByIdQueryKey(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: getProjectQueryKey() });

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
      queryClient.invalidateQueries({ queryKey: getProjectQueryKey() });
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
      queryClient.invalidateQueries({
        queryKey: getProjectByIdQueryKey(variables),
      });
      queryClient.invalidateQueries({ queryKey: getProjectQueryKey() });
      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
