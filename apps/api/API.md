# Kerjain Backend - Spesifikasi & Katalog API

Dokumentasi seluruh endpoint API backend Kerjain, skema request payload, headers, parameter URL, dan contoh respons JSON.

---

## 🌐 Informasi Umum

- **Base URL Lokal**: `http://localhost:3000`
- **Format Data**: JSON (`Content-Type: application/json`)

### Header Autentikasi
Sebagian besar endpoint dilindungi oleh `authMiddleware`. Klien wajib mengirimkan access token Supabase pada header:
```http
Authorization: Bearer <access_token>
```

---

## 📦 Standar Format Respons

### 1. Respons Berhasil (200 OK / 201 Created)
```json
{
  "status": "success",
  "data": { ... }
}
```
*(Atau menyertakan field `"message"` untuk aksi seperti register/logout)*

### 2. Respons Error Validasi Payload (400 Bad Request)
```json
{
  "status": "error",
  "message": "Data tidak valid",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### 3. Respons Error Autentikasi / Not Found / Server Error (401 / 404 / 500)
```json
{
  "status": "error",
  "message": "Unauthorized: Invalid or expired token"
}
```

---

## 📑 Daftar Endpoint

### 1. Auth Module (`/auth`)

#### `POST /auth/register`
Mendaftarkan pengguna baru ke Supabase Auth.
- **Auth**: Publik
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "User registered successfully"
  }
  ```

#### `POST /auth/login`
Autentikasi email dan password untuk mendapatkan JWT token.
- **Auth**: Publik
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "User logged in successfully",
    "data": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "v1.Mrq...",
      "expiresIn": 3600,
      "user": {
        "id": "c88f98a2-...",
        "email": "user@example.com",
        "username": "user",
        "name": "user",
        "avatar": "https://ui-avatars.com/api/?name=user",
        "current_strike": 3,
        "longest_streak": 7,
        "last_streak_date": "2026-08-15"
      }
    }
  }
  ```

#### `POST /auth/refresh-token`
Memperbarui access token menggunakan refresh token.
- **Auth**: Publik
- **Request Body**:
  ```json
  {
    "refresh_token": "v1.Mrq..."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Token refreshed successfully",
    "data": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "v1.Mrq...",
      "expiresIn": 3600
    }
  }
  ```

#### `GET /auth/me`
Mengambil data profil pengguna yang sedang login.
- **Auth**: Wajib (`Bearer <token>`)
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "c88f98a2-...",
      "username": "johndoe",
      "full_name": "John Doe",
      "avatar": "https://ui-avatars.com/...",
      "current_strike": 3,
      "longest_streak": 7,
      "last_streak_date": "2026-08-15"
    }
  }
  ```

#### `POST /auth/logout`
Sign out sesi pengguna saat ini.
- **Auth**: Wajib (`Bearer <token>`)
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "User logged out successfully"
  }
  ```

---

### 2. Projects Module (`/projects`)
*Semua endpoint `/projects` membutuhkan header `Authorization: Bearer <token>`.*

#### `GET /projects`
Mengambil seluruh daftar project milik user (mengembalikan `[]` jika belum ada).
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "e44c2da8-...",
        "user_id": "c88f98a2-...",
        "name": "Skripsi",
        "icon": "📚",
        "description": "Penyelesaian bab 4 dan bab 5",
        "status": "Active",
        "is_active": true,
        "last_activity": "2026-08-15T12:00:00Z",
        "total_tasks": 10,
        "done_tasks": 4,
        "created_at": "2026-08-10T08:00:00Z"
      }
    ]
  }
  ```

#### `GET /projects/:id`
Mengambil detail satu project beserta daftar tasks dan blocker logs.
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "e44c2da8-...",
      "user_id": "c88f98a2-...",
      "name": "Skripsi",
      "icon": "📚",
      "description": "Penyelesaian bab 4 dan bab 5",
      "status": "Active",
      "is_active": true,
      "created_at": "2026-08-10T08:00:00Z",
      "tasks": [...],
      "blocker_logs": [...]
    }
  }
  ```

#### `POST /projects`
Membuat project baru.
- **Request Body**:
  ```json
  {
    "name": "Revamp Backend API",
    "icon": "🚀",
    "description": "Refactor arsitektur dan dokumentasi",
    "status": "Active",
    "is_active": false
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "e44c2da8-...",
      "user_id": "c88f98a2-...",
      "name": "Revamp Backend API",
      "icon": "🚀",
      "description": "Refactor arsitektur dan dokumentasi",
      "status": "Active",
      "is_active": false,
      "created_at": "2026-08-16T00:00:00Z"
    }
  }
  ```

#### `PUT /projects/:id`
Memperbarui project.
- **Request Body**:
  ```json
  {
    "name": "Revamp Backend API v2",
    "status": "Completed",
    "is_active": true
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```

#### `DELETE /projects/:id`
Menghapus project.
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```

---

### 3. Tasks Module (`/tasks`)
*Semua endpoint `/tasks` membutuhkan header `Authorization: Bearer <token>`.*

#### `GET /tasks`
Mengambil semua task milik user.
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "99b9cf9a-...",
        "project_id": "e44c2da8-...",
        "title": "Tulis dokumentasi API.md",
        "note": "Lengkapi semua modul",
        "status": "todo",
        "priority": "High",
        "completed_at": null,
        "created_at": "2026-08-16T00:00:00Z",
        "project": {
          "id": "e44c2da8-...",
          "name": "Skripsi"
        }
      }
    ]
  }
  ```

#### `GET /tasks/:id`
Mengambil detail satu task beserta histori sesi Pomodoro.
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```

#### `POST /tasks`
Membuat task baru.
- **Request Body**:
  ```json
  {
    "project_id": "e44c2da8-...",
    "title": "Membaca jurnal bab 2",
    "note": "Catat sitasi utama",
    "status": "todo",
    "priority": "medium"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "99b9cf9a-...",
      "project_id": "e44c2da8-...",
      "title": "Membaca jurnal bab 2",
      "note": "Catat sitasi utama",
      "status": "todo",
      "priority": "medium",
      "completed_at": null,
      "created_at": "2026-08-16T00:00:00Z"
    }
  }
  ```

#### `PUT /tasks/:id`
Memperbarui task (status, judul, note, priority, atau menandai selesai dengan `completed_at`).
- **Request Body**:
  ```json
  {
    "status": "completed",
    "completed_at": "2026-08-16T01:00:00Z"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```

#### `DELETE /tasks/:id`
Menghapus task.
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```

---

### 4. Pomodoro Sessions Module (`/pomodoro-sessions`)
*Semua endpoint `/pomodoro-sessions` membutuhkan header `Authorization: Bearer <token>`.*

#### `GET /pomodoro-sessions`
Mengambil semua sesi pomodoro user.
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "771e8bfb-...",
        "task_id": "99b9cf9a-...",
        "mode": "pomodoro",
        "cycle_index": 0,
        "session_num": 1,
        "duration": 1500,
        "completed": true,
        "started_at": "2026-08-16T00:00:00Z",
        "ended_at": "2026-08-16T00:25:00Z",
        "task": {
          "id": "99b9cf9a-...",
          "title": "Tulis dokumentasi API.md"
        }
      }
    ]
  }
  ```

#### `POST /pomodoro-sessions`
Mencatat sesi fokus atau istirahat baru.
- **Request Body**:
  ```json
  {
    "task_id": "99b9cf9a-...",
    "mode": "pomodoro",
    "duration": 1500,
    "cycle_index": 0,
    "session_num": 1,
    "started_at": "2026-08-16T00:00:00Z",
    "completed": true,
    "ended_at": "2026-08-16T00:25:00Z"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```

#### `PUT /pomodoro-sessions/:id`
Memperbarui sesi yang sedang berjalan / waktu elapsed.
- **Request Body**:
  ```json
  {
    "elapsed": 1200,
    "completed": true,
    "ended_at": "2026-08-16T00:20:00Z"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```

#### `DELETE /pomodoro-sessions/:id`
Menghapus riwayat sesi pomodoro.
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```

---

### 5. Blocker Logs Module (`/blocker-logs`)
*Semua endpoint `/blocker-logs` membutuhkan header `Authorization: Bearer <token>`.*

#### `GET /blocker-logs`
Mengambil daftar catatan blocker/gangguan fokus.
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "1198cfa7-...",
        "project_id": "e44c2da8-...",
        "reason": "Notifikasi pesan WhatsApp terus menerus",
        "solution": "Mengaktifkan mode DND di HP",
        "is_resolved": true,
        "created_at": "2026-08-16T00:10:00Z"
      }
    ]
  }
  ```

#### `POST /blocker-logs`
Mencatat blocker baru.
- **Request Body**:
  ```json
  {
    "project_id": "e44c2da8-...",
    "reason": "Mengantuk dan butuh minum air",
    "solution": null,
    "is_resolved": false,
    "created_at": "2026-08-16T00:15:00Z"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```

#### `PUT /blocker-logs/:id`
Mengubah status penyelesaian (`is_resolved`) atau mengisi catatan solusi (`solution`).
- **Request Body**:
  ```json
  {
    "is_resolved": true,
    "solution": "Sudah minum air dan stretching 5 menit"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```

#### `DELETE /blocker-logs/:id`
Menghapus riwayat blocker.
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```
