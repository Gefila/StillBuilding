import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/reactQuery";
import { statsService } from "../service/statsService";
import { statsKeys } from "./statsKeys";

export * from "./statsKeys";

export const getActivityHeatmapQueryOptions = (weeks = 16) => {
  return queryOptions({
    queryKey: statsKeys.heatmap(weeks),
    queryFn: () => statsService.getActivityHeatmap(weeks),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });
};

type UseActivityHeatmapOptions = {
  weeks?: number;
  queryConfig?: QueryConfig<typeof getActivityHeatmapQueryOptions>;
};

export const useActivityHeatmap = ({
  weeks = 16,
  queryConfig = {},
}: UseActivityHeatmapOptions = {}) => {
  return useQuery({
    ...getActivityHeatmapQueryOptions(weeks),
    ...queryConfig,
  });
};
