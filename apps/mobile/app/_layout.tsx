import "../global.css";
import React, { useEffect } from "react";
import { ActivityIndicator, LogBox, View } from "react-native";
import { queryClient } from "@/lib/reactQuery";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppToast } from "@/components/Toast";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

import * as SplashScreen from "expo-splash-screen";

LogBox.ignoreLogs(["InteractionManager has been deprecated"]);

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
        <Stack.Screen
          name="profile"
          options={{ headerShown: false, animation: "slide_from_right" }}
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
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isInitialized) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
        <AppToast />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
