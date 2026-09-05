export interface FAQItem {
  id: string;
  category: "pomodoro" | "blocker" | "project" | "account";
  question: string;
  answer: string;
  badge: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: "pomodoro-1",
    category: "pomodoro",
    badge: "Pomodoro",
    question: "Bagaimana cara kerja siklus Pomodoro di StillBuilding?",
    answer:
      "StillBuilding menerapkan pola standar 25 menit fokus penuh (Deep Work) diikuti oleh 5 menit istirahat singkat (Short Break). Setelah menyelesaikan 4 interval fokus, Anda disarankan mengambil istirahat panjang 15-30 menit untuk memulihkan energi.",
  },
  {
    id: "pomodoro-2",
    category: "pomodoro",
    badge: "Pomodoro",
    question: "Apakah sesi fokus tetap berjalan jika aplikasi ditutup?",
    answer:
      "Ya, timer fokus StillBuilding mencatat timestamp awal sesi dan waktu target berakhir. Ketika Anda membuka kembali aplikasi, durasi yang telah terlewati akan dihitung secara otomatis dan disinkronkan ke sesi tugas terkait.",
  },
  {
    id: "blocker-1",
    category: "blocker",
    badge: "Blocker",
    question: "Apa fungsi fitur Blocker dan kapan saya harus mencatatnya?",
    answer:
      "Blocker digunakan untuk mencatat gangguan instan yang memecah konsentrasi Anda saat sesi Pomodoro berjalan—baik distraksi internal (rasa jenuh, dorongan mengecek medsos) maupun eksternal (notifikasi chat, interupsi rekan). Mencatatnya membantu menganalisis pola hambatan kerja Anda pada tab Profil.",
  },
  {
    id: "project-1",
    category: "project",
    badge: "Tugas & Proyek",
    question: "Bagaimana cara menghubungkan tugas ke dalam proyek tertentu?",
    answer:
      "Saat membuat tugas baru di tombol '+' atau mengedit tugas yang ada, pilih menu dropdown 'Proyek' untuk mengaitkan tugas tersebut ke proyek aktif. Anda juga dapat menambahkan tugas langsung dari dalam halaman detail proyek terkait.",
  },
  {
    id: "account-1",
    category: "account",
    badge: "Akun & Sinkronisasi",
    question: "Bagaimana cara mempertahankan streak fokus harian?",
    answer:
      "Streak harian Anda akan bertambah ketika Anda menyelesaikan minimal 1 sesi fokus (Pomodoro) setiap hari sebelum pukul 23:59. Jika Anda melewati satu hari tanpa sesi fokus tuntas, streak harian akan direset ke 0 namun rekor streak terpanjang tetap tersimpan.",
  },
  {
    id: "account-2",
    category: "account",
    badge: "Akun & Keamanan",
    question: "Apakah data saya aman dan bagaimana jika saya lupa kata sandi?",
    answer:
      "Data Anda dienkripsi dan disimpan dengan standar keamanan Supabase Auth. Untuk memperbarui kata sandi, masuk ke menu Profil > 'Keamanan & Kata Sandi' dan masukkan kata sandi lama serta yang baru.",
  },
];
