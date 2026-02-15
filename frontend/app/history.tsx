import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';
import { getAllEntries, type Entry } from '../utils/storage';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

const MOOD_COLORS = {
  Calm: COLORS.calm,
  Neutral: COLORS.neutral,
  Heavy: COLORS.heavy,
  Hopeful: COLORS.hopeful,
  None: COLORS.textDisabled,
};

export default function HistoryScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const allEntries = await getAllEntries();
      setEntries(allEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEntryPress = (date: string) => {
    router.push(`/entry/${date}`);
  };

  const renderEntry = ({ item }: { item: Entry }) => {
    const date = parseISO(item.date);
    const moodColor = MOOD_COLORS[item.mood];

    return (
      <TouchableOpacity
        style={styles.entryCard}
        onPress={() => handleEntryPress(item.date)}
      >
        <View style={styles.entryHeader}>
          <Text style={styles.entryDate}>{format(date, 'EEEE, MMMM d, yyyy')}</Text>
          <View style={[styles.moodDot, { backgroundColor: moodColor }]} />
        </View>
        <Text style={styles.entryQuestion} numberOfLines={2}>
          {item.question}
        </Text>
        <Text style={styles.entryAnswer} numberOfLines={2}>
          {item.answer}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.button} />
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No entries yet.</Text>
          <Text style={styles.emptySubtext}>Start reflecting today.</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.large,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
  },
  listContent: {
    padding: SPACING.md,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  entryDate: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
  },
  moodDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  entryQuestion: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  entryAnswer: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    lineHeight: 20,
  },
});
