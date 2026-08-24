# Kerjain - Frontend App 📱

Aplikasi mobile productivity & deep-work companion untuk mengelola tugas, proyek, pomodoro tracker, dan pencatatan hambatan (blocker logger). Dibangun menggunakan **React Native**, **Expo**, **Expo Router**, **NativeWind**, **TanStack Query**, dan **Zustand**.

---

## 📚 Daftar Dokumentasi Teknis

Untuk memastikan pengembangan tetap konsisten, terstruktur, dan mudah dipahami, dokumentasi frontend dibagi menjadi beberapa modul:

- 🏛️ **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Struktur direktori, pemisahan tanggung jawab (*Separation of Concerns*), dan panduan membuat fitur baru (*feature-driven architecture*).
- 📱 **[SCREENS.md](./SCREENS.md)**: Katalog dan spesifikasi fungsional setiap layar (komponen visual, data/hooks yang dipanggil, aksi pengguna, dan alur navigasi).
- 🔄 **[STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)**: Panduan manajemen server state (TanStack Query v5), client state (Zustand v5), serta integrasi API Axios dan Supabase Auth.
- 🎨 **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)**: Standar styling NativeWind (Tailwind CSS), token warna semantik (`global.css`), tipografi, dan komponen UI atomik reusable.
- 🧭 **[ROUTING.md](./ROUTING.md)**: Arsitektur navigasi berbasis berkas (*file-based routing*) Expo Router, hierarki stack/tab, route params, dan modal screens.

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | [Expo SDK 54](https://expo.dev) + [React Native 0.81](https://reactnative.dev) | Framework cross-platform universal app |
| **Routing** | [Expo Router v6](https://docs.expo.dev/router/introduction/) | File-based routing navigation |
| **Styling** | [NativeWind v5](https://www.nativewind.dev) + [Tailwind CSS v4](https://tailwindcss.com) | Utility-first CSS untuk React Native |
| **Server State** | [TanStack Query v5](https://tanstack.com/query/latest) | Data fetching, caching, optimistik update, & cache invalidation |
| **Client State** | [Zustand v5](https://zustand-demo.pmnd.rs) | State lokal reaktif (Pomodoro timer, active session, filter UI) |
| **Form & Validasi** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | Manajemen form efisien dengan skema validasi tipe ketat |
| **HTTP Client** | [Axios](https://axios-http.com) | HTTP client dengan interceptor token auth & penanganan error global |
| **Secure Storage** | [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/) | Penyimpanan credential/token terenkripsi pada perangkat |
| **UI Icons & Fonts** | `@expo/vector-icons`, `expo-font`, `expo-symbols` | Icon pack bawaan Expo dan font kustom |

---

## 🚀 Memulai Pengembangan (*Getting Started*)

### 1. Prasyarat (*Prerequisites*)
- **Node.js**: versi `>= 20.x`
- **npm** atau **yarn**
- **Expo Go App** (opsional untuk testing di perangkat fisik) atau **Android Studio / Xcode Emulator**
- Backend Kerjain yang sudah berjalan (lihat `../backend/README.md`)

### 2. Instalasi Dependensi
Pastikan terminal berada di folder `/frontend`:
```bash
cd frontend
npm install
```

### 3. Konfigurasi Environment Variables
Salin file konfigurasi lingkungan atau buat file `.env` di root folder `frontend/`:
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```
> [!TIP]
> Jika menguji pada perangkat fisik Android/iOS melalui jaringan lokal (LAN), ubah `localhost` menjadi alamat IP komputer Anda (contoh: `http://192.168.1.10:5000/api`).

### 4. Menjalankan Aplikasi
Jalankan dev server Expo:
```bash
# Menjalankan Metro Bundler
npm run start
# atau
npx expo start
```

Opsi shortcut platform di terminal:
- Tekan `a` untuk membuka di **Android Emulator**
- Tekan `i` untuk membuka di **iOS Simulator**
- Tekan `w` untuk membuka di **Web Browser**
- Scan QR code menggunakan aplikasi **Expo Go** untuk perangkat fisik

---

## 📜 Script NPM yang Tersedia

| Command | Fungsi |
| :--- | :--- |
| `npm run start` | Menjalankan Expo development bundler |
| `npm run android` | Menjalankan aplikasi langsung pada Android target |
| `npm run ios` | Menjalankan aplikasi langsung pada iOS simulator |
| `npm run web` | Menjalankan aplikasi pada browser web |
| `npm run lint` | Menjalankan pengecekan linter Expo / ESLint |

---

## 📁 Struktur Direktori Singkat

```
frontend/
├── app/                  # File-based routes (Expo Router)
│   ├── (auth)/           # Route autentikasi (login, register)
│   ├── (tabs)/           # Bottom tab bar utama (home, projects, profile)
│   ├── pomodoro/         # Screen sesi fokus Pomodoro
│   ├── project/          # Screen detail & form project
│   ├── task/             # Screen detail & form task
│   └── _layout.tsx       # Root layout provider
├── assets/               # File statis gambar, ikon, dan splash screen
├── components/           # Reusable atomic UI components (Button, FormField, dll)
├── features/             # Feature-driven modules (pomodoro, project, task)
│   └── <feature>/
│       ├── components/   # Komponen spesifik domain fitur
│       ├── hooks/        # React Query hooks (useQuery, useMutation)
│       ├── services/     # API caller functions (Axios)
│       └── types/        # TypeScript interface / types fitur
├── lib/                  # Client setup (axios instance, reactQuery client)
├── utils/                # Helper functions umum (format tanggal, durasi, dll)
└── global.css            # Desain token & tema warna NativeWind/Tailwind
```

---

## 💡 Best Practices

1. **Selalu gunakan strongly typed interfaces** untuk model data (Task, Project, PomodoroSession). Hindari penggunaan tipe `any`.
2. **Pisahkan logic API dan UI**: Komponen hanya bertugas merender UI dan memanggil hook dari folder `features/<feature>/hooks/`.
3. **Patuhi konvensi token warna di `global.css`**: Gunakan class seperti `bg-surface`, `text-foreground`, `text-primary`, `bg-status-active` agar konsisten di seluruh aplikasi.
4. **Invalidasi cache secara tepat**: Setiap mutasi (create/update/delete) harus menginvalisasi query key yang relevan melalui `queryClient.invalidateQueries`.
