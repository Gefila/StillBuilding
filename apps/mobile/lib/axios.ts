import { useAuthStore } from "@/features/auth/store/useAuthStore";
import axios, { isAxiosError } from "axios";
import { Toast } from "toastify-react-native";

const api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL,
	timeout: 10000,
	headers: {
		Accept: "application/json",
	},
});

api.interceptors.response.use(
	(response) => {
		return response;
	},

	async (error) => {
		if (isAxiosError(error)) {
			if (error.response) {
				const { status, data } = error.response;
				switch (status) {
					case 400:
						return Promise.reject(data);
					case 401:
						await useAuthStore.getState().logout();
						if (
							data?.message &&
							!data.message.toLowerCase().includes("credentials") &&
							!data.message.toLowerCase().includes("login")
						) {
							Toast.error("Sesi Anda telah berakhir. Silakan masuk kembali.");
						}
						return Promise.reject(data);
					case 403:
						return Promise.reject(data);
					case 404:
						return Promise.reject(data);
					case 500:
						return Promise.reject(data);
					default:
						return Promise.reject({
							message: data?.message || "Terjadi kesalahan pada server.",
						});
				}
			} else {
				return Promise.reject({
					message: error.message || "Masalah jaringan, silakan coba lagi.",
				});
			}
		}

		return Promise.reject(new Error("Terjadi kesalahan yang tidak terduga."));
	},
);

api.interceptors.request.use(async (config) => {
	const token = useAuthStore.getState().token;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
