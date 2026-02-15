import { Stack } from 'expo-router';
import { COLORS } from '../constants/theme';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="mood" />
      <Stack.Screen name="confirmation" />
      <Stack.Screen name="history" />
      <Stack.Screen name="entry/[date]" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
