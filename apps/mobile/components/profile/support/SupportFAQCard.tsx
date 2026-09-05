import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FAQ_DATA, FAQItem } from "./faqData";

export type { FAQItem };
export { FAQ_DATA };

interface SupportFAQCardProps {
  searchQuery: string;
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
}

export function SupportFAQCard({
  searchQuery,
  selectedCategory,
  onSelectCategory,
}: SupportFAQCardProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    "pomodoro-1": true, // Default open first item
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesQuery =
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query) ||
      item.badge.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="text-xs font-bold uppercase tracking-wider text-muted">
          Pertanyaan Umum (FAQ)
        </Text>
        {selectedCategory && (
          <TouchableOpacity
            onPress={() => onSelectCategory(null)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text className="text-xs font-semibold text-primary">
              Reset Filter
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredFaqs.length === 0 ? (
        <View className="bg-surface rounded-2xl border border-border p-6 items-center justify-center">
          <View className="w-12 h-12 rounded-full bg-surface-subtle items-center justify-center mb-2 border border-border">
            <Ionicons name="search-outline" size={22} color="#71717a" />
          </View>
          <Text className="text-sm font-semibold text-foreground text-center">
            Tidak ada jawaban ditemukan
          </Text>
          <Text className="text-xs text-muted text-center mt-1 max-w-64">
            Coba gunakan kata kunci pencarian lain atau ajukan pertanyaan
            langsung melalui formulir kontak.
          </Text>
        </View>
      ) : (
        <View className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
          {filteredFaqs.map((faq, index) => {
            const isExpanded = !!expandedIds[faq.id];
            const isLast = index === filteredFaqs.length - 1;

            return (
              <View key={faq.id}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleExpand(faq.id)}
                  className="p-4 flex-row items-start justify-between"
                >
                  <View className="flex-1 mr-3">
                    <View className="flex-row items-center mb-1">
                      <View className="bg-surface-subtle px-2 py-0.5 rounded-md border border-border mr-2">
                        <Text className="text-[10px] font-semibold text-muted">
                          {faq.badge}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm font-semibold text-foreground leading-snug">
                      {faq.question}
                    </Text>
                  </View>
                  <View className="w-6 h-6 rounded-full bg-surface-subtle items-center justify-center mt-0.5 border border-border">
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={14}
                      color="#18181b"
                    />
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View className="px-4 pb-4 pt-1">
                    <View className="bg-surface-subtle p-3 rounded-xl border border-border">
                      <Text className="text-xs text-muted leading-relaxed">
                        {faq.answer}
                      </Text>
                    </View>
                  </View>
                )}

                {!isLast && <View className="h-px bg-divider mx-4" />}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default SupportFAQCard;
