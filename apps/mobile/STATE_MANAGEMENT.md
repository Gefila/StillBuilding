# Panduan Manajemen State & Integrasi API (_State Management & API Guide_)

Dokumen ini mengatur arsitektur manajemen state dan alur komunikasi data antara frontend dan backend Express/Supabase pada aplikasi StillBuilding.

---

## 1. Pembagian Kategori State (_State Categories_)

Aplikasi StillBuilding membagi state menjadi 3 kategori utama:

| Kategori State            | Solusi Teknologi                                | Kapan Digunakan?                                                                                                  | Contoh Kasus                                                                                       |
| :------------------------ | :---------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **Server State**          | **TanStack Query v5** (`@tanstack/react-query`) | Data yang bersumber dari API backend, memerlukan caching, sinkronisasi, refetching, dan deduplikasi request.      | Daftar Task, Detail Project, Riwayat Sesi Pomodoro, Log Blocker.                                   |
| **Global Client State**   | **Zustand v5** (`zustand`)                      | State reaktif antar komponen/halaman yang tidak berasal langsung dari backend atau butuh kontrol real-time/timer. | Active Pomodoro Timer (countdown, pause, resume), Active Session ID, Global UI Drawer/Modal state. |
| **Local Component State** | **React `useState` / `useReducer`**             | State yang hanya relevan di satu komponen visual tertentu dan tidak dibagi ke komponen lain.                      | Input toggle password visibility, tab lokal di dalam modal, dropdown open/close state.             |

---

## 2. Server State: TanStack Query v5

### A. Konfigurasi Global (`lib/reactQuery.ts`)

Default options telah dikonfigurasi untuk mencegah request berlebih namun tetap menjaga data mutakhir:

- `staleTime`: **5 menit** (data dianggap segar selama 5 menit tanpa refetch otomatis).
- `gcTime`: **10 menit** (data yang tidak digunakan disimpan di memori selama 10 menit sebelum dihapus).
- `retry`: **1 kali** untuk query yang gagal.
- `refetchOnWindowFocus`: **false** (agar tidak refetch berulang saat berpindah window di mobile).

### B. Hierarki & Konvensi Query Keys (_Query Key Factory_)

Hindari menulis query key dalam format string sembarangan. Gunakan pola _Query Key Factory_ di setiap feature untuk memudahkan invalidasi cache yang presisi:

```typescript
// features/task/hooks/taskKeys.ts
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters: { status?: string; projectId?: string }) =>
    [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};
```

### C. Implementasi Query (`useQuery`)

```typescript
// features/task/hooks/useTasks.ts
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../services/taskService";
import { taskKeys } from "./taskKeys";

export const useTasks = (
  filters: { status?: string; projectId?: string } = {},
) => {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => getTasks(filters),
  });
};

export const useTaskDetail = (id: string) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTaskById(id),
    enabled: Boolean(id), // Hanya query jika ID valid
  });
};
```

### D. Implementasi Mutasi & Invalidasi Cache (`useMutation`)

Setiap kali melakukan operasi mutasi (create, update, delete), ikuti 3 standar berikut:

1. **Direct Cache Sync (`setQueryData`)**: Perbarui cache memori lokal secara sinkron di dalam `onSuccess` agar UI langsung merespons seketika (0 ms latency) tanpa menunggu network roundtrip.
2. **Isolasi Prefix (`exact: true`)**: Selalu gunakan `exact: true` saat melakukan invalidasi query key agar tidak terjadi duplikasi request yang tidak disengaja ke query turunan (misalnya `["task"]` vs `["task", id]`).
3. **Cegah Request Latar Belakang (`refetchType: "none"`)**: Karena tab navigator dan stack screen React Native tetap tersimpan di memori (mounted), selalu tambahkan `refetchType: "none"` pada query list atau relasi agar hanya ditandai _stale_ dan tidak menembak GET otomatis saat layarnya sedang tidak dibuka.
4. **Pusatkan di Hook Mutasi**: Jangan pernah melakukan invalidasi manual `queryClient.invalidateQueries` di dalam komponen/UI; pusatkan semua logika invalidasi di dalam callback `onSuccess` mutasi terkait.

```typescript
// features/task/hooks/useTask.tsx
export const useUpdateTask = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDTO }) =>
      taskService.update({ id, data }),
    onSuccess: (data, variables) => {
      // 1. Update cache lokal secara instan
      queryClient.setQueryData<Task[]>(getTaskQueryKey(), (old) => {
        if (!old) return old;
        return old.map((t) => (t.id === variables.id ? { ...t, ...data } : t));
      });

      // 2. Invalidate dengan exact: true dan refetchType: "none"
      queryClient.invalidateQueries({
        queryKey: getTaskByIdQueryKey(variables.id),
        exact: true,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: getTaskQueryKey(),
        exact: true,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(),
        exact: true,
        refetchType: "none",
      });
    },
  });
};
```

---

## 3. Global Client State: Zustand v5

Zustand digunakan untuk state yang membutuhkan akses global, performa tinggi, dan kontrol waktu tanpa _re-render_ yang tidak perlu.

### Contoh Kasus: Pomodoro Timer Store (`features/pomodoro/stores/usePomodoroStore.ts`)

```typescript
import { create } from "zustand";

export type PomodoroMode = "work" | "shortBreak" | "longBreak";

interface PomodoroState {
  mode: PomodoroMode;
  timeLeft: number; // Dalam detik
  isRunning: boolean;
  activeTaskId: string | null;
  activeSessionId: string | null;

  // Actions
  setMode: (mode: PomodoroMode) => void;
  setTimeLeft: (seconds: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setActiveTask: (taskId: string | null) => void;
  setActiveSession: (sessionId: string | null) => void;
}

const DEFAULT_WORK_TIME = 25 * 60;
const DEFAULT_SHORT_BREAK = 5 * 60;
const DEFAULT_LONG_BREAK = 15 * 60;

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  mode: "work",
  timeLeft: DEFAULT_WORK_TIME,
  isRunning: false,
  activeTaskId: null,
  activeSessionId: null,

  setMode: (mode) => {
    let duration = DEFAULT_WORK_TIME;
    if (mode === "shortBreak") duration = DEFAULT_SHORT_BREAK;
    if (mode === "longBreak") duration = DEFAULT_LONG_BREAK;
    set({ mode, timeLeft: duration, isRunning: false });
  },

  setTimeLeft: (seconds) => set({ timeLeft: seconds }),
  startTimer: () => set({ isRunning: true }),
  pauseTimer: () => set({ isRunning: false }),
  resetTimer: () => {
    const { mode } = get();
    get().setMode(mode);
  },
  setActiveTask: (taskId) => set({ activeTaskId: taskId }),
  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
}));
```

---

## 4. Integrasi API & Axios Client (`lib/axios.ts`)

### A. Konfigurasi Interceptor Request (Injeksi Token)

Token JWT Supabase diambil dari storage/auth store dan otomatis disematkan pada setiap request:

```typescript
// lib/axios.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("supabase_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### B. Konfigurasi Interceptor Response (Error Handling Global)

```typescript
import { Toast } from "toastify-react-native";

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token expired atau unauthorized
          await SecureStore.deleteItemAsync("supabase_token");
          Toast.error("Sesi telah berakhir. Silakan login kembali.");
          break;
        case 403:
          Toast.error("Anda tidak memiliki izin untuk tindakan ini.");
          break;
        case 404:
          Toast.error(data?.message || "Data tidak ditemukan.");
          break;
        case 500:
          Toast.error("Terjadi masalah pada server. Coba beberapa saat lagi.");
          break;
        default:
          Toast.error(data?.message || "Terjadi kesalahan.");
      }
      return Promise.reject(data);
    }

    Toast.error("Koneksi jaringan terganggu.");
    return Promise.reject(error);
  },
);

export default api;
```

---

## 5. Do's and Don'ts

| ✅ DO                                                                                                             | ❌ DON'T                                                                                               |
| :---------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| Gunakan query keys factory objek yang terstruktur.                                                                | Jangan gunakan string _hardcoded_ seperti `queryKey: ['task', id]` di berbagai tempat secara acak.     |
| Invalidate query yang terdampak setelah mutasi berhasil di `onSuccess`.                                           | Jangan memanggil fungsi fetch manual di dalam `useEffect` setelah submit form.                         |
| Simpan token sensitif menggunakan `expo-secure-store`.                                                            | Jangan simpan token auth di `AsyncStorage` biasa yang tidak terenkripsi.                               |
| Pilih state terkecil yang dibutuhkan pada Zustand (`const timeLeft = usePomodoroStore(state => state.timeLeft)`). | Jangan subscribe ke seluruh store jika hanya butuh 1 variabel untuk menghindari unnecessary re-render. |
