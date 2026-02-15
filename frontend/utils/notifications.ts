import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_SETTINGS_KEY = '@onething_notification_settings';

export interface NotificationSettings {
  enabled: boolean;
  hour: number; // 0-23
  minute: number; // 0-59
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Request permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Get notification settings
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
  } catch (e) {
    console.error('Error reading notification settings:', e);
  }
  
  // Default settings: disabled, 9:00 AM
  return {
    enabled: false,
    hour: 9,
    minute: 0,
  };
};

// Save notification settings
export const saveNotificationSettings = async (
  settings: NotificationSettings
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving notification settings:', e);
    throw e;
  }
};

// Schedule daily notification
export const scheduleDailyNotification = async (
  hour: number,
  minute: number
): Promise<void> => {
  try {
    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Gentle notification messages
    const messages = [
      "A quiet question is waiting, if you want.",
      "Today's question is here.",
      "One small pause, whenever you're ready.",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Schedule notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'OneThing',
        body: randomMessage,
        sound: false,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
};

// Cancel all notifications
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling notifications:', error);
    throw error;
  }
};

// Check if user has already answered today (to avoid sending notification)
export const shouldSendNotification = async (
  hasAnsweredToday: boolean
): Promise<boolean> => {
  const settings = await getNotificationSettings();
  return settings.enabled && !hasAnsweredToday;
};
