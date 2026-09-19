import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Modal from "@/components/Modal";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  AMBIENT_SOUNDS,
  useAmbientAudioStore,
  type AmbientSoundId,
} from "../store/useAmbientAudioStore";
import { ambientAudioService } from "../services/ambientAudioService";
import { usePomodoroStore } from "../store/usePomodoroStore";

interface AmbientSoundModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AmbientSoundModal({
  visible,
  onClose,
}: AmbientSoundModalProps) {
  const { soundId, volume, setSoundId, setVolume } = useAmbientAudioStore();
  const { isActive, isPaused, mode } = usePomodoroStore();

  const isTimerRunning = isActive && !isPaused && mode === "pomodoro";

  const handleSelectSound = async (id: AmbientSoundId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSoundId(id);

    if (isTimerRunning) {
      if (id === "none") {
        ambientAudioService.pauseAmbient();
      } else {
        await ambientAudioService.playAmbient(id, volume);
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVolume(newVolume);
    ambientAudioService.setVolume(newVolume);
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropTransitionOutTiming={1}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View className="bg-surface rounded-t-3xl border-t border-border p-6 max-h-[85%]">
        {/* Drag Indicator */}
        <View className="items-center mb-4">
          <View className="w-12 h-1.5 bg-border rounded-full" />
        </View>

        {/* Modal Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-surface-subtle border border-border items-center justify-center">
              <Ionicons name="headset" size={20} color="#18181b" />
            </View>
            <View>
              <Text className="text-foreground text-lg font-bold">
                Ambient Focus Audio
              </Text>
              <Text className="text-muted text-xs">
                {isTimerRunning
                  ? "Audio sedang aktif mengalir di sesi fokus"
                  : "Otomatis berputar saat sesi Deep Work dimulai"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            className="w-8 h-8 rounded-full bg-surface-subtle items-center justify-center border border-border"
          >
            <Ionicons name="close" size={18} color="#71717a" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="mb-2">
          {/* Volume Controls */}
          {soundId !== "none" && (
            <View className="bg-surface-subtle p-4 rounded-2xl border border-border mb-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-muted text-xs font-semibold uppercase tracking-wider">
                  Volume Suara
                </Text>
                <Text className="text-foreground font-bold text-xs">
                  {Math.round(volume * 100)}%
                </Text>
              </View>
              <View className="flex-row justify-between items-center gap-2">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((stepVol) => {
                  const isCurrent = Math.abs(volume - stepVol) < 0.1;
                  return (
                    <TouchableOpacity
                      key={stepVol}
                      activeOpacity={0.7}
                      onPress={() => handleVolumeChange(stepVol)}
                      className={`will-change-variable flex-1 py-2 rounded-xl items-center border ${
                        isCurrent
                          ? "bg-foreground border-foreground"
                          : "bg-surface border-border"
                      }`}
                    >
                      <Text
                        className={`will-change-variable text-xs font-bold ${
                          isCurrent ? "text-background" : "text-foreground"
                        }`}
                      >
                        {Math.round(stepVol * 100)}%
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Sound Track Options */}
          <Text className="text-muted text-xs font-semibold uppercase tracking-wider mb-2.5">
            Pilihan Suara Latar
          </Text>
          <View className="gap-2.5">
            {AMBIENT_SOUNDS.map((item) => {
              const isSelected = soundId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.75}
                  onPress={() => handleSelectSound(item.id)}
                  className={`will-change-variable p-4 rounded-2xl flex-row items-center border ${
                    isSelected
                      ? "bg-surface-subtle border-foreground"
                      : "bg-surface border-border"
                  }`}
                >
                  <View
                    className={`will-change-variable w-11 h-11 rounded-xl items-center justify-center mr-3.5 border ${
                      isSelected
                        ? "bg-foreground border-foreground"
                        : "bg-surface-subtle border-border"
                    }`}
                  >
                    <Ionicons
                      name={item.iconName as any}
                      size={20}
                      color={isSelected ? "#ffffff" : "#18181b"}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-sm">
                      {item.label}
                    </Text>
                    <Text className="text-muted text-xs mt-0.5">
                      {item.description}
                    </Text>
                  </View>

                  <View
                    className={`will-change-variable w-6 h-6 rounded-full border items-center justify-center ${
                      isSelected
                        ? "bg-foreground border-foreground"
                        : "border-border bg-surface"
                    }`}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="#ffffff" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClose}
          className="w-full py-3.5 bg-foreground rounded-2xl items-center justify-center mt-2 shadow-xs"
        >
          <Text className="text-background font-bold text-sm">Selesai</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
