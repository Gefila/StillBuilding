# Panduan Sistem Desain & Styling (_Design System Guide_)

Dokumen ini menjelaskan standar visual tema **Minimalist High-Contrast (Linear / Notion Style)**, token tema semantik (`global.css`), tipografi, spacing, dan aturan penggunaan komponen atomik pada aplikasi StillBuilding Frontend menggunakan **NativeWind v5** dan **Tailwind CSS v4**.

---

## 1. Fondasi Styling: Minimalist High-Contrast

Aplikasi ini menggunakan tema monokromatik modern berpresisi tinggi dengan canvas netral (`#FAFAFA`), permukaan putih bersih (`#FFFFFF`), teks tajam pitch-black (`#09090B`), dan aksen fungsional terarah. Seluruh komponen UI harus memanfaatkan utility classes dari token tema semantik di `global.css`.

```tsx
// ❌ HINDARI: Hardcoded color values atau custom hex
<View className="bg-[#1E293B] p-4 rounded-lg">
  <Text className="text-[#F8FAFC]">Judul Task</Text>
</View>

// ✅ GUNAKAN: Semantic Theme Tokens
<View className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
  <Text className="text-foreground font-semibold text-base">Judul Task</Text>
  <Text className="text-muted text-xs mt-1">Deskripsi singkat task</Text>
</View>
```

---

## 2. Palet Token Warna Semantik (`global.css`)

| Kategori Token       | Utility Class CSS                           | Nilai Warna           | Kegunaan / Penjelasan                          |
| :------------------- | :------------------------------------------ | :-------------------- | :--------------------------------------------- |
| **Base Canvas**      | `bg-background`                             | `#FAFAFA` (Zinc-50)   | Background layar / canvas utama                |
| **Teks Utama**       | `text-foreground`                           | `#09090B` (Zinc-950)  | Teks judul, heading, dan konten utama          |
| **Teks Sekunder**    | `text-muted`                                | `#71717A` (Zinc-500)  | Teks keterangan, timestamp, placeholder        |
| **Surface / Card**   | `bg-surface`                                | `#FFFFFF`             | Background card, bottom sheet, panel, modal    |
| **Subtle Surface**   | `bg-surface-subtle`                         | `#F4F4F5` (Zinc-100)  | Inset container, chip background, filter track |
| **Brand Primary**    | `bg-primary`, `text-primary-foreground`     | `#18181B` / `#FFFFFF` | Tombol CTA utama, status aktif                 |
| **Brand Secondary**  | `bg-secondary`, `text-secondary-foreground` | `#F4F4F5` / `#18181B` | Tombol sekunder, filter pill                   |
| **Border & Divider** | `border-border`, `border-divider`           | `#E4E4E7` / `#F4F4F5` | Hairline border card & separator               |
| **Input Form**       | `bg-input`, `border-input-border`           | `#FFFFFF` / `#E4E4E7` | Input teks, textarea, dropdown                 |
| **Feedback Success** | `bg-success`, `text-success`                | `#16A34A`             | Indikator sukses, task selesai                 |
| **Feedback Warning** | `bg-warning`, `text-warning`                | `#D97706`             | Peringatan, deadline mendekat                  |
| **Feedback Error**   | `bg-error`, `text-error`                    | `#DC2626`             | Pesan validasi, blocker, delete button         |

---

## 3. Tipografi & Skala Spacing

### Skala Spacing & Layout

- **Screen Padding**: `px-4 pt-3 pb-6` pada seluruh tab & modal.
- **Section Gap**: `gap-3` atau `gap-4` (12px - 16px).
- **Card Padding**: `p-4` (atau `p-3.5` untuk sub-card ringkas).

### Skala Border Radius (_Corner Rounding_)

- **`rounded-lg` (8px)**: Badge kecil, button mungil, sub-pill filter.
- **`rounded-xl` (12px)**: Input form, button standar, header action button.
- **`rounded-2xl` (16px)**: Card task, card project, modal container.
- **`rounded-full`**: Avatar, status indicator dot/pill, FAB button.

---

## 4. Komponen Fondasi Standar

### A. Screen Header (`components/ScreenHeader.tsx`)

```tsx
import ScreenHeader from "@/components/ScreenHeader";
import Button from "@/components/Button";

<ScreenHeader
  title="Proyek"
  subtitle="Kelola proyek dan pantau pencapaian target"
  rightAction={
    <Button
      label="Buat Baru"
      size="sm"
      variant="primary"
      onPress={handleCreate}
    />
  }
/>;
```

### B. Card Surface (`components/Card.tsx`)

```tsx
import Card from "@/components/Card";

<Card variant="default">
  <Text className="text-foreground font-semibold">Konten Kartu</Text>
</Card>;
```

### C. Tombol (`components/Button.tsx`)

```tsx
import Button from "@/components/Button";

<Button label="Simpan Perubahan" variant="primary" size="md" onPress={handleSave} />
<Button label="Batal" variant="secondary" size="md" onPress={handleCancel} />
<Button label="Hapus" variant="danger" size="md" onPress={handleDelete} />
```

---

## 5. Konvensi Ikonografi

Gunakan `@expo/vector-icons` (`Ionicons`) dengan pewarnaan semantik:

- **Default Icon**: `color="#18181b"` untuk icon aktif/fungsional, `color="#71717a"` untuk icon sekunder, `color="#a1a1aa"` untuk icon dekoratif/timestamp.
