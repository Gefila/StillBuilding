import api from "@/lib/axios";
import {
  CreatePomodoroSessionDTO,
  PomodoroSession,
  TodayPomodoroStats,
} from "../types/pomodoro.types";

export const pomodoroService = {
  getTodayStats: async (date?: string): Promise<TodayPomodoroStats> => {
    const response = await api.get("pomodoro-sessions/today-stats", {
      params: date ? { date } : undefined,
    });
    return response.data.data;
  },
  getAll: async (): Promise<PomodoroSession[]> => {
    const response = await api.get("pomodoro-sessions");
    return response.data.data;
  },
  create: async (data: CreatePomodoroSessionDTO): Promise<PomodoroSession> => {
    const response = await api.post("pomodoro-sessions", data);
    return response.data.data;
  },
  getById: async (id: string): Promise<PomodoroSession> => {
    const response = await api.get(`pomodoro-sessions/${id}`);
    return response.data.data;
  },
  update: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<CreatePomodoroSessionDTO>;
  }): Promise<PomodoroSession> => {
    const response = await api.put(`pomodoro-sessions/${id}`, data);
    return response.data.data;
  },
};
