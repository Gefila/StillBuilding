import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Modal } from "@/components/Modal";
import { useStreakCelebrationStore } from "@/features/task/stores/useStreakCelebrationStore";

export const StreakCelebrationModal: React.FC = () => {
  const isVisible = useStreakCelebrationStore((state) => state.isVisible);
  const streakInfo = useStreakCelebrationStore((state) => state.streakInfo);
  const closeCelebration = useStreakCelebrationStore(
    (state) => state.closeCelebration,
  );

  const currentStreak = streakInfo?.currentStreak ?? 1;
  const longestStreak = streakInfo?.longestStreak ?? currentStreak;
  const isNewRecord = streakInfo?.isNewRecord ?? false;

  const motivationalMessage = useMemo(() => {
    if (currentStreak <= 1) {
      return "Awal yang sangat bagus! Selesaikan tugas setiap hari untuk terus membangun ritme produktivitasmu.";
    }
    if (currentStreak < 7) {
      return `Konsistensi luar biasa! Kamu telah mempertahankan fokus selama ${currentStreak} hari berturut-turut.`;
    }
    return `Momentum tak terhentikan! ${currentStreak} hari beruntun membuktikan dedikasi dan kerja kerasmu.`;
  }, [currentStreak]);

  const onDismissCallback = useStreakCelebrationStore(
    (state) => state.onDismissCallback,
  );
  const setOnDismissCallback = useStreakCelebrationStore(
    (state) => state.setOnDismissCallback,
  );

  const handleClose = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    closeCelebration();
  };

  return (
    <Modal
      isVisible={isVisible && !!streakInfo}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      onModalHide={() => {
        if (onDismissCallback) {
          const cb = onDismissCallback;
          setOnDismissCallback(null);
          cb();
        }
      }}
      backdropOpacity={0.65}
      backdropColor="#000000"
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={250}
      animationOutTiming={200}
      backdropTransitionInTiming={250}
      backdropTransitionOutTiming={1}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      statusBarTranslucent={true}
      style={{ margin: 24, justifyContent: "center", alignItems: "center" }}
    >
      <View className="w-full max-w-sm bg-surface rounded-3xl p-6 border border-border items-center shadow-2xl">
        {/* Floating Glowing Flame Badge */}
        <View className="w-20 h-20 rounded-full bg-amber-500/15 border border-amber-500/30 items-center justify-center mb-3.5">
          <View className="w-14 h-14 rounded-full bg-amber-500/20 items-center justify-center">
            <Ionicons name="flame" size={38} color="#f97316" />
          </View>
        </View>

        {/* Pill Tag */}
        <View className="flex-row items-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-2 gap-1.5">
          <Ionicons name="sparkles" size={12} color="#f59e0b" />
          <Text className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Streak Bertambah!
          </Text>
        </View>

        {/* Big Number Title */}
        <Text className="text-2xl font-black text-foreground text-center">
          {currentStreak} Hari Streak! 🔥
        </Text>

        {/* New Record Banner if applicable */}
        {isNewRecord && (
          <View className="flex-row items-center gap-1.5 bg-amber-100 px-3 py-1 rounded-xl mt-1.5 mb-1 border border-amber-200">
            <Ionicons name="trophy" size={14} color="#d97706" />
            <Text className="text-xs font-bold text-amber-800">
              Rekor Terpanjang Baru!
            </Text>
          </View>
        )}

        {/* Motivational text */}
        <Text className="text-xs text-muted text-center mt-2 mb-5 leading-relaxed px-2">
          {motivationalMessage}
        </Text>

        {/* Stats Dual Micro-Tiles */}
        <View className="flex-row w-full gap-2.5 mb-5">
          {/* Active Streak Tile */}
          <View className="flex-1 bg-surface-subtle p-3 rounded-2xl border border-border items-center">
            <View className="flex-row items-center gap-1 mb-1">
              <Ionicons name="flame" size={14} color="#f97316" />
              <Text className="text-[11px] font-semibold text-muted">
                Streak Aktif
              </Text>
            </View>
            <Text className="text-base font-extrabold text-foreground">
              {currentStreak} Hari
            </Text>
          </View>

          {/* Longest Streak Tile */}
          <View className="flex-1 bg-surface-subtle p-3 rounded-2xl border border-border items-center">
            <View className="flex-row items-center gap-1 mb-1">
              <Ionicons name="trophy" size={14} color="#d97706" />
              <Text className="text-[11px] font-semibold text-muted">
                Rekor Terbaik
              </Text>
            </View>
            <Text className="text-base font-extrabold text-foreground">
              {longestStreak} Hari
            </Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          onPress={handleClose}
          activeOpacity={0.85}
          className="w-full py-3.5 bg-foreground rounded-2xl items-center flex-row justify-center gap-2"
        >
          <Text className="text-sm font-bold text-background">
            Mantap, Lanjut
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default StreakCelebrationModal;
