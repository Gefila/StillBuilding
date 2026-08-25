import "../global.css";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { queryClient } from "@/lib/reactQuery";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ToastManager from "toastify-react-native";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#18181b" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, animation: "fade" }}
        />
        <Stack.Screen
          name="task"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="project"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="pomodoro"
          options={{ headerShown: false, animation: "slide_from_bottom" }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false, animation: "fade" }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
        <ToastManager useModal={false} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
