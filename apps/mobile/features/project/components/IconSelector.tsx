import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import Modal from "@/components/Modal";
import { Ionicons } from "@expo/vector-icons";

type IconCategory =
  | "Semua"
  | "Kerja"
  | "Belajar"
  | "Tech"
  | "Pribadi"
  | "Olahraga";

interface CategoryGroup {
  name: IconCategory;
  icon: keyof typeof Ionicons.glyphMap;
  icons: (keyof typeof Ionicons.glyphMap)[];
}

const CATEGORIES: CategoryGroup[] = [
  {
    name: "Kerja",
    icon: "briefcase-outline",
    icons: [
      "briefcase-outline",
      "business-outline",
      "document-text-outline",
      "folder-outline",
      "calculator-outline",
      "reader-outline",
      "mail-outline",
      "call-outline",
      "receipt-outline",
      "pie-chart-outline",
    ],
  },
  {
    name: "Belajar",
    icon: "school-outline",
    icons: [
      "school-outline",
      "book-outline",
      "library-outline",
      "bookmark-outline",
      "pencil-outline",
      "bulb-outline",
      "ribbon-outline",
      "medal-outline",
      "easel-outline",
      "newspaper-outline",
    ],
  },
  {
    name: "Tech",
    icon: "code-slash-outline",
    icons: [
      "code-slash-outline",
      "terminal-outline",
      "laptop-outline",
      "server-outline",
      "hardware-chip-outline",
      "phone-portrait-outline",
      "rocket-outline",
      "globe-outline",
      "construct-outline",
      "cloud-outline",
    ],
  },
  {
    name: "Pribadi",
    icon: "person-outline",
    icons: [
      "person-outline",
      "home-outline",
      "heart-outline",
      "star-outline",
      "sparkles-outline",
      "cafe-outline",
      "camera-outline",
      "brush-outline",
      "musical-notes-outline",
      "game-controller-outline",
    ],
  },
  {
    name: "Olahraga",
    icon: "fitness-outline",
    icons: [
      "fitness-outline",
      "barbell-outline",
      "bicycle-outline",
      "flame-outline",
      "trophy-outline",
      "flag-outline",
      "timer-outline",
      "walk-outline",
      "football-outline",
      "leaf-outline",
    ],
  },
];

const ALL_ICONS = Array.from(
  new Set(CATEGORIES.flatMap((cat) => cat.icons)),
) as (keyof typeof Ionicons.glyphMap)[];

type Props = {
  label: string;
  labelIconName?: React.ComponentProps<typeof Ionicons>["name"];
  error?: string;
  selectedIcon: keyof typeof Ionicons.glyphMap;
  onSelect: (iconName: keyof typeof Ionicons.glyphMap) => void;
};

export default function IconSelector({
  label,
  labelIconName,
  error,
  selectedIcon = "folder-outline",
  onSelect,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<IconCategory>("Semua");

  const displayedIcons = useMemo(() => {
    if (activeCategory === "Semua") return ALL_ICONS;
    const found = CATEGORIES.find((cat) => cat.name === activeCategory);
    return found ? found.icons : ALL_ICONS;
  }, [activeCategory]);

  return (
    <View className="w-full mb-4">
      {/* Label */}
      <View className="flex-row items-center mb-1.5 ml-0.5">
        {labelIconName && (
          <Ionicons
            name={labelIconName}
            size={14}
            color={error ? "#dc2626" : "#71717a"}
          />
        )}
        <Text
          className={`text-xs font-semibold uppercase tracking-wider ${
            labelIconName ? "ml-1.5" : ""
          } ${error ? "text-error" : "text-muted"}`}
        >
          {label}
        </Text>
      </View>

      {/* Trigger Button */}
      <TouchableOpacity
        className={`flex-row items-center border rounded-xl px-3.5 h-12 bg-surface ${
          error ? "border-error" : "border-border"
        }`}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View className="w-8 h-8 rounded-lg bg-surface-subtle items-center justify-center mr-3 border border-border">
          <Ionicons name={selectedIcon} size={18} color="#18181b" />
        </View>

        <View className="flex-1">
          <Text className="text-xs text-muted font-medium">Ikon Terpilih</Text>
          <Text
            className="text-sm font-semibold text-foreground capitalize"
            numberOfLines={1}
          >
            {selectedIcon.replace("-outline", "")}
          </Text>
        </View>

        <View className="px-2.5 py-1 bg-surface-subtle border border-border rounded-lg flex-row items-center">
          <Text className="text-xs font-semibold text-foreground mr-1">
            Ubah
          </Text>
          <Ionicons name="chevron-down" size={13} color="#71717a" />
        </View>
      </TouchableOpacity>

      {error && (
        <View className="flex-row items-center mt-1.5 ml-0.5">
          <Ionicons
            name="alert-circle"
            size={13}
            color="#dc2626"
            style={{ marginRight: 4 }}
          />
          <Text className="text-error text-xs font-medium">{error}</Text>
        </View>
      )}

      {/* Modal Selection */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        backdropOpacity={0.65}
        backdropColor="#000000"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={250}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={1}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        style={{ margin: 0, justifyContent: "flex-end" }}
      >
        <View className="bg-surface rounded-t-3xl p-5 pb-8 h-[60%] border-t border-border shadow-2xl">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3 px-1">
            <View>
              <Text className="text-lg font-bold text-foreground">
                Pilih Ikon Proyek
              </Text>
              <Text className="text-xs text-muted mt-0.5">
                Pilih ikon representatif untuk proyek Anda
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="p-1 rounded-full bg-surface-subtle border border-border"
            >
              <Ionicons name="close" size={18} color="#18181b" />
            </TouchableOpacity>
          </View>

          {/* Category Tabs */}
          <View className="mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6, paddingHorizontal: 2 }}
            >
              <TouchableOpacity
                onPress={() => setActiveCategory("Semua")}
                className={`px-3 py-1.5 rounded-xl border ${
                  activeCategory === "Semua"
                    ? "bg-primary border-primary"
                    : "bg-surface-subtle border-border"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    activeCategory === "Semua"
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  Semua ({ALL_ICONS.length})
                </Text>
              </TouchableOpacity>

              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <TouchableOpacity
                    key={cat.name}
                    onPress={() => setActiveCategory(cat.name)}
                    className={`flex-row items-center px-3 py-1.5 rounded-xl border ${
                      isActive
                        ? "bg-primary border-primary"
                        : "bg-surface-subtle border-border"
                    }`}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={13}
                      color={isActive ? "#ffffff" : "#18181b"}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      className={`text-xs font-semibold ${
                        isActive ? "text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Grid of Icons */}
          <FlatList
            data={displayedIcons}
            numColumns={5}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedIcon === item;
              return (
                <TouchableOpacity
                  className={`flex-1 items-center justify-center p-3 m-1 rounded-xl border ${
                    isSelected
                      ? "bg-primary border-primary shadow-xs"
                      : "bg-surface-subtle border-border"
                  }`}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                >
                  <Ionicons
                    name={item}
                    size={22}
                    color={isSelected ? "#ffffff" : "#18181b"}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}
