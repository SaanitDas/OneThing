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
import {
  getAllEntries,
  type Entry,
  getMonthKey,
  getCachedMonthlyReflection,
  saveCachedMonthlyReflection,
  hasMonthlyReflection,
} from '../utils/storage';
import { generateMonthlyReflection } from '../utils/api';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

// Unlock conditions
const MIN_ENTRIES = 3;
const MIN_CHARACTERS = 300;

export default function MonthlyReflectionScreen() {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);
  const [entriesCount, setEntriesCount] = useState(0);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

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
      
      // Calculate total characters across all answers
      const totalChars = monthEntries.reduce((sum, entry) => sum + (entry.answer?.length || 0), 0);
      
      setEntriesCount(monthEntries.length);
      setTotalCharacters(totalChars);
      setIsUnlocked(monthEntries.length >= MIN_ENTRIES && totalChars >= MIN_CHARACTERS);
      
      // Check if reflection is already cached for this month
      const monthKey = getMonthKey(selectedMonth);
      const cached = await getCachedMonthlyReflection(monthKey);
      
      if (cached) {
        console.log(`Loading cached reflection for ${monthKey}`);
        setReflection(cached.summary);
        setIsGenerated(true);
      } else {
        setReflection(null);
        setIsGenerated(false);
      }
    } catch (error) {
      console.error('Error loading month entries:', error);
    }
  };

  const handleGenerateReflection = async () => {
    if (!isUnlocked) {
      return; // Should not be callable when locked
    }

    // Check if already generated for this month
    const monthKey = getMonthKey(selectedMonth);
    if (isGenerated) {
      Alert.alert(
        'Already Generated',
        'You have already generated a reflection for this month. Each month can only be reflected on once to preserve the authenticity of your thoughts.',
        [{ text: 'OK' }]
      );
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

      // Format entries as strings for Gemini API
      const formattedEntries = monthEntries.map((entry) => 
        `Date: ${format(parseISO(entry.date), 'MMMM d, yyyy')}\nQuestion: ${entry.question}\nAnswer: ${entry.answer}\nMood: ${entry.mood}`
      );

      console.log('Generating monthly reflection for', format(selectedMonth, 'MMMM yyyy'));
      console.log('Total entries:', formattedEntries.length);

      // Call Gemini API directly
      const response = await generateMonthlyReflection({
        entries: formattedEntries,
      });

      // Cache the reflection
      await saveCachedMonthlyReflection(monthKey, response.summary);

      setReflection(response.summary);
      setIsGenerated(true);
      console.log('Monthly reflection generated and cached successfully');
    } catch (error) {
      console.error('Error generating reflection:', error);
      Alert.alert(
        'Error',
        'Failed to generate monthly reflection. Please check your internet connection and try again.',
        [{ text: 'OK' }]
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

        {/* Locked State or Generate Button */}
        {!isUnlocked ? (
          <View style={styles.lockedContainer}>
            <View style={styles.lockedIconContainer}>
              <MaterialIcons name="lock-outline" size={48} color={COLORS.textLight} />
            </View>
            
            <Text style={styles.lockedTitle}>
              Your monthly reflection will unlock once you've added a few more entries.
            </Text>
            
            {/* Progress Indicators */}
            <View style={styles.progressContainer}>
              {/* Entry Count Progress */}
              <View style={styles.progressItem}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${Math.min((entriesCount / MIN_ENTRIES) * 100, 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.min(entriesCount, MIN_ENTRIES)} of {MIN_ENTRIES} reflections added
                </Text>
              </View>

              {/* Character Count Progress */}
              {entriesCount >= MIN_ENTRIES && totalCharacters < MIN_CHARACTERS && (
                <View style={styles.progressItem}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${Math.min((totalCharacters / MIN_CHARACTERS) * 100, 100)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {totalCharacters} of {MIN_CHARACTERS} characters written
                  </Text>
                </View>
              )}
            </View>
            
            <Text style={styles.lockedSubtext}>
              Keep reflecting — patterns emerge over time.
            </Text>
          </View>
        ) : (
          <>
            {/* Info Box */}
            <View style={styles.infoBox}>
              <MaterialIcons name="info-outline" size={20} color={COLORS.calm} />
              <Text style={styles.infoText}>
                This AI-generated summary reflects recurring themes in your reflections.
                It does not provide advice or recommendations.
              </Text>
            </View>

            {/* Generate Button */}
            {!reflection && !isGenerated && (
              <TouchableOpacity
                style={[styles.generateButton, loading && styles.generateButtonDisabled]}
                onPress={handleGenerateReflection}
                disabled={loading}
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
                
                {/* Show note that this can only be generated once */}
                <View style={styles.onceOnlyNote}>
                  <MaterialIcons name="info-outline" size={16} color={COLORS.textLight} />
                  <Text style={styles.onceOnlyText}>
                    This reflection was generated once for {format(selectedMonth, 'MMMM yyyy')} and preserved to maintain authenticity.
                  </Text>
                </View>
              </View>
            )}
          </>
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
  lockedContainer: {
    backgroundColor: '#FFFFFF',
    padding: SPACING.xl,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  lockedIconContainer: {
    marginBottom: SPACING.md,
  },
  lockedTitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  progressContainer: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  progressItem: {
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0DED8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.calm,
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  lockedSubtext: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: SPACING.sm,
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
