# Changelog

Semua perubahan penting pada StillBuilding didokumentasikan dalam dokumen ini.
Format ini mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.0.0/) dan proyek ini mematuhi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-10-20

### Ditambahkan

- **Integrasi StillBuilding AI Agent via MCP**: Dukungan integrasi Model Context Protocol (MCP) untuk automasi manajemen tugas, log blocker, dan sesi Pomodoro.
- **Vibe Mode di Zen Desk**: Fitur pemutar video YouTube ambient terintegrasi di ZenDeskModal dengan rasio 16:9, kontrol landscape, dan tap-outside minimize.

### Ditingkatkan

- **Kontrol Landscape Pomodoro**: Desain tombol icon-only yang lebih bersih dan penempatan konsisten untuk Zen Desk & Vibe Mode.
- **Tampilan Catatan Rilis di Aplikasi**: Pengguna kini dapat membaca riwayat pembaruan langsung dari menu Profil > Tentang Aplikasi.

### Diperbaiki

- **Siklus Sesi Pomodoro**: Koordinasi penyelesaian sesi fokus dan pencegahan cascading renders pada komponen ZenDeskModal.

---

## [1.2.0] - 2026-10-15

### Ditambahkan

- **Pencatatan Blocker Cepat**: Quick Blocker Logging langsung dari timer fokus ketika alur kerja terhambat.
- **Activity Heatmap Mingguan**: Visualisasi tingkat fokus dan intensitas kerja pada halaman statistik.

### Ditingkatkan

- **Caching & Offline Resilience**: Peningkatan caching TanStack Query untuk pemuatan data proyek dan tugas.

### Diperbaiki

- **Zona Waktu & Streak Celebration**: Penyesuaian deteksi zona waktu dan perbaikan visibilitas modal selebrasi streak pada build release.

---

## [1.1.0] - 2026-10-05

### Ditambahkan

- **Perpustakaan Audio Ambient**: Suara Rain, Lo-Fi, Cafe, Forest, dan White Noise dengan kontrol volume independen saat fokus.
- **Zen Desk Mode**: Mode fokus layar penuh bebas distraksi.

### Ditingkatkan

- **Kategorisasi & Tag Proyek**: Pengelompokan proyek dengan pilihan palet warna dan ikon yang lebih variatif.

### Diperbaiki

- **Transisi Modal**: Menghilangkan glitch kedipan layar pada transisi modal di perangkat Android.

---

## [1.0.0] - 2026-10-01

### Ditambahkan

- Rilis awal StillBuilding untuk Web & Mobile (Android / iOS).
- Manajemen tugas dengan status, prioritas, dan filter.
- Timer Pomodoro dengan interval standar dan kustom.
- Autentikasi aman JWT dengan penyimpanan terenkripsi Expo SecureStore.
- Sistem Desain Minimalist High-Contrast (Linear / Notion Style).
