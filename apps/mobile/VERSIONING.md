# Strategi Versioning & Release Mobile App 🚀

Dokumentasi ini menjelaskan standar penomoran versi (_versioning_), alur pembuatan _build_, serta prinsip kompatibilitas ke belakang (_backward compatibility_) untuk aplikasi mobile **StillBuilding** (React Native / Expo).

---

## 1. Dua Lapisan Versi di Aplikasi Mobile

Aplikasi mobile memiliki dua jenis penomoran versi yang berbeda tujuan dan fungsinya:

```
┌────────────────────────────────────────────────────────┐
│             1. Public Version (SemVer)                 │
│              Contoh: 1.0.0, 1.1.0, 2.0.0               │
│  - Ditentukan di: `apps/mobile/app.json` ("version")   │
│  - Dilihat oleh pengguna di Google Play & App Store    │
│  - Ditampilkan di menu Profil > "Tentang Aplikasi"     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│         2. Internal Binary Build Identifier            │
│   - Android : `versionCode` (1, 2, 3, 4, ...)          │
│   - iOS     : `buildNumber` ("1", "2", "3", ...)       │
│   - Diatur otomatis oleh EAS Build via `autoIncrement` │
│     di `eas.json` (Profil `production`)                │
└────────────────────────────────────────────────────────┘
```

---

## 2. Standar Semantic Versioning (SemVer)

StillBuilding mengadopsi format **`MAJOR.MINOR.PATCH`** (contoh: `1.0.0`):

| Tingkat Versi | Contoh Transisi   | Kapan Dinaikkan?                                                                                                                          | Contoh di StillBuilding                                                        |
| :------------ | :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| **PATCH**     | `1.0.0` → `1.0.1` | Perbaikan _bug_, _hotfix_, penyesuaian teks/layout minor, tanpa ada fitur baru yang signifikan.                                           | Memperbaiki glitch animasi modal, menghilangkan ripple berlebih pada tabs bar. |
| **MINOR**     | `1.0.0` → `1.1.0` | Penambahan fitur baru yang terlihat oleh pengguna, peningkatan performa signifikan, dan tetap kompatibel ke belakang dengan API yang ada. | Menambahkan tab analitik baru, filter blocker baru, atau export report.        |
| **MAJOR**     | `1.0.0` → `2.0.0` | Perubahan radikal pada arsitektur, _major redesign_ menyeluruh, atau perubahan skema data/autentikasi yang memutus kompatibilitas lama.   | Migrasi total sistem akun/auth, perombakan penuh konsep navigasi inti.         |

---

## 3. Pengaturan Otomatis di EAS Build (`eas.json`)

Untuk menghindari kesalahan manual saat menaikkan nomor build native di Play Store dan App Store, proyek ini menggunakan fitur bawaan **EAS Remote Auto-Increment**:

```json
// apps/mobile/eas.json
{
  "cli": {
    "version": ">= 23.2.0",
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
}
```

### Cara Kerjanya:

- **`appVersionSource: "remote"`**: Server Expo Application Services (EAS) menyimpan riwayat nomor build terakhir yang berhasil dibangun di cloud.
- **`autoIncrement: true`**: Setiap kali Anda menjalankan build profil production (`eas build --profile production`), EAS otomatis menaikkan `versionCode` (Android) dan `buildNumber` (iOS) sebesar `+1`.
- Anda hanya perlu fokus menaikkan `"version"` di `app.json` saat merilis fitur/patch baru.

---

## 4. Prinsip Kompatibilitas Backend (Backward Compatibility)

Pengguna mobile tidak selalu langsung memperbarui aplikasi mereka begitu versi baru tersedia di toko aplikasi. Sebagian pengguna mungkin tetap berada di versi `1.0.0` berminggu-minggu setelah versi `1.2.0` dirilis.

StillBuilding mengadopsi pendekatan **menjaga backward compatibility di sisi backend** alih-alih melakukan _force update_ yang agresif dan mengganggu pengguna:

### Aturan Skema Backend (`apps/api` & `packages/types`):

1. **Perubahan Bersifat Aditif (_Additive-Only_)**:
   - Jangan menghapus atau mengubah tipe field yang sudah ada pada respons JSON endpoint yang sedang aktif.
   - Tambahkan field baru sebagai opsional atau sertakan _fallback_.
2. **Nilai Default pada Skema Input (Zod)**:
   - Jika backend membutuhkan field baru pada endpoint `POST`/`PUT`, buat field tersebut opsional (`.optional()`) atau berikan nilai _default_ di skema Zod agar request dari aplikasi mobile versi lawas tidak gagal validasi.
3. **Identifikasi Versi Klien melalui Header HTTP**:
   Setiap request dari aplikasi mobile secara otomatis menyertakan header versi melalui interceptor Axios di [`apps/mobile/lib/axios.ts`](./lib/axios.ts):
   ```http
   x-app-version: 1.0.0
   x-platform: android
   x-timezone: Asia/Jakarta
   ```
   _Manfaat:_ Tim backend dapat memantau log API (misal di Grafana/CloudWatch/Datadog) untuk melihat distribusi versi aplikasi yang masih aktif sebelum memutuskan untuk menghentikan dukungan (_deprecate_) terhadap fitur lawas.

---

## 5. Tampilan Versi Dinamis di Aplikasi

Versi aplikasi tidak boleh ditulis secara _hardcoded_ di komponen UI.

Di halaman **Profil > Tentang Aplikasi** ([`AboutHeroCard.tsx`](./components/profile/about/AboutHeroCard.tsx)), informasi versi dibaca langsung dari konfigurasi runtime Expo:

```tsx
import Constants from "expo-constants";
import { Platform } from "react-native";

const version = Constants.expoConfig?.version || "1.0.0";
const buildNumber =
  Platform.select({
    ios: Constants.expoConfig?.ios?.buildNumber,
    android: Constants.expoConfig?.android?.versionCode?.toString(),
  }) ||
  Constants.nativeBuildVersion ||
  "1";

// Menampilkan: "Versi 1.0.0 (Build 1) • Production"
```

---

## 6. Checklist Langkah Rilis (Release Workflow)

Berikut alur terstandarisasi saat ingin merilis versi baru StillBuilding:

1. **Tentukan Tingkat Rilis**:
   - Tentukan apakah perubahan masuk kategori `PATCH`, `MINOR`, atau `MAJOR`.
2. **Perbarui Versi di `app.json`**:
   Ubah `"version"` di `apps/mobile/app.json`:
   ```json
   "version": "1.1.0"
   ```
3. **Jalankan Verifikasi Kode**:
   Pastikan tidak ada error kompilasi dan styling rapi:
   ```bash
   pnpm check-types
   pnpm lint
   pnpm format
   ```
4. **Build untuk Pengujian Internal (Opsional/Preview APK)**:
   ```bash
   pnpm --filter @stillbuilding/mobile eas build --profile preview --platform android
   ```
5. **Build untuk Produksi (Play Store AAB / App Store IPA)**:
   ```bash
   pnpm --filter @stillbuilding/mobile eas build --profile production --platform all
   ```
   _(EAS akan otomatis meng-increment build number di cloud)_.
6. **Commit & Git Tag**:
   Beri label pada commit rilis:
   ```bash
   git add apps/mobile/app.json
   git commit -m "chore(mobile): bump version to 1.1.0"
   git tag mobile-v1.1.0
   git push origin main --tags
   ```
