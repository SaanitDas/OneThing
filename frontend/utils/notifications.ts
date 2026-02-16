import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_SETTINGS_KEY = '@onething_notification_settings';
const CHANNEL_ID = 'daily-reminder';

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

// Setup Android notification channel (call once at app startup)
export const setupNotificationChannel = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Daily Reminder',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#8B9F8C',
        sound: null,
        enableVibrate: false,
        showBadge: false,
      });
      console.log('Notification channel created:', CHANNEL_ID);
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }
};

// Request permissions with proper Android 13+ handling
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    // Check current permission status
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    console.log('Current notification permission status:', existingStatus);

    // If not granted, request permission
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log('New notification permission status:', finalStatus);
    }

    // For Android 13+, also check POST_NOTIFICATIONS permission
    if (Platform.OS === 'android' && finalStatus === 'granted') {
      console.log('Notification permission granted successfully');
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

// Schedule daily notification with proper trigger type
export const scheduleDailyNotification = async (
  hour: number,
  minute: number
): Promise<void> => {
  try {
    console.log(`Scheduling daily notification for ${hour}:${minute}`);
    
    // Cancel all existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled all existing notifications');

    // Gentle notification messages
    const messages = [
      "A quiet question is waiting, if you want.",
      "Today's question is here.",
      "One small pause, whenever you're ready.",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Schedule daily notification with PROPER trigger format (type: 'daily')
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'OneThing',
        body: randomMessage,
        sound: false,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
      },
      trigger: {
        type: 'daily',
        hour: hour,
        minute: minute,
        channelId: CHANNEL_ID, // Required for Android
      },
    });

    console.log('Daily notification scheduled successfully with ID:', notificationId);
    console.log(`Will trigger daily at ${hour}:${String(minute).padStart(2, '0')}`);
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
