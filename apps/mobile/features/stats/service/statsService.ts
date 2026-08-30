import api from "@/lib/axios";
import type { ActivityHeatmapData } from "../types/stats.types";

export const statsService = {
  getActivityHeatmap: async (weeks = 16): Promise<ActivityHeatmapData> => {
    const response = await api.get(`stats/activity-heatmap?weeks=${weeks}`);
    return response.data.data;
  },
};
