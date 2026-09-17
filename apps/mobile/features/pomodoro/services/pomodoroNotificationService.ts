import { Platform } from "react-native";

let Notifications: any = null;
try {
  // Guarded require: Expo Go on Android in SDK 53+ throws on root import of expo-notifications
  Notifications = require("expo-notifications");
} catch (err) {
  // Graceful fallback for Expo Go Android
}

if (Notifications?.setNotificationHandler) {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch {}
}

const POMODORO_CHANNEL_ID = "pomodoro_timer";

class PomodoroNotificationService {
  private isInitialized = false;

  async init() {
    if (this.isInitialized || !Notifications?.setNotificationChannelAsync) return;

    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(POMODORO_CHANNEL_ID, {
          name: "Sesi Pomodoro & Fokus",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 300, 200, 300],
          lightColor: "#18181b",
          sound: "default",
          enableVibrate: true,
        });
      }
      this.isInitialized = true;
    } catch (err) {
      console.warn("Failed to initialize notification channel:", err);
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (!Notifications?.requestPermissionsAsync) return false;

    try {
      await this.init();
      const settings = await Notifications.getPermissionsAsync();
      if (settings.granted) return true;

      const requested = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      return requested.granted;
    } catch (err) {
      console.warn("Error requesting notification permissions:", err);
      return false;
    }
  }

  async scheduleSessionCompleteNotification(
    secondsRemaining: number,
    taskTitle?: string,
  ): Promise<string | null> {
    if (!Notifications?.scheduleNotificationAsync || secondsRemaining <= 0) {
      return null;
    }

    try {
      await this.init();
      await this.cancelScheduledNotifications();

      const title = "Sesi Fokus Selesai! 🎉";
      const body = taskTitle
        ? `Luar biasa! Target "${taskTitle}" selesai 25 menit. Saatnya rehat sejenak.`
        : "Luar biasa! Sesi fokus Anda telah selesai. Saatnya rehat sejenak.";

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "default",
          priority: Notifications.AndroidNotificationPriority?.MAX,
          data: {
            screen: "focus",
            type: "pomodoro_complete",
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes?.TIME_INTERVAL,
          seconds: Math.max(1, Math.round(secondsRemaining)),
          channelId: Platform.OS === "android" ? POMODORO_CHANNEL_ID : undefined,
        },
      });

      return id;
    } catch (err) {
      console.warn("Failed to schedule pomodoro notification:", err);
      return null;
    }
  }

  async cancelScheduledNotifications(): Promise<void> {
    if (!Notifications?.cancelAllScheduledNotificationsAsync) return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (err) {
      console.warn("Failed to cancel scheduled notifications:", err);
    }
  }
}

export const pomodoroNotificationService = new PomodoroNotificationService();
