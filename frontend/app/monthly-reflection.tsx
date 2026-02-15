import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { getAllEntries, type Entry } from '../utils/storage';
import { generateMonthlyReflection } from '../utils/api';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function MonthlyReflectionScreen() {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);
  const [entriesCount, setEntriesCount] = useState(0);

  useEffect(() => {
    loadMonthEntries();
  }, [selectedMonth]);

  const loadMonthEntries = async () => {
    try {
      const allEntries = await getAllEntries();
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);
      
      const monthEntries = allEntries.filter((entry) => {
        const entryDate = parseISO(entry.date);
        return entryDate >= monthStart && entryDate <= monthEnd;
      });
      
      setEntriesCount(monthEntries.length);
      setReflection(null); // Reset reflection when month changes
    } catch (error) {
      console.error('Error loading month entries:', error);
    }
  };

  const handleGenerateReflection = async () => {
    if (entriesCount === 0) {
      Alert.alert('No Entries', 'You haven\'t written any reflections this month yet.');
      return;
    }

    try {
      setLoading(true);
      const allEntries = await getAllEntries();
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);
      
      const monthEntries = allEntries.filter((entry) => {
        const entryDate = parseISO(entry.date);
        return entryDate >= monthStart && entryDate <= monthEnd;
      });

      const response = await generateMonthlyReflection({
        entries: monthEntries.map((entry) => ({
          date: entry.date,
          question: entry.question,
          answer: entry.answer,
          mood: entry.mood,
        })),
        month: format(selectedMonth, 'MMMM yyyy'),
      });

      setReflection(response.summary);
    } catch (error) {
      console.error('Error generating reflection:', error);
      Alert.alert(
        'Error',
        'Failed to generate monthly reflection. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedMonth(newDate);
  };

  const handleNextMonth = () => {
    const currentMonth = new Date();
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    
    // Don't allow future months
    if (newDate <= currentMonth) {
      setSelectedMonth(newDate);
    }
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return (
      selectedMonth.getMonth() === now.getMonth() &&
      selectedMonth.getFullYear() === now.getFullYear()
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monthly Reflection</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={handlePreviousMonth} style={styles.monthButton}>
            <MaterialIcons name="chevron-left" size={28} color={COLORS.text} />
          </TouchableOpacity>
          
          <View style={styles.monthDisplay}>
            <Text style={styles.monthText}>{format(selectedMonth, 'MMMM yyyy')}</Text>
            <Text style={styles.entriesCount}>
              {entriesCount} {entriesCount === 1 ? 'entry' : 'entries'}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={handleNextMonth}
            style={styles.monthButton}
            disabled={isCurrentMonth()}
          >
            <MaterialIcons
              name="chevron-right"
              size={28}
              color={isCurrentMonth() ? COLORS.textDisabled : COLORS.text}
            />
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color={COLORS.calm} />
          <Text style={styles.infoText}>
            This AI-generated summary reflects recurring themes in your reflections.
            It does not provide advice or recommendations.
          </Text>
        </View>

        {/* Generate Button */}
        {!reflection && (
          <TouchableOpacity
            style={[
              styles.generateButton,
              (loading || entriesCount === 0) && styles.generateButtonDisabled,
            ]}
            onPress={handleGenerateReflection}
            disabled={loading || entriesCount === 0}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.background} />
            ) : (
              <>
                <MaterialIcons name="auto-awesome" size={20} color={COLORS.background} />
                <Text style={styles.generateButtonText}>Generate Reflection</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Reflection Summary */}
        {reflection && (
          <View style={styles.reflectionBox}>
            <View style={styles.reflectionHeader}>
              <MaterialIcons name="auto-awesome" size={20} color={COLORS.calm} />
              <Text style={styles.reflectionTitle}>Your Monthly Summary</Text>
            </View>
            <Text style={styles.reflectionText}>{reflection}</Text>
            
            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={handleGenerateReflection}
              disabled={loading}
            >
              <MaterialIcons name="refresh" size={18} color={COLORS.text} />
              <Text style={styles.regenerateButtonText}>Generate Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This feature uses AI to analyze patterns in your entries. All processing happens
            securely, and your data remains private. This is not therapy or mental health advice.
          </Text>
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
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    backgroundColor: '#FFFFFF',
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  monthButton: {
    padding: SPACING.xs,
  },
  monthDisplay: {
    alignItems: 'center',
  },
  monthText: {
    fontSize: FONT_SIZES.large,
    color: COLORS.text,
    fontWeight: '500',
  },
  entriesCount: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    lineHeight: 20,
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.calm,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  generateButtonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
  },
  generateButtonText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.background,
    fontWeight: '500',
  },
  reflectionBox: {
    backgroundColor: '#FFFFFF',
    padding: SPACING.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.calm,
    marginBottom: SPACING.lg,
  },
  reflectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  reflectionTitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: '500',
  },
  reflectionText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  regenerateButtonText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
  },
  disclaimer: {
    padding: SPACING.md,
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    lineHeight: 20,
  },
});
