import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/Button";

interface TaskActionButtonsProps {
  onStartTimer: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isTimerActive?: boolean;
}

export function TaskActionButtons({
  onStartTimer,
  onEdit,
  onDelete,
}: TaskActionButtonsProps) {
  return (
    <View className="gap-2">
      {/* Primary Action Button */}
      <Button
        label="Mulai Sesi Fokus Pomodoro"
        iconLeft={<Ionicons name="play" size={16} color="#ffffff" />}
        variant="primary"
        size="md"
        onPress={onStartTimer}
      />

      {/* Secondary Action Grid */}
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button
            label="Edit Tugas"
            iconLeft={
              <Ionicons name="pencil-outline" size={15} color="#18181b" />
            }
            variant="outline"
            size="md"
            onPress={onEdit}
          />
        </View>
        <View className="flex-1">
          <Button
            label="Hapus"
            iconLeft={
              <Ionicons name="trash-outline" size={15} color="#dc2626" />
            }
            variant="outline"
            size="md"
            className="border-red-200"
            onPress={onDelete}
          />
        </View>
      </View>
    </View>
  );
}

export default TaskActionButtons;
