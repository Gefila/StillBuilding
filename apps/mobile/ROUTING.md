# Panduan Navigasi & Perutean (_Routing & Navigation Guide_)

Dokumen ini menjelaskan arsitektur navigasi berbasis berkas (_file-based routing_) pada aplikasi StillBuilding Frontend menggunakan **Expo Router v6**.

---

## 1. Konsep Dasar Expo Router

Expo Router menggunakan struktur file dan folder di dalam direktori `app/` untuk merepresentasikan rute layar dan navigasi aplikasi secara otomatis.

- **Folder dengan tanda kurung `(group)`**: Pengelompokan logis rute tanpa mempengaruhi struktur URL path (contoh: `(auth)` dan `(tabs)`).
- **File `_layout.tsx`**: Layout pembungkus yang mendefinisikan navigator (Stack, Tabs, atau Provider).
- **File dalam kurung siku `[param].tsx`**: Dynamic route yang menerima parameter variabel (contoh: `task/[id].tsx`).
- **File `index.tsx`**: Halaman utama / default untuk segmen direktori tersebut.

---

## 2. Peta Rute Aplikasi (_Route Tree Map_)

```
app/
├── _layout.tsx                     # Root Layout: Provider Wrapper & Global Stack Navigator
├── (auth)/                         # Grup Rute Autentikasi
│   ├── _layout.tsx                 # Stack navigator untuk rute auth
│   ├── login.tsx                   # Layar Masuk Akun
│   └── register.tsx                # Layar Pendaftaran Akun
│
├── (tabs)/                         # Grup Rute Utama Tab Bar Bawah
│   ├── _layout.tsx                 # Bottom Tabs Navigator & styling tab bar
│   ├── home.tsx                    # Tab 1: Dashboard, Quick Tasks, Today's Summary
│   ├── projects.tsx                # Tab 2: Daftar & Manajemen Proyek
│   └── profile.tsx                 # Tab 3: Profil Pengguna, Pengaturan & Statistik
│
├── pomodoro/                       # Rute Sesi Pomodoro Tracker
│   ├── _layout.tsx                 # Stack navigator untuk modul Pomodoro
│   └── index.tsx                   # Layar Fokus Pomodoro Timer & Blocker Logger
│
├── project/                        # Rute Detail & Manajemen Project
│   ├── _layout.tsx                 # Stack navigator untuk project screens
│   ├── [id].tsx                    # Layar Detail Proyek berdasarkan ID
│   ├── create.tsx                  # Layar Form Tambah Proyek Baru (Modal)
│   └── edit.tsx                    # Layar Form Edit Proyek
│
└── task/                           # Rute Detail & Manajemen Task
    ├── _layout.tsx                 # Stack navigator untuk task screens
    ├── [id].tsx                    # Layar Detail Task & Riwayat Pomodoro terkait
    ├── create.tsx                  # Layar Form Tambah Task Baru (Modal)
    └── edit.tsx                    # Layar Form Edit Task
```

---

## 3. Konfigurasi Root Layout (`app/_layout.tsx`)

Root layout membungkus seluruh aplikasi dengan provider global dan mendefinisikan transisi layar utama:

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/reactQuery";
import ToastManager from "toastify-react-native";
import "../global.css";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="task/create"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Tambah Task",
          }}
        />
        <Stack.Screen
          name="project/create"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Tambah Proyek",
          }}
        />
      </Stack>
      <ToastManager />
    </QueryClientProvider>
  );
}
```

---

## 4. Konfigurasi Tab Bar (`app/(tabs)/_layout.tsx`)

Konfigurasi tab bar bawah menggunakan token warna dan ikon Expo:

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderColor: "#F1F5F9",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Proyek",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "folder" : "folder-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
```

---

## 5. Navigasi & Pengiriman Parameter (_Route Navigation & Params_)

### A. Menggunakan Hook `useRouter`

Gunakan `useRouter` untuk navigasi imperatif berbasis event:

```tsx
import { useRouter } from "expo-router";

export function TaskCard({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  const handleOpenDetail = () => {
    router.push(`/task/${id}`);
  };

  const handleOpenEdit = () => {
    router.push({
      pathname: "/task/edit",
      params: { id },
    });
  };

  return (
    <TouchableOpacity onPress={handleOpenDetail}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
```

### B. Membaca Parameter Layar (`useLocalSearchParams`)

Gunakan `useLocalSearchParams` di dalam layar target untuk mengekstrak ID dan parameter query:

```tsx
// app/task/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text } from "react-native";
import { useTaskDetail } from "@/features/task/hooks/useTasks";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: task, isLoading } = useTaskDetail(id);

  if (isLoading) return <LoadingSpinner />;
  if (!task) return <NotFound />;

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-bold text-foreground">{task.title}</Text>
      <Text className="text-muted mt-2">{task.description}</Text>
    </View>
  );
}
```

---

## 6. Metode Navigasi Umum

| Aksi                              | Kode Expo Router                      | Keterangan                                                              |
| :-------------------------------- | :------------------------------------ | :---------------------------------------------------------------------- |
| **Pindah Halaman**                | `router.push('/task/123')`            | Menambahkan halaman baru ke history stack.                              |
| **Ganti Halaman (Replace)**       | `router.replace('/(tabs)/home')`      | Mengganti rute aktif (cocok setelah login/logout agar tidak bisa back). |
| **Kembali ke Halaman Sebelumnya** | `router.back()`                       | Menutup layar aktif dan kembali ke layar sebelumnya.                    |
| **Buka Modal Form**               | `router.push('/task/create')`         | Membuka screen dalam mode modal overlay.                                |
| **Navigasi Deklaratif**           | `<Link href="/pomodoro">Mulai</Link>` | Komponen link bawaan Expo Router untuk interaksi tombol sederhana.      |
