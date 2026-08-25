import api from "@/lib/axios";
import { CreateTaskDTO, Task, UpdateTaskDTO } from "../types/task.types";

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get("tasks");
    return response.data.data || [];
  },
  create: async (data: CreateTaskDTO): Promise<Task> => {
    const response = await api.post("tasks", data);
    return response.data;
  },
  getById: async (id: string): Promise<Task> => {
    const response = await api.get(`tasks/${id}`);
    return response.data.data;
  },
  update: async ({
    id,
    data,
  }: {
    id: string;
    data: UpdateTaskDTO;
  }): Promise<Task> => {
    const response = await api.put(`tasks/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string): Promise<Task> => {
    const response = await api.delete(`tasks/${id}`);
    return response.data;
  },
};
