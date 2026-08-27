import type { Task } from "../modules/Tasks/task.types";

/**
 * Mengurutkan data tasks secara terstruktur:
 * 1. Status: Active (paling atas) -> Pending -> Done (paling bawah)
 * 2. Prioritas (untuk task belum selesai): High -> Medium -> Low
 * 3. Waktu: Terbaru di atas (created_at / completed_at DESC)
 */
export const sortTasks = (tasks: Task[]): Task[] => {
  const statusWeight: Record<string, number> = {
    Active: 3,
    active: 3,
    Pending: 2,
    pending: 2,
    Done: 1,
    done: 1,
  };

  const priorityWeight: Record<string, number> = {
    High: 3,
    high: 3,
    Medium: 2,
    medium: 2,
    Low: 1,
    low: 1,
  };

  return [...tasks].sort((a, b) => {
    // 1. Urutkan berdasarkan Status (Active > Pending > Done)
    const weightStatusA = statusWeight[a.status || "Pending"] ?? 2;
    const weightStatusB = statusWeight[b.status || "Pending"] ?? 2;
    if (weightStatusA !== weightStatusB) {
      return weightStatusB - weightStatusA;
    }

    // 2. Jika status sama dan belum Done, urutkan berdasarkan Prioritas (High > Medium > Low)
    if (a.status !== "Done" && b.status !== "Done") {
      const weightPriorityA = priorityWeight[a.priority || "Medium"] ?? 2;
      const weightPriorityB = priorityWeight[b.priority || "Medium"] ?? 2;
      if (weightPriorityA !== weightPriorityB) {
        return weightPriorityB - weightPriorityA;
      }
    }

    // 3. Untuk task yang sudah Done, urutkan berdasarkan waktu selesai terbaru (completed_at desc)
    if (a.status === "Done" && b.status === "Done") {
      const dateA = a.completed_at || a.created_at;
      const dateB = b.completed_at || b.created_at;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    }

    // 4. Default: Urutkan berdasarkan waktu pembuatan terbaru (created_at desc)
    return (
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
    );
  });
};
