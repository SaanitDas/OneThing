import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { saveEntry, type Mood } from '../utils/storage';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const MOOD_OPTIONS: { label: Mood; color: string }[] = [
  { label: 'Calm', color: COLORS.calm },
  { label: 'Neutral', color: COLORS.neutral },
  { label: 'Heavy', color: COLORS.heavy },
  { label: 'Hopeful', color: COLORS.hopeful },
];

export default function MoodScreen() {
  const params = useLocalSearchParams<{ question: string; answer: string }>();
  const [saving, setSaving] = useState(false);

  const handleMoodSelect = async (mood: Mood) => {
    try {
      setSaving(true);
      const entry = {
        date: format(new Date(), 'yyyy-MM-dd'),
        question: params.question || '',
        answer: params.answer || '',
        mood,
      };
      await saveEntry(entry);
      router.replace('/confirmation');
    } catch (error) {
      console.error('Error saving entry:', error);
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    await handleMoodSelect('None');
  };

  if (saving) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.button} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>How do you feel?</Text>

        <View style={styles.moodGrid}>
          {MOOD_OPTIONS.map((mood) => (
            <TouchableOpacity
              key={mood.label}
              style={[styles.moodButton, { borderColor: mood.color }]}
              onPress={() => handleMoodSelect(mood.label)}
            >
              <View style={[styles.moodDot, { backgroundColor: mood.color }]} />
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
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
    padding: SPACING.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    color: COLORS.text,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  moodGrid: {
    gap: SPACING.sm,
  },
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  moodDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: SPACING.sm,
  },
  moodLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
  skipButton: {
    marginTop: SPACING.xl,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  skipText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
  },
});
