import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import {
  getNotificationSettings,
  saveNotificationSettings,
  scheduleDailyNotification,
  cancelAllNotifications,
  requestNotificationPermissions,
  type NotificationSettings,
} from '../utils/notifications';

export default function SettingsScreen() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: false,
    hour: 9,
    minute: 0,
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getNotificationSettings();
      setNotificationSettings(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    try {
      // Check if running on web - notifications not supported in web preview
      if (Platform.OS === 'web') {
        Alert.alert(
          'Not Available in Web',
          'Daily reminders are only available in the native Android/iOS app. Please build the APK to test this feature on your device.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (enabled) {
        // Request permissions first
        const hasPermission = await requestNotificationPermissions();
        
        if (!hasPermission) {
          // Permission denied - show helpful message
          Alert.alert(
            'Notification Permission Required',
            'OneThing needs notification permission to send you gentle daily reminders.\n\nPlease enable notifications in your device settings:\n\nSettings → Apps → OneThing → Notifications',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'OK', onPress: () => {
                console.log('User will enable notifications manually');
              }}
            ]
          );
          return;
        }

        // Permission granted - schedule notification
        await scheduleDailyNotification(
          notificationSettings.hour,
          notificationSettings.minute
        );

        // Show success message
        Alert.alert(
          'Reminder Enabled',
          `You'll receive a gentle reminder daily at ${formatTime(notificationSettings.hour, notificationSettings.minute)}.`,
          [{ text: 'OK' }]
        );
      } else {
        // Disable - cancel all notifications
        await cancelAllNotifications();
      }

      // Save settings
      const newSettings = { ...notificationSettings, enabled };
      await saveNotificationSettings(newSettings);
      setNotificationSettings(newSettings);
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert(
        'Error',
        Platform.OS === 'web' 
          ? 'Notifications are not supported in web preview. Build the APK to test on your device.'
          : 'Failed to update notification settings. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);

    if (event.type === 'set' && selectedDate) {
      const hour = selectedDate.getHours();
      const minute = selectedDate.getMinutes();

      try {
        if (notificationSettings.enabled) {
          await scheduleDailyNotification(hour, minute);
        }

        const newSettings = { ...notificationSettings, hour, minute };
        await saveNotificationSettings(newSettings);
        setNotificationSettings(newSettings);
      } catch (error) {
        console.error('Error updating time:', error);
        Alert.alert('Error', 'Failed to update notification time');
      }
    }
  };

  const formatTime = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const getTimeDate = (): Date => {
    const date = new Date();
    date.setHours(notificationSettings.hour);
    date.setMinutes(notificationSettings.minute);
    return date;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.button} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Reminder</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Reminder</Text>
              <Text style={styles.settingDescription}>
                Get a gentle daily notification
              </Text>
            </View>
            <Switch
              value={notificationSettings.enabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#E0DED8', true: COLORS.calm }}
              thumbColor={notificationSettings.enabled ? '#FFFFFF' : '#F8F6F4'}
              ios_backgroundColor="#E0DED8"
            />
          </View>

          {notificationSettings.enabled && (
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setShowTimePicker(true)}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Reminder Time</Text>
                <Text style={styles.settingDescription}>
                  {formatTime(notificationSettings.hour, notificationSettings.minute)}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={COLORS.textLight} />
            </TouchableOpacity>
          )}

          {showTimePicker && (
            <DateTimePicker
              value={getTimeDate()}
              mode="time"
              is24Hour={false}
              onChange={handleTimeChange}
            />
          )}
        </View>

        {/* Monthly Reflection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Reflection</Text>
          
          <TouchableOpacity
            style={styles.premiumButton}
            onPress={() => router.push('/monthly-reflection')}
          >
            <View style={styles.premiumButtonContent}>
              <MaterialIcons name="auto-awesome" size={20} color={COLORS.calm} />
              <Text style={styles.premiumButtonText}>View Monthly Reflection</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
          
          <Text style={styles.premiumDescription}>
            AI-generated summary of your monthly reflections. Non-advisory, theme-based analysis.
          </Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About OneThing</Text>
          <Text style={styles.aboutText}>
            OneThing is a minimal, calm space for daily reflection.
          </Text>
          <Text style={styles.aboutText}>
            One question. One answer. Every day.
          </Text>
          <Text style={styles.aboutText}>
            Your reflections are stored privately on your device only.
          </Text>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <Text style={styles.privacyText}>
            • No user accounts or login required
          </Text>
          <Text style={styles.privacyText}>
            • All data stored locally on your device
          </Text>
          <Text style={styles.privacyText}>
            • No cloud sync or data collection
          </Text>
          <Text style={styles.privacyText}>
            • No analytics or tracking
          </Text>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZES.large,
    color: COLORS.text,
    fontWeight: '500',
  },
  scrollContent: {
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
  },
  premiumButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.calm,
  },
  premiumButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  premiumButtonText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: '500',
  },
  premiumDescription: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    lineHeight: 20,
    marginTop: SPACING.xs,
  },
  aboutText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: SPACING.sm,
  },
  privacyText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: SPACING.xs,
  },
  versionContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  versionText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textDisabled,
  },
});
