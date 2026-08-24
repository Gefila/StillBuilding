import api from "@/lib/axios";
import {
	BlockerLog,
	CreateBlockerLogDTO,
	UpdateBlockerLogDTO,
} from "../types/blocker.types";

export const blockerService = {
	getAll: async (): Promise<BlockerLog[]> => {
		const response = await api.get("blocker-logs");
		return response.data.data || [];
	},
	create: async (data: CreateBlockerLogDTO): Promise<BlockerLog> => {
		const response = await api.post("blocker-logs", data);
		return response.data.data || response.data;
	},
	getById: async (id: string): Promise<BlockerLog> => {
		const response = await api.get(`blocker-logs/${id}`);
		return response.data.data;
	},
	update: async ({
		id,
		data,
	}: {
		id: string;
		data: UpdateBlockerLogDTO;
	}): Promise<BlockerLog> => {
		const response = await api.put(`blocker-logs/${id}`, data);
		return response.data.data;
	},
	delete: async (id: string): Promise<BlockerLog> => {
		const response = await api.delete(`blocker-logs/${id}`);
		return response.data.data || response.data;
	},
};
