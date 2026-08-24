# Kerjain Backend - Panduan Arsitektur & Pola Modul

Dokumen ini menjelaskan struktur arsitektur, konvensi penulisan kode, penanganan error, alur autentikasi, dan pedoman pembuatan endpoint baru di backend **Kerjain**.

---

## 🏛️ Pola Arsitektur 4-Tingkat (4-Tier Layering)

Setiap fitur/domain diisolasi ke dalam direktori modul tersendiri di dalam [`src/modules/<ModuleName>/`](file:///c:/project/Kerjain/backend/src/modules). Setiap modul menerapkan pemisahan tanggung jawab (*Separation of Concerns*) dengan pola 4 layer berikut:

```
[ HTTP Request ]
       │
       ▼
1. <module>.routes.ts      ──► Menerapkan route path & middleware (auth, validate)
       │
       ▼
2. validate.middleware.ts  ──► Memvalidasi body/query/params via <module>.types.ts (Zod)
       │
       ▼
3. <module>.controller.ts  ──► Mengekstrak request (user_id, params, body) & dispatch response
       │                       (Dibalut helper catchAsync)
       ▼
4. <module>.service.ts     ──► Menjalankan logika bisnis & interaksi database Supabase
       │
       ▼
[ Supabase DB ]
```

### 1. Route Layer (`*.routes.ts`)
- Mendefinisikan endpoint Express (`Router()`).
- Mendaftarkan middleware validasi `validate(schema)` dan middleware autentikasi `authMiddleware` jika proteksi route dibutuhkan.
- Meneruskan eksekusi ke method controller yang sesuai.

### 2. Validation & Types Layer (`*.types.ts` / `*.validation.ts`)
- Menggunakan **Zod** untuk mendefinisikan schema validasi request payload (`body`, `params`, `query`).
- Meng-infer DTO (*Data Transfer Object*) dari Zod (`z.infer<typeof schema>`).
- Mendefinisikan interface TypeScript domain model (misal: `Task`, `Project`, `PomodoroSession`).

### 3. Controller Layer (`*.controller.ts`)
- Fungsi controller **selalu dibungkus dengan helper `catchAsync`** agar tidak memerlukan blok `try-catch` berulang.
- Mengambil parameter request (`req.params`), payload (`req.body`), dan identitas user yang sedang login (`req.user?.id`).
- Memanggil fungsi pada service layer.
- Mengembalikan respons HTTP seragam dengan format:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```

### 4. Service Layer (`*.service.ts`)
- Berisi seluruh logika bisnis (*business logic*) dan query ke Supabase.
- Bertanggung jawab memfilter data berdasarkan `user_id` pengguna untuk memastikan isolasi data antar pengguna.
- Melempar `AppError` jika data tidak ditemukan atau terjadi pelanggaran aturan bisnis (misal: `throw new AppError("Task not found", 404)`).

---

## 🔐 Autentikasi & Database Context

### Cara Kerja `authMiddleware`
1. Membaca header `Authorization: Bearer <access_token>`.
2. Memverifikasi token ke Supabase Auth melalui `supabase.auth.getUser(token)`.
3. Mengambil profil user terkait dari tabel `profiles` (`id`, `username`, `full_name`).
4. Menempelkan data profil user ke objek request Express: `req.user`.

### Akses Database & Isolasi User
Backend menggunakan Supabase client yang diinisialisasi dengan `SUPABASE_SERVICE_KEY`. Karena service key dapat mem-bypass Row Level Security (RLS) di level database, **Service layer wajib selalu menyertakan filter `user_id` pada setiap query**:

```typescript
// CONTOH: Mengambil task milik user tertentu saja
const { data, error } = await supabase
  .from("tasks")
  .select("*")
  .eq("user_id", userId);
```

---

## ⚠️ Standar Error Handling

Backend menggunakan centralized error handling:

1. **`AppError`** (`src/utils/AppError.ts`):
   Class turunan `Error` kustom yang membawa HTTP status code (misal: 400, 401, 403, 404).
   ```typescript
   throw new AppError("Resource tidak ditemukan", 404);
   ```

2. **`catchAsync`** (`src/utils/catchAsync.ts`):
   Higher-order function untuk membungkus fungsi async pada controller dan otomatis meneruskan error tak terduga ke `next(err)`.

3. **`errorHandler`** (`src/middlewares/error.middleware.ts`):
   Middleware global Express untuk menangani semua error yang belum tertangkap, mengembalikan format JSON seragam:
   ```json
   {
     "status": "error",
     "message": "Pesan error"
   }
   ```
   *(Stack trace otomatis disertakan hanya saat `NODE_ENV === 'development'`)*.

4. **Validasi Error (Zod)** (`src/middlewares/validate.middleware.ts`):
   Jika payload tidak valid, middleware `validate` langsung mengembalikan respons `400 Bad Request` dengan daftar field yang bermasalah tanpa masuk ke global error handler:
   ```json
   {
     "status": "error",
     "message": "Data tidak valid",
     "errors": [
       { "field": "title", "message": "Title is required" }
     ]
   }
   ```

---

## 📋 Checklist / Langkah Membuat Modul Baru

Saat menambahkan modul baru (misalnya `Habits`):

1. **Buat Folder Modul**: `src/modules/Habits/`
2. **Definisikan Types & Zod Schema** (`habit.types.ts`):
   - Buat schema untuk create/update (`createHabitSchema`, `updateHabitSchema`).
   - Ekspor DTO types dan Model interface `Habit`.
3. **Buat Service Layer** (`habit.service.ts`):
   - Implementasikan method CRUD (`getAll`, `getById`, `create`, `update`, `delete`).
   - Pastikan setiap query menyertakan `user_id`.
4. **Buat Controller Layer** (`habit.controller.ts`):
   - Bungkus setiap method dengan `catchAsync`.
   - Ambil `req.user.id`, teruskan ke service, kembalikan response JSON `{ status: "success", data: ... }`.
5. **Buat Route Layer** (`habit.routes.ts`):
   - Daftarkan method controller dan middleware `validate(...)`.
6. **Registrasikan Route ke Entrypoint** (`src/index.ts`):
   - Tambahkan `app.use("/habits", authMiddleware, habitRoutes);`.
7. **Perbarui Dokumentasi** di [`backend/API.md`](file:///c:/project/Kerjain/backend/API.md).
