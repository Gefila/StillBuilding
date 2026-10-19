export type ChangeType = "added" | "improved" | "fixed";

export interface ChangeItem {
  type: ChangeType;
  text: string;
}

export interface ReleaseLog {
  version: string;
  releaseDate: string;
  isLatest?: boolean;
  summary: string;
  changes: ChangeItem[];
}

export const APP_CHANGELOGS: ReleaseLog[] = [
  {
    version: "1.3.0",
    releaseDate: "20 Oktober 2026",
    isLatest: true,
    summary: "Integrasi AI Agent MCP & Penyempurnaan Mode Zen Desk",
    changes: [
      {
        type: "added",
        text: "Integrasi AI Agent StillBuilding via Model Context Protocol (MCP) untuk automasi task dan sinkronisasi sesi.",
      },
      {
        type: "added",
        text: "Fitur Vibe Mode dengan pemutar video ambient YouTube di ZenDeskModal (rasio 16:9, tap-outside minimize, & landscape controls).",
      },
      {
        type: "improved",
        text: "Penyempurnaan tombol header landscape dengan icon-only yang lebih bersih dan penempatan konsisten Zen/Vibe.",
      },
      {
        type: "fixed",
        text: "Memperbaiki masalah koordinasi penyelesaian sesi Pomodoro dan mencegah cascading renders.",
      },
    ],
  },
  {
    version: "1.2.0",
    releaseDate: "15 Oktober 2026",
    summary: "Pencatatan Hambatan (Blocker Logger) & Analitik Produktivitas",
    changes: [
      {
        type: "added",
        text: "Fitur Quick Blocker Logging langsung dari timer Pomodoro saat fokus terhambat.",
      },
      {
        type: "added",
        text: "Visualisasi Activity Heatmap mingguan pada dashboard statistik.",
      },
      {
        type: "fixed",
        text: "Perbaikan deteksi zona waktu dan visibilitas Streak Celebration modal pada rilis produksi.",
      },
      {
        type: "improved",
        text: "Optimasi sistem caching TanStack Query untuk pemuatan data proyek dan tugas secara offline-ready.",
      },
    ],
  },
  {
    version: "1.1.0",
    releaseDate: "5 Oktober 2026",
    summary: "Audio Ambient Pomodoro & Layar Penuh Zen Desk",
    changes: [
      {
        type: "added",
        text: "Perpustakaan suara latar ambient (Rain, Lo-Fi, Cafe, Forest, White Noise) dengan kontrol volume independen.",
      },
      {
        type: "added",
        text: "Mode Zen Desk layar penuh untuk pengalaman deep work tanpa distraksi notifikasi.",
      },
      {
        type: "improved",
        text: "Kategorisasi proyek dengan label warna dan seleksi icon yang lebih intuitif.",
      },
      {
        type: "fixed",
        text: "Perbaikan glitch transisi modal pada perangkat Android saat orientasi landscape.",
      },
    ],
  },
  {
    version: "1.0.0",
    releaseDate: "1 Oktober 2026",
    summary: "Rilis Awal StillBuilding",
    changes: [
      {
        type: "added",
        text: "Manajemen tugas fokus dengan prioritas, status, dan estimasi waktu.",
      },
      {
        type: "added",
        text: "Timer Pomodoro dengan interval fleksibel (fokus, istirahat pendek, istirahat panjang).",
      },
      {
        type: "added",
        text: "Autentikasi aman JWT dengan penyimpanan terenkripsi Expo SecureStore.",
      },
      {
        type: "added",
        text: "Sistem desain Minimalist High-Contrast yang nyaman untuk sesi kerja panjang.",
      },
    ],
  },
];
