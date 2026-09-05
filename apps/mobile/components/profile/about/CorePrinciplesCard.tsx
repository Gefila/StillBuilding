import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Principle {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
}

const PRINCIPLES: Principle[] = [
  {
    id: "1",
    icon: "footsteps-outline",
    title: "Langkah Semut (Mikro-Tasking)",
    desc: "Tugas dirancang dalam interval ringkas 20–30 menit agar mudah segera dieksekusi tanpa rasa terbebani.",
  },
  {
    id: "2",
    icon: "locate-outline",
    title: "Satu Fokus Tunggal",
    desc: "Menghindari ilusi multitasking. Hanya ada 1 proyek dan 1 target tugas yang aktif dalam setiap sesi deep work.",
  },
  {
    id: "3",
    icon: "warning-outline",
    title: "Pencatatan Blocker Real-Time",
    desc: "Distraksi dan kendala teknis dicatat secara instan tanpa menghentikan timer, membantu mengenali pola hambatan kerja.",
  },
  {
    id: "4",
    icon: "grid-outline",
    title: "Kejujuran Progres & Heatmap",
    desc: "Visualisasi komitmen kerja nyata dengan grafik kontribusi bergaya GitHub tanpa gamifikasi artifisial.",
  },
];

export function CorePrinciplesCard() {
  return (
    <View className="mb-6">
      <Text className="text-xs font-bold uppercase tracking-wider text-muted mb-3 px-1">
        Filosofi & Prinsip Kerja
      </Text>

      <View className="bg-surface border border-border rounded-2xl p-4 shadow-xs">
        {PRINCIPLES.map((principle, index) => {
          const isLast = index === PRINCIPLES.length - 1;
          return (
            <View key={principle.id}>
              <View className="flex-row items-start py-2.5">
                <View className="w-8 h-8 rounded-xl bg-surface-subtle border border-border items-center justify-center mr-3 mt-0.5">
                  <Ionicons name={principle.icon} size={16} color="#18181b" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    {principle.title}
                  </Text>
                  <Text className="text-xs text-muted leading-relaxed mt-0.5">
                    {principle.desc}
                  </Text>
                </View>
              </View>
              {!isLast && <View className="h-px bg-divider my-1.5 ml-11" />}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default CorePrinciplesCard;
