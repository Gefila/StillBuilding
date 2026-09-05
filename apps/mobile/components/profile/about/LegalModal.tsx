import React from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";

interface LegalModalProps {
  visible: boolean;
  onClose: () => void;
  type: "privacy" | "terms" | null;
}

const LEGAL_CONTENT = {
  privacy: {
    title: "Kebijakan Privasi",
    subtitle: "Pembaruan Terakhir: September 2026",
    sections: [
      {
        heading: "1. Komitmen Privasi",
        body: "StillBuilding berkomitmen menjaga kerahasiaan informasi personal Anda. Kami percaya bahwa data fokus, catatan tugas, dan jurnal hambatan adalah ruang kerja pribadi Anda yang harus terlindungi secara aman.",
      },
      {
        heading: "2. Data yang Dikumpulkan",
        body: "Kami hanya menyimpan data esensial yang diperlukan untuk menjalankan fungsionalitas aplikasi: alamat email untuk autentikasi akun, data tugas, durasi sesi Pomodoro, dan catatan blocker. Kami tidak melacak data geolokasi atau menjual data Anda kepada pihak ketiga.",
      },
      {
        heading: "3. Keamanan Data",
        body: "Seluruh komunikasi antara aplikasi mobile dan server diamankan menggunakan enkripsi TLS/HTTPS dan standar autentikasi JSON Web Token (JWT) yang disimpan di penyimpanan lokal terenkripsi (Expo SecureStore).",
      },
      {
        heading: "4. Hak Pengguna",
        body: "Anda memiliki hak penuh untuk memperbarui profil, mengubah kata sandi, mengekspor data produktivitas, atau menghapus akun Anda sewaktu-waktu melalui menu pengaturan akun.",
      },
    ],
  },
  terms: {
    title: "Syarat & Ketentuan",
    subtitle: "Ketentuan Penggunaan Aplikasi StillBuilding",
    sections: [
      {
        heading: "1. Penerimaan Ketentuan",
        body: "Dengan mengunduh, mengakses, atau menggunakan StillBuilding, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui ketentuan ini, Anda disarankan untuk tidak menggunakan aplikasi.",
      },
      {
        heading: "2. Penggunaan yang Wajar",
        body: "StillBuilding disediakan untuk membantu produktivitas pribadi dan manajemen alur kerja Anda. Anda dilarang menyalahgunakan API, melakukan reverse engineering berbahaya, atau mengganggu stabilitas infrastruktur server StillBuilding.",
      },
      {
        heading: "3. Ketersediaan Layanan",
        body: "Kami berupaya keras menjaga ketersediaan layanan 24/7. Namun, pemeliharaan rutin atau pembaruan sistem berkala dapat dilakukan untuk meningkatkan keandalan dan menambahkan fitur baru.",
      },
      {
        heading: "4. Lisensi & Hak Cipta",
        body: "Desain antarmuka, aset visual, dan kode aplikasi StillBuilding dilindungi oleh hak cipta. Komponen pustaka sumber terbuka tetap berada di bawah lisensi resmi masing-masing pengembang.",
      },
    ],
  },
};

export function LegalModal({ visible, onClose, type }: LegalModalProps) {
  if (!type) return null;
  const content = LEGAL_CONTENT[type];

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}
      backdropColor="#000000"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={280}
      animationOutTiming={220}
      backdropTransitionInTiming={280}
      backdropTransitionOutTiming={1}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      avoidKeyboard={Platform.OS === "ios"}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View className="bg-surface rounded-t-3xl border-t border-border shadow-2xl max-h-[85%]">
        {/* Header Bar */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-divider">
          <View>
            <Text className="text-lg font-bold text-foreground">
              {content.title}
            </Text>
            <Text className="text-xs text-muted font-medium mt-0.5">
              {content.subtitle}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="w-8 h-8 rounded-full bg-surface-subtle items-center justify-center border border-border"
          >
            <Ionicons name="close" size={18} color="#71717a" />
          </TouchableOpacity>
        </View>

        <ScrollView className="px-5 py-4" showsVerticalScrollIndicator={false}>
          {content.sections.map((section) => (
            <View key={section.heading} className="mb-4">
              <Text className="text-sm font-bold text-foreground mb-1">
                {section.heading}
              </Text>
              <Text className="text-xs text-muted leading-relaxed">
                {section.body}
              </Text>
            </View>
          ))}

          <View className="pt-2 pb-6">
            <Button
              label="Tutup"
              variant="primary"
              size="md"
              onPress={onClose}
              className="w-full"
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default LegalModal;
