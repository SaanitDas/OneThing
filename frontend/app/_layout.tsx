import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { COLORS } from '../constants/theme';
import { setupNotificationChannel } from '../utils/notifications';

export default function RootLayout() {
  // Setup notification channel on app startup (Android)
  useEffect(() => {
    setupNotificationChannel();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="index" />
      <Stack.Screen name="mood" />
      <Stack.Screen name="confirmation" />
      <Stack.Screen name="history" />
      <Stack.Screen name="entry/[date]" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="monthly-reflection" />
    </Stack>
  );
}
