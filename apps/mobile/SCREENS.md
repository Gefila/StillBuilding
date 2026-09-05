# Katalog & Spesifikasi Layar (_Screens Specification_)

Dokumen ini berisi spesifikasi fungsional seluruh layar (_screens_) pada aplikasi StillBuilding Frontend, termasuk komponen yang digunakan, state/hook yang dipanggil, aksi pengguna (_user actions_), dan alur navigasinya.

---

## 1. Peta Ringkasan Layar (_Screens Overview Matrix_)

| Route Path                | Nama Layar                     | Deskripsi Singkat                                 | Layout / Mode      |
| :------------------------ | :----------------------------- | :------------------------------------------------ | :----------------- |
| `app/(auth)/login.tsx`    | **Masuk Akun**                 | Form login dengan email & kata sandi              | Stack (Auth Guard) |
| `app/(auth)/register.tsx` | **Daftar Akun**                | Form pendaftaran akun pengguna baru               | Stack (Auth Guard) |
| `app/(tabs)/home.tsx`     | **Beranda / Dashboard**        | Ringkasan harian, task aktif, & shortcut fokus    | Bottom Tab 1       |
| `app/(tabs)/projects.tsx` | **Daftar Proyek**              | List & filter proyek, progress tracking           | Bottom Tab 2       |
| `app/(tabs)/focus.tsx`    | **Fokus (Pomodoro & Blocker)** | Sesi fokus mandiri / task timer & blocker log     | Bottom Tab 3       |
| `app/(tabs)/profile.tsx`  | **Profil & Statistik**         | Statistik fokus, pengaturan akun, & logout        | Bottom Tab 4       |
| `app/pomodoro/index.tsx`  | **Pomodoro Timer & Blocker**   | Timer interval fokus, pemilih task, blocker modal | Stack Screen       |
| `app/task/[id].tsx`       | **Detail Tugas**               | Detail status task, riwayat sesi fokus, catatan   | Dynamic Stack      |
| `app/task/create.tsx`     | **Tambah Tugas**               | Form pembuatan task baru & assign ke project      | Modal Sheet        |
| `app/task/edit.tsx`       | **Edit Tugas**                 | Form pembaruan judul, prioritas, & deadline       | Stack / Modal      |
| `app/project/[id].tsx`    | **Detail Proyek**              | Info proyek, progres, & daftar task terkait       | Dynamic Stack      |
| `app/project/create.tsx`  | **Tambah Proyek**              | Form pembuatan project baru & pilihan warna/icon  | Modal Sheet        |
| `app/project/edit.tsx`    | **Edit Proyek**                | Form pembaruan nama & deskripsi proyek            | Stack / Modal      |
| `app/profile/support.tsx` | **Bantuan & Dukungan**         | Pusat FAQ, tips deep work, & kontak tim           | Stack Screen       |
| `app/profile/about.tsx`   | **Tentang Aplikasi**           | Filosofi produk, tech stack, legal, & versi       | Stack Screen       |

---

## 2. Spesifikasi Rinci Setiap Layar

### 🏠 Tab Utama: Beranda (`app/(tabs)/home.tsx`)

- **Tujuan**: Dashboard harian tempat user melihat ringkasan tugas hari ini, memulai fokus cepat, dan memantau progres.
- **Komponen Utama**:
  - `HeaderGreeting`: Salam pembuka & avatar profil.
  - `DailyFocusSummaryCard`: Kartu ringkasan jumlah menit fokus hari ini dan sesi yang tuntas.
  - `ActiveTaskBanner`: Banner tugas yang sedang berjalan dengan tombol cepat ke Pomodoro.
  - `TasksList` (`components/tasks/Tasks.tsx`): Daftar tugas yang harus dikerjakan hari ini dengan checkbox instan.
- **Hooks & State**:
  - `useTasks({ status: 'pending' })` (TanStack Query)
  - `usePomodoroStore` (Zustand: mengecek apakah ada timer aktif)
- **Aksi Pengguna (_User Actions_)**:
  - Tap card task ➡️ Navigasi ke `app/task/[id].tsx`.
  - Toggle checkbox task ➡️ Menandai task menjadi `Done`.
  - Tap tombol "Mulai Fokus" ➡️ Navigasi ke `app/pomodoro/index.tsx`.
- **Navigasi Masuk/Keluar**:
  - _Entry_: Default tab setelah login.
  - _Exit_: Push ke `/task/[id]`, `/pomodoro`, `/task/create`.

---

### 📁 Tab Utama: Daftar Proyek (`app/(tabs)/projects.tsx`)

- **Tujuan**: Mengorganisir dan memantau seluruh proyek yang sedang berjalan maupun yang telah selesai.
- **Komponen Utama**:
  - `SearchAndFilterBar`: Input pencarian proyek & filter status (_All, Active, Completed_).
  - `ProjectCard`: Kartu proyek yang menampilkan nama, warna kategori/ikon, jumlah task, dan progress bar persentase penyelesaian.
  - `FloatingActionButton (FAB)`: Tombol tambah proyek baru.
- **Hooks & State**:
  - `useProjects()` (TanStack Query)
- **Aksi Pengguna (_User Actions_)**:
  - Tap `ProjectCard` ➡️ Buka detail proyek di `app/project/[id].tsx`.
  - Tap tombol FAB `+` ➡️ Buka modal pembuatan proyek di `app/project/create.tsx`.
- **Navigasi Masuk/Keluar**:
  - _Entry_: Tab bar navigasi "Proyek".
  - _Exit_: Push ke `/project/[id]`, modal `/project/create`.

---

### 👤 Tab Utama: Profil & Statistik (`app/(tabs)/profile.tsx`)

- **Tujuan**: Menampilkan ringkasan pencapaian produktivitas pengguna, pengaturan aplikasi, dan opsi akun.
- **Komponen Utama**:
  - `UserProfileCard`: Foto profil, nama pengguna, email, dan badge status.
  - `FocusAnalyticsChart`: Grafik statistik total jam fokus mingguan dan rata-rata harian.
  - `BlockerSummaryCard`: Ringkasan blocker paling sering ditemui (distraksi internal/eksternal).
  - `SettingsList`: Menu ganti tema, preferensi durasi Pomodoro default, dan tombol Keluar (Logout).
- **Hooks & State**:
  - `useUserProfile()`
  - `useFocusStats()`
  - `useAuthStore` (Aksi `logout()`)
- **Aksi Pengguna (_User Actions_)**:
  - Ubah durasi timer kerja / istirahat default.
  - Tap tombol "Logout" ➡️ Hapus token secure store & redirect ke `/(auth)/login`.

---

### ⏱️ Pomodoro Tracker & Blocker (`app/pomodoro/index.tsx`)

- **Tujuan**: Layar deep-work untuk menjalankan interval fokus (25m kerja / 5m istirahat) dan mencatat blocker secara real-time.
- **Komponen Utama**:
  - `ActiveTaskHeader`: Menampilkan judul task yang sedang difokuskan.
  - `PomodoroTimer` (`features/pomodoro/components/PomodoroTimer.tsx`): Tampilan jam digital countdown melingkar.
  - `TimerControls`: Tombol Mulai (_Start_), Jeda (_Pause_), dan Reset (_Reset_).
  - `ModeSelector`: Pilihan mode Fokus (Work), Istirahat Singkat (_Short Break_), dan Istirahat Panjang (_Long Break_).
  - `BlockerModal` / `BlockerLogger`: Tombol & popup cepat untuk mencatat hambatan yang menginterupsi sesi fokus.
  - `MarkAsCompleteButton`: Tombol untuk langsung menyelesaikan task setelah sesi tuntas.
- **Hooks & State**:
  - `useLocalSearchParams<{ id?: string }>()` (Task ID jika dijalankan dari task tertentu).
  - `useGetTaskById({ id })`
  - `usePomodoroStore` (Zustand: timer countdown, status running).
  - `useCreatePomodoroSession` & `useCreateBlocker` (Mutations).
- **Aksi Pengguna (_User Actions_)**:
  - Start / Pause / Reset countdown timer.
  - Tap "Catat Blocker" saat terdistraksi ➡️ Input deskripsi blocker tanpa mematikan timer.
  - Selesaikan sesi ➡️ Menyimpan session log ke Supabase dan invalidasi cache task detail.

---

### 📝 Detail Tugas (`app/task/[id].tsx`)

- **Tujuan**: Menampilkan rincian lengkap tugas, catatan instruksi, batas waktu, dan riwayat sesi fokus yang pernah dilakukan untuk tugas ini.
- **Komponen Utama**:
  - `TaskStatusBanner`: Indikator status (_Pending / In Progress / Done_) dengan tombol toggle status.
  - `TaskTitleCard`: Judul tugas dan badge proyek terkait.
  - `InfoGrid`: Kartu prioritas (_Tinggi, Sedang, Rendah_) dan tanggal deadline.
  - `NotesSection`: Catatan atau instruksi kerja tugas.
  - `PomodoroStats`: Statistik total sesi fokus yang dihabiskan untuk task ini beserta daftar riwayat waktu per sesi.
  - `TaskActionButtons`: Tombol "Mulai Fokus", "Edit", dan "Hapus".
- **Hooks & State**:
  - `useLocalSearchParams<{ id: string }>()`
  - `useGetTaskById({ id })`
  - `useUpdateTask()` & `useDeleteTask()`
- **Aksi Pengguna (_User Actions_)**:
  - Tap "Mulai Fokus" ➡️ Navigasi ke `app/pomodoro/index.tsx?id={taskId}`.
  - Tap "Edit" ➡️ Navigasi ke `app/task/edit.tsx?id={taskId}`.
  - Tap "Hapus" ➡️ Konfirmasi alert lalu hapus task dan kembali ke halaman sebelumnya.

---

### ➕ Tambah & Edit Tugas (`app/task/create.tsx` & `app/task/edit.tsx`)

- **Tujuan**: Form input untuk menambahkan tugas baru atau memperbarui data tugas yang sudah ada.
- **Komponen Utama**:
  - `FormField`: Input judul tugas (wajib) dan catatan tambahan.
  - `ProjectSelector`: Dropdown pemilihan proyek induk.
  - `PriorityPicker`: Pilihan prioritas (_Tinggi, Sedang, Rendah_).
  - `DatePicker`: Pemilih tanggal deadline tugas.
  - `Button`: Tombol submit dengan status loading.
- **Hooks & State**:
  - `useForm` + `zodResolver` (Validasi skema form).
  - `useCreateTask()` / `useUpdateTask()` (Mutations).
- **Aksi Pengguna (_User Actions_)**:
  - Isi form dan submit ➡️ Validasi payload, simpan ke database, invalidasi cache list task, dan auto-close modal (`router.back()`).

---

### 📂 Detail Proyek (`app/project/[id].tsx`)

- **Tujuan**: Memantau progress suatu proyek, melihat daftar tugas di dalamnya, dan memfilter tugas berdasarkan status.
- **Komponen Utama**:
  - `ProjectHeader`: Nama proyek, ikon, warna, dan deskripsi proyek.
  - `ProjectProgressBar`: Indikator persentase tugas selesai (misal: 6/10 selesai - 60%).
  - `ProjectTaskList`: Daftar task yang berelasi dengan project ID ini.
  - `TaskFilterTabs`: Filter task dalam proyek (_Semua, Pending, Selesai_).
  - `AddTaskInlineButton`: Tombol cepat tambah task langsung terikat ke proyek ini.
- **Hooks & State**:
  - `useLocalSearchParams<{ id: string }>()`
  - `useProjectDetail(id)`
  - `useTasks({ projectId: id })`
- **Aksi Pengguna (_User Actions_)**:
  - Tap task di list ➡️ Buka detail task `app/task/[id].tsx`.
  - Tap tombol "Edit Proyek" ➡️ Buka form edit `app/project/edit.tsx`.

---

### 🔐 Autentikasi (`app/(auth)/login.tsx` & `app/(auth)/register.tsx`)

- **Tujuan**: Layar onboarding dan otentikasi akun pengguna menggunakan Supabase Auth.
- **Komponen Utama**:
  - `BrandLogoHeader`: Logo dan tagline StillBuilding.
  - `FormField`: Input email dan password dengan toggle visibilitas password.
  - `Button`: Tombol submit "Masuk" / "Daftar".
  - `SocialLoginButton`: Opsi login via Google OAuth (opsional).
  - `AuthSwitchLink`: Navigasi beralih antara layar Login dan Register.
- **Hooks & State**:
  - `useForm` + `zodResolver`
  - `useAuthStore` / Supabase auth SDK.
- **Aksi Pengguna (_User Actions_)**:
  - Submit form login ➡️ Mendapatkan Supabase JWT token, menyimpan ke `expo-secure-store`, dan mengganti rute ke `/(tabs)/home`.

---

### 💬 Bantuan & Dukungan (`app/profile/support.tsx`)

- **Tujuan**: Pusat bantuan terpadu untuk solusi masalah, panduan teknik fokus, direktori tanya-jawab (FAQ), dan kanal komunikasi tim pengembang.
- **Komponen Utama**:
  - `ScreenHeader`: Header halaman dengan tombol kembali ke tab profil.
  - `SearchBar`: Input pencarian real-time untuk menyaring pertanyaan FAQ secara dinamis.
  - `CategoryFilterPills`: Filter kategori (Semua, Pomodoro, Blocker, Proyek & Tugas, Akun).
  - `TipsDeepWorkCard`: Kartu wawasan cepat seputar penanganan distraksi dan pencatatan blocker.
  - `SupportFAQCard`: Komponen accordion interaktif untuk tanya-jawab seputar fitur StillBuilding.
  - `SupportContactCard`: Pilihan kanal email dukungan, tautan dokumentasi web, dan tombol pemicu form masukan.
  - `FeedbackModal`: Modal form pengiriman laporan bug, saran fitur, atau pertanyaan akun dengan feedback haptic dan Toast konfirmasi.
  - `SystemStatusBadge`: Indikator status layanan (online/normal) dan informasi versi aplikasi.
- **Hooks & State**:
  - `useCurrentUser()` & `useAuthStore` (Data profil dan email pelapor).
  - State lokal: `searchQuery`, `selectedCategory`, `isFeedbackModalVisible`.
- **Aksi Pengguna (_User Actions_)**:
  - Mengetik di search bar ➡️ Memfilter daftar FAQ secara real-time.
  - Tap salah satu pill kategori ➡️ Menyaring FAQ sesuai kategori terpilih.
  - Tap pertanyaan FAQ ➡️ Expand / collapse jawaban terkait.
  - Tap kanal email ➡️ Membuka aplikasi mail klien dengan template subjek.
  - Tap "Kirim Masukan atau Lapor Bug" ➡️ Membuka `FeedbackModal`, mengisi kategori, subjek, detail pesan, lalu submit.

---

### ℹ️ Tentang Aplikasi (`app/profile/about.tsx`)

- **Tujuan**: Menampilkan identitas resmi StillBuilding, nilai filosofi produk ("Langkah Semut" & mikro-tasking), transparansi stack teknologi monorepo, opsi pembaruan aplikasi, serta akses dokumen kebijakan privasi dan ketentuan layanan.
- **Komponen Utama**:
  - `ScreenHeader`: Header halaman dengan judul "Tentang Aplikasi" dan tombol kembali ke Profil.
  - `AboutHeroCard`: Badge ikon kilat (`flash`), judul produk, versi rilis `v1.0.0 (Build 42)`, dan pernyataan misi.
  - `CorePrinciplesCard`: 4 pilar inti filosofi kerja rendah friksi StillBuilding.
  - `TechStackCard`: Rincian arsitektur teknologi frontend, state management, dan backend API.
  - `LegalLinksCard`: Menu aksi periksa pembaruan, tautan repositori GitHub resmi, serta pembuka modal kebijakan privasi dan syarat ketentuan.
  - `LegalModal`: Modal pembaca teks resmi Kebijakan Privasi & Syarat Ketentuan Layanan.
- **Hooks & State**:
  - State lokal: `isCheckingUpdate`, `legalModalType` (`privacy` | `terms` | `null`).
- **Aksi Pengguna (_User Actions_)**:
  - Tap "Periksa Pembaruan" ➡️ Memverifikasi integritas versi dan memicu Toast sukses.
  - Tap "Kebijakan Privasi" / "Syarat & Ketentuan" ➡️ Membuka `LegalModal` dengan konten relevan.
  - Tap "Repositori GitHub" ➡️ Membuka tautan repositori daring melalui peramban tersemat.
