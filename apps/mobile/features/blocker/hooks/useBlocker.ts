import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { MutationConfig, queryClient, QueryConfig } from "@/lib/reactQuery";
import { blockerService } from "../service/blockerService";
import {
  CreateBlockerLogDTO,
  UpdateBlockerLogDTO,
} from "../types/blocker.types";

export const getBlockersQueryKey = () => ["blockers"];
export const getBlockerByIdQueryKey = (id: string) => ["blockers", id];

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
      queryClient.invalidateQueries({ queryKey: getBlockersQueryKey() });
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
      queryClient.invalidateQueries({
        queryKey: getBlockerByIdQueryKey(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: getBlockersQueryKey() });
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
      queryClient.invalidateQueries({
        queryKey: getBlockerByIdQueryKey(variables),
      });
      queryClient.invalidateQueries({ queryKey: getBlockersQueryKey() });
      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
