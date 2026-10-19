import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/components/ScreenHeader";
import {
  useApiTokenStatus,
  useGenerateApiToken,
  useRevokeApiToken,
} from "@/features/auth/hooks/useAuth";

const MCP_URL = `${process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "")}/mcp`;

const formatDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Belum pernah";

type ConfigFormat = "json" | "yaml";

export default function AiIntegrationScreen() {
  const insets = useSafeAreaInsets();
  const { data: status, isLoading } = useApiTokenStatus();
  const generate = useGenerateApiToken();
  const revoke = useRevokeApiToken();
  // Token asli hanya ada di memori layar ini, tidak pernah disimpan
  const [newToken, setNewToken] = useState<string | null>(null);
  const [format, setFormat] = useState<ConfigFormat>("json");

  const effectiveToken = newToken ?? "<TOKEN_ANDA>";

  const jsonSnippet = `{
  "mcpServers": {
    "stillbuilding": {
      "serverUrl": "${MCP_URL}",
      "headers": {
        "Authorization": "Bearer ${effectiveToken}"
      }
    }
  }
}`;

  const yamlSnippet = `mcp_servers:
  stillbuilding:
    url: "${MCP_URL}"
    headers:
      Authorization: "Bearer ${effectiveToken}"`;

  const activeSnippet = format === "json" ? jsonSnippet : yamlSnippet;

  const doGenerate = () =>
    generate.mutate(undefined, { onSuccess: (token) => setNewToken(token) });

  const onGenerate = () => {
    if (!status?.active) return doGenerate();
    Alert.alert(
      "Buat token baru?",
      "Token lama akan langsung berhenti bekerja. AI agent yang memakainya harus diperbarui.",
      [
        { text: "Batal", style: "cancel" },
        { text: "Buat Baru", style: "destructive", onPress: doGenerate },
      ],
    );
  };

  const onRevoke = () =>
    Alert.alert(
      "Cabut token?",
      "AI agent tidak akan bisa mengakses akun Anda lagi.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Cabut",
          style: "destructive",
          onPress: () =>
            revoke.mutate(undefined, { onSuccess: () => setNewToken(null) }),
        },
      ],
    );

  const shareText = async (text: string, title?: string) => {
    try {
      await Share.share({ message: text, title });
    } catch (e) {
      console.error("Gagal membagikan:", e);
    }
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Integrasi AI (MCP)"
          subtitle="Hubungkan AI agent (Hermes, Claude, Cursor) agar bisa mengelola task Anda"
          showBackButton={true}
        />

        {/* Status Token */}
        <View className="bg-surface p-4 rounded-3xl border border-border my-2 shadow-xs">
          <View className="flex-row items-center gap-2.5 pb-3 mb-3 border-b border-border/60">
            <View className="w-9 h-9 rounded-2xl bg-violet-500/10 items-center justify-center border border-violet-500/20">
              <Ionicons name="sparkles" size={18} color="#7c3aed" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-foreground">
                Personal Access Token
              </Text>
              <Text className="text-xs text-muted">
                Hanya bisa dipakai untuk endpoint MCP
              </Text>
            </View>
          </View>

          {isLoading ? (
            <ActivityIndicator color="#18181b" />
          ) : status?.active ? (
            <View className="gap-2">
              <Row
                icon="checkmark-circle-outline"
                label="Status"
                value="Aktif"
              />
              <Row
                icon="calendar-outline"
                label="Dibuat"
                value={formatDate(status.created_at)}
              />
              <Row
                icon="time-outline"
                label="Terakhir dipakai"
                value={formatDate(status.last_used_at)}
              />
            </View>
          ) : (
            <Text className="text-xs text-muted">
              Belum ada token. Buat token untuk menghubungkan AI agent.
            </Text>
          )}
        </View>

        {/* Token baru (sekali tampil) */}
        {newToken && (
          <View className="bg-amber-500/10 p-4 rounded-3xl border border-amber-500/30 my-2">
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="key" size={16} color="#b45309" />
              <Text className="text-xs font-bold text-amber-900">
                Token Berhasil Dibuat (Hanya Ditampilkan Sekali)
              </Text>
            </View>

            <Text
              selectable
              className="text-xs font-mono text-foreground bg-surface p-3 rounded-xl border border-border"
            >
              {newToken}
            </Text>

            {/* Tombol aksi cepat */}
            <View className="flex-col gap-2 mt-3">
              <TouchableOpacity
                id="share-full-config"
                activeOpacity={0.8}
                onPress={() =>
                  shareText(jsonSnippet, "Konfigurasi MCP StillBuilding (JSON)")
                }
                className="flex-row items-center justify-center gap-2 py-3 rounded-xl bg-foreground"
              >
                <Ionicons name="copy" size={16} color="#fff" />
                <Text className="text-sm font-bold text-white">
                  Salin Konfigurasi Lengkap (+ Token)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="share-api-token-only"
                activeOpacity={0.8}
                onPress={() => shareText(newToken, "Token StillBuilding")}
                className="flex-row items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-surface"
              >
                <Ionicons name="key-outline" size={15} color="#18181b" />
                <Text className="text-xs font-semibold text-foreground">
                  Salin Token Saja
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Snippet konfigurasi dengan selector format (JSON / YAML) */}
        <View className="bg-surface p-4 rounded-3xl border border-border my-2 shadow-xs">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-sm font-bold text-foreground">
              Konfigurasi AI Agent
            </Text>

            {/* Toggle Format: JSON vs YAML */}
            <View className="flex-row bg-surface-subtle border border-border rounded-xl p-0.5">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setFormat("json")}
                className={`px-2.5 py-1 rounded-lg ${
                  format === "json" ? "bg-foreground shadow-xs" : ""
                }`}
              >
                <Text
                  className={`text-[11px] font-bold ${
                    format === "json" ? "text-white" : "text-muted"
                  }`}
                >
                  JSON
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setFormat("yaml")}
                className={`px-2.5 py-1 rounded-lg ${
                  format === "yaml" ? "bg-foreground shadow-xs" : ""
                }`}
              >
                <Text
                  className={`text-[11px] font-bold ${
                    format === "yaml" ? "text-white" : "text-muted"
                  }`}
                >
                  YAML (Hermes)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-xs text-muted mb-3">
            {format === "json"
              ? "Cocok untuk Cursor, Claude Desktop, Antigravity IDE, atau client MCP JSON."
              : "Cocok untuk agen Hermes (config.yaml) atau terminal agent berbasis YAML."}
          </Text>

          <Text
            selectable
            className="text-[11px] font-mono text-foreground bg-surface-subtle p-3 rounded-xl border border-border"
          >
            {activeSnippet}
          </Text>

          <TouchableOpacity
            id="share-mcp-config"
            activeOpacity={0.8}
            onPress={() =>
              shareText(
                activeSnippet,
                `Konfigurasi StillBuilding (${format.toUpperCase()})`,
              )
            }
            className="flex-row items-center justify-center gap-2 mt-3 py-2.5 rounded-xl border border-border bg-surface"
          >
            <Ionicons name="share-outline" size={16} color="#18181b" />
            <Text className="text-sm font-semibold text-foreground">
              Salin / Bagikan Konfigurasi ({format.toUpperCase()})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tombol Buat / Perbarui Token */}
        <TouchableOpacity
          id="generate-api-token"
          activeOpacity={0.8}
          disabled={generate.isPending}
          onPress={onGenerate}
          className="flex-row items-center justify-center gap-2 mt-2 py-3.5 rounded-2xl bg-foreground"
        >
          {generate.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="key-outline" size={16} color="#fff" />
              <Text className="text-sm font-bold text-white">
                {status?.active ? "Buat Token Baru" : "Buat Token"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Tombol Cabut Token */}
        {status?.active && (
          <TouchableOpacity
            id="revoke-api-token"
            activeOpacity={0.8}
            disabled={revoke.isPending}
            onPress={onRevoke}
            className="flex-row items-center justify-center gap-2 mt-2 py-3.5 rounded-2xl border border-red-500/30 bg-red-500/5"
          >
            <Ionicons name="trash-outline" size={16} color="#dc2626" />
            <Text className="text-sm font-bold text-red-600">Cabut Token</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: Math.max(insets.bottom, 24) + 16 }} />
      </ScrollView>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <View className="flex-row items-center gap-2">
        <Ionicons name={icon} size={16} color="#71717a" />
        <Text className="text-xs text-muted">{label}</Text>
      </View>
      <Text className="text-xs font-semibold text-foreground">{value}</Text>
    </View>
  );
}
