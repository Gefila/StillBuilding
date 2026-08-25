import { Stack } from "expo-router";

export default function PomodoroLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ headerShown: true, title: "Pomodoro Detail" }}
      />
    </Stack>
  );
}
