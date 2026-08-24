# Kerjain - Backend API Service

Service backend untuk aplikasi **Kerjain** (Personal Productivity, Pomodoro Tracker, and Blocker Logger) yang dibangun dengan Express.js v5, TypeScript, Supabase, dan Zod.

---

## 🚀 Ringkasan Teknologi

- **Runtime & Bahasa**: Node.js, TypeScript (dieksekusi menggunakan `tsx` saat development)
- **Web Framework**: Express.js (v5.x)
- **Database & Autentikasi**: Supabase (`@supabase/supabase-js`)
- **Skema & Validasi Data**: Zod
- **Linter & Formatter**: Biome
- **Security & Logging**: Helmet, CORS, Morgan

---

## 📁 Struktur Direktori

```text
backend/
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

## 🛠️ Instalasi & Menjalankan Lokal

### 1. Prasyarat
- Node.js versi 18+ atau 20+
- Akun Supabase (project URL, Anon Key, dan Service Role Key)

### 2. Pemasangan Dependensi
Pastikan Anda berada di dalam folder `/backend`:
```bash
cd backend
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` ke `.env` lalu lengkapi isinya:
```bash
cp .env.example .env
```

Isi konfigurasi pada file `.env`:
```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### 4. Menjalankan Server

- **Mode Development (Hot-reload dengan TSX):**
  ```bash
  npm run dev
  ```
  Server akan aktif di `http://localhost:3000` (atau port sesuai `.env`).

- **Build TypeScript ke JavaScript:**
  ```bash
  npm run build
  ```

- **Menjalankan Production Build:**
  ```bash
  npm run start
  ```

---

## 🧹 Linting & Formatting (Biome)

Project ini menggunakan **Biome** untuk menjaga kualitas dan format kode TypeScript:

```bash
# Cek linting dan formatting sekaligus dengan auto-fix
npm run check

# Format seluruh file di src/
npm run format

# Hanya cek aturan linter
npm run lint
```

---

## 📚 Dokumentasi Lanjutan

Untuk panduan mendalam lainnya, silakan merujuk ke file dokumentasi berikut:
- **[ARCHITECTURE.md](file:///c:/project/Kerjain/backend/ARCHITECTURE.md)**: Mempelajari pola arsitektur layer, autentikasi Supabase, error handling, dan langkah membuat modul baru.
- **[API.md](file:///c:/project/Kerjain/backend/API.md)**: Katalog lengkap endpoint API, skema request Zod, format headers, dan contoh respons JSON.
