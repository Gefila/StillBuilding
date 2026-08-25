# StillBuilding - Backend API Service

Service backend untuk aplikasi **StillBuilding** (Personal Productivity, Pomodoro Tracker, and Blocker Logger) yang dibangun dengan Express.js v5, TypeScript, Supabase, and Zod.

---

## 🚀 Ringkasan Teknologi

- **Runtime & Bahasa**: Node.js, TypeScript (dieksekusi menggunakan `tsx` saat development)
- **Web Framework**: Express.js (v5.x)
- **Database & Autentikasi**: Supabase (`@supabase/supabase-js`)
- **Skema & Validasi Data**: Zod (`@stillbuilding/types`)
- **Linter & Formatter**: Biome
- **Security & Logging**: Helmet, CORS, Morgan

---

## 📁 Struktur Direktori

```text
apps/api/
├── src/
│   ├── config/             # Inisialisasi klien eksternal (Supabase, dsb.)
│   ├── middlewares/        # Express middlewares (auth, validasi Zod, error handling)
│   ├── modules/            # Modular domain logic
│   │   ├── Auth/           # Autentikasi (login, register, refresh-token, me)
│   │   ├── Projects/       # Manajemen project & target
│   │   ├── Tasks/          # Manajemen task & todo
│   │   ├── Pomodoro-sessions/ # Sesi interval fokus & istirahat
│   │   └── Blocker-logs/   # Pencatatan friksi & distraksi
│   ├── utils/              # Helper utilitas (AppError, catchAsync)
│   └── index.ts            # Entrypoint Express server & route registration
├── biome.json              # Konfigurasi linter & formatter Biome
├── package.json            # Daftar dependencies & npm scripts
├── tsconfig.json           # Konfigurasi compiler TypeScript
├── README.md               # Panduan setup & gambaran umum (File ini)
├── ARCHITECTURE.md         # Pola arsitektur, konvensi kode, & panduan modul baru
└── API.md                  # Katalog spesifikasi endpoint, payload, & response
```

---

## 🛠️ Menjalankan Layanan

### 1. Prasyarat

- Node.js versi 18+ atau 20+
- pnpm 9+
- Akun Supabase (project URL, Anon Key, dan Service Role Key)

### 2. Konfigurasi Environment Variables

Salin file `.env.example` ke `.env` di dalam `apps/api/` lalu lengkapi isinya:

```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### 3. Menjalankan Server (dari Root Monorepo)

- **Mode Development (Hot-reload dengan TSX):**

  ```bash
  pnpm --filter @stillbuilding/api dev
  ```

  Server akan aktif di `http://localhost:3000` (atau port sesuai `.env`).

- **Build TypeScript ke JavaScript:**
  ```bash
  pnpm --filter @stillbuilding/api build
  ```

---

## 🧹 Linting & Formatting (Biome)

Workspace ini menggunakan **Biome** untuk menjaga kualitas dan format kode TypeScript:

```bash
# Cek linting dan formatting sekaligus dengan auto-fix
pnpm --filter @stillbuilding/api check

# Format seluruh file di src/
pnpm --filter @stillbuilding/api format

# Hanya cek aturan linter
pnpm --filter @stillbuilding/api lint
```

---

## 📚 Dokumentasi Lanjutan

Untuk panduan mendalam lainnya, silakan merujuk ke file dokumentasi berikut:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Mempelajari pola arsitektur layer, autentikasi Supabase, error handling, dan langkah membuat modul baru.
- **[API.md](./API.md)**: Katalog lengkap endpoint API, skema request Zod, format headers, dan contoh respons JSON.
