import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { MutationConfig, queryClient, QueryConfig } from "@/lib/reactQuery";
import { taskService } from "../service/taskService";
import { CreateTaskDTO, UpdateTaskDTO } from "../types/task.types";
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

export const useUpdateTask = ({
	mutationConfig = {},
}: UseUpdateTaskOptions = {}) => {
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateTaskDTO }) =>
			taskService.update({ id, data }),
		...mutationConfig,
		onSuccess: (data, variables, onMutateResult, context) => {
			queryClient.invalidateQueries({
				queryKey: getTaskByIdQueryKey(variables.id),
			});
			queryClient.invalidateQueries({ queryKey: getTaskQueryKey() });
			queryClient.invalidateQueries({ queryKey: getProjectQueryKey() });
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
