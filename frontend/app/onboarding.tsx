import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setOnboardingSeen } from '../utils/storage';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

export default function OnboardingScreen() {
  const handleBegin = async () => {
    try {
      await setOnboardingSeen();
      router.replace('/');
    } catch (error) {
      console.error('Error setting onboarding flag:', error);
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>1</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>OneThing</Text>

        {/* Body Text */}
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>
            OneThing asks you one simple question each day.
          </Text>
          <Text style={styles.bodyText}>
            There are no streaks, no goals, and nothing to keep up with.
          </Text>
          <Text style={styles.bodyText}>
            Write if you want. Skip if you want.
          </Text>
          <Text style={styles.bodyText}>
            This space is private and pressure-free.
          </Text>
        </View>

        {/* Begin Button */}
        <TouchableOpacity style={styles.beginButton} onPress={handleBegin}>
          <Text style={styles.beginButtonText}>Begin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logo: {
    fontSize: 64,
    fontWeight: '300',
    color: COLORS.text,
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    color: COLORS.text,
    fontWeight: '400',
    marginBottom: SPACING.xl,
  },
  bodyContainer: {
    marginBottom: SPACING.xl * 2,
  },
  bodyText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  beginButton: {
    backgroundColor: COLORS.button,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl * 2,
    borderRadius: 8,
  },
  beginButtonText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.background,
    fontWeight: '500',
  },
});
