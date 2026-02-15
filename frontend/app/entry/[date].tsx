import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';
import { getEntryForDate, type Entry } from '../../utils/storage';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

const MOOD_COLORS = {
  Calm: COLORS.calm,
  Neutral: COLORS.neutral,
  Heavy: COLORS.heavy,
  Hopeful: COLORS.hopeful,
  None: COLORS.textDisabled,
};

export default function EntryDetailScreen() {
  const params = useLocalSearchParams<{ date: string }>();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntry();
  }, [params.date]);

  const loadEntry = async () => {
    try {
      setLoading(true);
      if (params.date) {
        const entryData = await getEntryForDate(params.date);
        setEntry(entryData);
      }
    } catch (error) {
      console.error('Error loading entry:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.button} />
      </SafeAreaView>
    );
  }

  if (!entry) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Entry</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Entry not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const date = parseISO(entry.date);
  const moodColor = MOOD_COLORS[entry.mood];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Entry</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Date and Mood */}
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{format(date, 'EEEE, MMMM d, yyyy')}</Text>
          {entry.mood !== 'None' && (
            <View style={styles.moodContainer}>
              <View style={[styles.moodDot, { backgroundColor: moodColor }]} />
              <Text style={styles.moodLabel}>{entry.mood}</Text>
            </View>
          )}
        </View>

        {/* Question */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Question</Text>
          <Text style={styles.question}>{entry.question}</Text>
        </View>

        {/* Answer */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your Reflection</Text>
          <Text style={styles.answer}>{entry.answer}</Text>
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
  dateContainer: {
    marginBottom: SPACING.lg,
  },
  date: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  moodDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: SPACING.xs,
  },
  moodLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  question: {
    fontSize: FONT_SIZES.large,
    color: COLORS.text,
    lineHeight: 28,
  },
  answer: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
  },
});
