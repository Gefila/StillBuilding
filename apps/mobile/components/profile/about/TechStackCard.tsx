import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type LayerId = "all" | "mobile" | "api" | "shared";

interface ArchitectureLayer {
  id: "mobile" | "api" | "shared";
  name: string;
  directory: string;
  badge: string;
  badgeColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  highlight: string;
  technologies: {
    name: string;
    role: string;
    version?: string;
  }[];
}

const LAYERS: ArchitectureLayer[] = [
  {
    id: "mobile",
    name: "Mobile Client App",
    directory: "apps/mobile",
    badge: "Frontend",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: "phone-portrait-outline",
    description:
      "Aplikasi antarmuka pengguna berbasis React Native dengan navigasi file-based dan render performa tinggi.",
    highlight:
      "Direct in-memory cache sync via TanStack Query untuk latensi visual 0ms dan unmount query fokus.",
    technologies: [
      {
        name: "React Native 0.81",
        role: "Mobile Core Engine",
        version: "v0.81.5",
      },
      {
        name: "Expo SDK 54",
        role: "Application Tooling & Runtime",
        version: "v54.0",
      },
      {
        name: "Expo Router v6",
        role: "File-Based Routing Stack",
        version: "v6.0",
      },
      {
        name: "NativeWind v5 / Tailwind v4",
        role: "Design Token Utility Styling",
        version: "v5.0",
      },
      {
        name: "TanStack Query & Zustand",
        role: "Server Cache & Client Timer Store",
        version: "v5.100",
      },
    ],
  },
  {
    id: "api",
    name: "REST API & Backend",
    directory: "apps/api",
    badge: "Backend",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "server-outline",
    description:
      "Layanan API modular berbasis Express.js dengan otentikasi JWT dan koneksi PostgreSQL pool.",
    highlight:
      "Struktur domain modular (Auth, Tasks, Projects, Pomodoro, Blocker, Stats) dengan validasi middleware ketat.",
    technologies: [
      {
        name: "Express.js",
        role: "REST HTTP Application Server",
        version: "v4.21",
      },
      {
        name: "PostgreSQL & Supabase",
        role: "Relational Database Storage",
        version: "Cloud",
      },
      {
        name: "Biome",
        role: "High-Performance Linter & Formatter",
        version: "v1.9",
      },
      {
        name: "JWT Auth & Security",
        role: "Rate-Limiting, Helmet, & Tokens",
        version: "TLS",
      },
    ],
  },
  {
    id: "shared",
    name: "Shared Schema & Contracts",
    directory: "packages/types",
    badge: "Contracts",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    icon: "layers-outline",
    description:
      "Paket kontrak terpusat yang membagikan skema validasi Zod dan inferensi tipe TypeScript ke seluruh repositori.",
    highlight:
      "Menjamin end-to-end type safety antara aplikasi mobile dan backend tanpa redudansi penulisan tipe.",
    technologies: [
      {
        name: "Turborepo v2",
        role: "Monorepo Build & Task Orchestration",
        version: "v2.10",
      },
      {
        name: "Zod Schemas",
        role: "Runtime Payload & Form Validation",
        version: "v4.4",
      },
      {
        name: "TypeScript 5.9",
        role: "Strict Type Inference",
        version: "v5.9",
      },
    ],
  },
];

export function TechStackCard() {
  const [selectedLayer, setSelectedLayer] = useState<LayerId>("all");

  const filteredLayers =
    selectedLayer === "all"
      ? LAYERS
      : LAYERS.filter((l) => l.id === selectedLayer);

  return (
    <View className="mb-6">
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="text-xs font-bold uppercase tracking-wider text-muted">
          Arsitektur & Teknologi
        </Text>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
          <Text className="text-[11px] font-medium text-muted">
            Turborepo Monorepo
          </Text>
        </View>
      </View>

      {/* 1. Visual Architecture Pipeline Flow */}
      <View className="bg-surface border border-border rounded-2xl p-4 mb-3 shadow-xs">
        <Text className="text-xs font-bold text-foreground mb-1">
          Alur Pipeline Monorepo
        </Text>
        <Text className="text-[11px] text-muted mb-3 leading-relaxed">
          Arsitektur terkoordinasi dengan single-source-of-truth tipe:
        </Text>

        <View className="bg-surface-subtle p-3 rounded-xl border border-border">
          <View className="flex-row items-center justify-between">
            {/* Step 1 */}
            <View className="items-center flex-1">
              <View className="w-8 h-8 rounded-lg bg-surface border border-border items-center justify-center mb-1">
                <Ionicons
                  name="phone-portrait-outline"
                  size={16}
                  color="#18181b"
                />
              </View>
              <Text className="text-[10px] font-bold text-foreground text-center">
                Mobile
              </Text>
              <Text className="text-[9px] text-muted text-center">
                Expo v54
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={14} color="#a1a1aa" />

            {/* Step 2 */}
            <View className="items-center flex-1">
              <View className="w-8 h-8 rounded-lg bg-surface border border-border items-center justify-center mb-1">
                <Ionicons name="layers-outline" size={16} color="#7c3aed" />
              </View>
              <Text className="text-[10px] font-bold text-foreground text-center">
                Shared
              </Text>
              <Text className="text-[9px] text-muted text-center">
                Zod / Types
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={14} color="#a1a1aa" />

            {/* Step 3 */}
            <View className="items-center flex-1">
              <View className="w-8 h-8 rounded-lg bg-surface border border-border items-center justify-center mb-1">
                <Ionicons name="server-outline" size={16} color="#16a34a" />
              </View>
              <Text className="text-[10px] font-bold text-foreground text-center">
                API Service
              </Text>
              <Text className="text-[9px] text-muted text-center">Express</Text>
            </View>

            <Ionicons name="arrow-forward" size={14} color="#a1a1aa" />

            {/* Step 4 */}
            <View className="items-center flex-1">
              <View className="w-8 h-8 rounded-lg bg-surface border border-border items-center justify-center mb-1">
                <Ionicons name="cube-outline" size={16} color="#2563eb" />
              </View>
              <Text className="text-[10px] font-bold text-foreground text-center">
                Database
              </Text>
              <Text className="text-[9px] text-muted text-center">
                Supabase
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Interactive Layer Filter Pills */}
      <View className="flex-row gap-2 mb-3">
        {[
          { id: "all", label: "Semua" },
          { id: "mobile", label: "Mobile" },
          { id: "api", label: "API Service" },
          { id: "shared", label: "Shared Types" },
        ].map((tab) => {
          const isActive = selectedLayer === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setSelectedLayer(tab.id as LayerId)}
              activeOpacity={0.7}
              className={`px-3 py-1.5 rounded-xl border ${
                isActive
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isActive ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Detailed Architecture Cards */}
      <View className="gap-3">
        {filteredLayers.map((layer) => (
          <View
            key={layer.id}
            className="bg-surface border border-border rounded-2xl p-4 shadow-xs"
          >
            {/* Layer Header */}
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-9 h-9 rounded-xl bg-surface-subtle border border-border items-center justify-center mr-3">
                  <Ionicons name={layer.icon} size={18} color="#18181b" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-foreground">
                    {layer.name}
                  </Text>
                  <Text className="text-[10px] font-mono text-muted">
                    {layer.directory}
                  </Text>
                </View>
              </View>
              <View
                className={`px-2.5 py-0.5 rounded-full border ${layer.badgeColor}`}
              >
                <Text className="text-[10px] font-bold">{layer.badge}</Text>
              </View>
            </View>

            {/* Description */}
            <Text className="text-xs text-muted leading-relaxed mb-3">
              {layer.description}
            </Text>

            {/* Highlight Box */}
            <View className="bg-surface-subtle border border-border rounded-xl p-2.5 mb-3 flex-row items-start">
              <Ionicons
                name="shield-checkmark"
                size={14}
                color="#18181b"
                style={{ marginRight: 6, marginTop: 1 }}
              />
              <Text className="text-[11px] text-foreground font-medium flex-1 leading-snug">
                {layer.highlight}
              </Text>
            </View>

            {/* Tech Stack List */}
            <View className="bg-surface rounded-xl border border-divider overflow-hidden">
              {layer.technologies.map((tech, idx) => {
                const isLast = idx === layer.technologies.length - 1;
                return (
                  <View key={tech.name}>
                    <View className="flex-row items-center justify-between px-3 py-2">
                      <View className="flex-1 mr-2">
                        <Text className="text-xs font-semibold text-foreground">
                          {tech.name}
                        </Text>
                        <Text className="text-[10px] text-muted">
                          {tech.role}
                        </Text>
                      </View>
                      {tech.version && (
                        <View className="bg-surface-subtle px-2 py-0.5 rounded-md border border-border">
                          <Text className="text-[10px] font-mono font-medium text-muted">
                            {tech.version}
                          </Text>
                        </View>
                      )}
                    </View>
                    {!isLast && <View className="h-px bg-divider mx-3" />}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default TechStackCard;
