import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
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
