import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { MutationConfig, queryClient, QueryConfig } from "@/lib/reactQuery";
import { pomodoroService } from "../services/pomodoroService";
import { CreatePomodoroSessionDTO } from "../types/pomodoro.types";

export const getPomodoroQueryKey = () => ["pomodoro"];
export const getPomodoroByIdQueryKey = (id: string) => ["pomodoro", id];

export const getPomodorosQueryOptions = () => {
  return queryOptions({
    queryKey: getPomodoroQueryKey(),
    queryFn: () => pomodoroService.getAll(),
  });
};

export const getPomodoroByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: getPomodoroByIdQueryKey(id),
    queryFn: () => pomodoroService.getById(id),
  });
};

type UseGetPomodorosOptions = {
  queryConfig?: QueryConfig<typeof getPomodorosQueryOptions>;
};

type UseGetPomodoroByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getPomodoroByIdQueryOptions>;
};

type UseCreatePomodoroOptions = {
  mutationConfig?: MutationConfig<typeof pomodoroService.create>;
};

type UseUpdatePomodoroOptions = {
  mutationConfig?: MutationConfig<typeof pomodoroService.update>;
};

export const useGetPomodoros = ({
  queryConfig = {},
}: UseGetPomodorosOptions = {}) => {
  return useQuery({
    ...getPomodorosQueryOptions(),
    ...queryConfig,
  });
};

export const useGetPomodoroById = ({
  id,
  queryConfig = {},
}: UseGetPomodoroByIdOptions) => {
  return useQuery({
    ...getPomodoroByIdQueryOptions(id),
    ...queryConfig,
  });
};

export const useUpdatePomodoro = ({
  mutationConfig = {},
}: UseUpdatePomodoroOptions = {}) => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreatePomodoroSessionDTO>;
    }) => pomodoroService.update({ id, data }),
    ...mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: getPomodoroByIdQueryKey(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: getPomodoroQueryKey() });

      mutationConfig.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useCreatePomodoro = ({
  mutationConfig = {},
}: UseCreatePomodoroOptions = {}) => {
  return useMutation({
    mutationFn: (pomodoroData: CreatePomodoroSessionDTO) =>
      pomodoroService.create(pomodoroData),
    meta: {
      skipGlobalErrorToast: true,
      ...mutationConfig.meta,
    },
    ...mutationConfig,
  });
};
