import api from "@/lib/axios";
import { CreateProjectDTO, Project } from "../types/project.types";

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get("projects");
    return response.data.data;
  },
  create: async (data: CreateProjectDTO): Promise<Project> => {
    const response = await api.post("projects", data);
    return response.data.data;
  },
  getById: async (id: string): Promise<Project> => {
    const response = await api.get(`projects/${id}`);
    return response.data.data;
  },
  update: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<CreateProjectDTO>;
  }): Promise<Project> => {
    const response = await api.put(`projects/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string): Promise<Project> => {
    const response = await api.delete(`projects/${id}`);
    return response.data.data;
  },
};
