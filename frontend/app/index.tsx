import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { getTodayQuestion } from '../utils/questions';
import { hasEntryForToday, getTodayEntry, hasSeenOnboarding } from '../utils/storage';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function Index() {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const seen = await hasSeenOnboarding();
      if (!seen) {
        router.replace('/onboarding');
        return;
      }
      loadTodayData();
    } catch (error) {
      console.error('Error checking onboarding:', error);
      loadTodayData();
    }
  };

  const loadTodayData = async () => {
    try {
      setLoading(true);
      const todayQuestion = getTodayQuestion();
      setQuestion(todayQuestion);

      const answered = await hasEntryForToday();
      setHasAnswered(answered);

      if (answered) {
        const entry = await getTodayEntry();
        if (entry) {
          setAnswer(entry.answer);
        }
      }
    } catch (error) {
      console.error('Error loading today data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    if (answer.trim()) {
      router.push({
        pathname: '/mood',
        params: { question, answer },
      });
    }
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>1</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => router.push('/history')}
                style={styles.iconButton}
              >
                <MaterialIcons name="history" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/settings')}
                style={styles.iconButton}
              >
                <MaterialIcons name="settings" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Date */}
          <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>

          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.question}>{question}</Text>
          </View>

          {/* Answer Input */}
          <View style={styles.answerContainer}>
            <TextInput
              style={[
                styles.answerInput,
                hasAnswered && styles.answerInputDisabled,
              ]}
              placeholder="Your thoughts..."
              placeholderTextColor={COLORS.textDisabled}
              multiline
              numberOfLines={5}
              value={answer}
              onChangeText={setAnswer}
              editable={!hasAnswered}
              textAlignVertical="top"
            />
          </View>

          {/* Action Button */}
          {hasAnswered ? (
            <View style={styles.messageContainer}>
              <Text style={styles.message}>Come back tomorrow.</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.doneButton,
                !answer.trim() && styles.doneButtonDisabled,
              ]}
              onPress={handleDone}
              disabled={!answer.trim()}
            >
              <Text
                style={[
                  styles.doneButtonText,
                  !answer.trim() && styles.doneButtonTextDisabled,
                ]}
              >
                Done
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logo: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: '300',
    color: COLORS.text,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  date: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  questionContainer: {
    marginBottom: SPACING.xl,
  },
  question: {
    fontSize: FONT_SIZES.xlarge,
    color: COLORS.text,
    fontWeight: '400',
    lineHeight: 38,
  },
  answerContainer: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  answerInput: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    minHeight: 120,
    backgroundColor: '#FFFFFF',
  },
  answerInputDisabled: {
    backgroundColor: COLORS.background,
    color: COLORS.textLight,
  },
  doneButton: {
    backgroundColor: COLORS.button,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  doneButtonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
  },
  doneButtonText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.background,
    fontWeight: '500',
  },
  doneButtonTextDisabled: {
    color: COLORS.textDisabled,
  },
  messageContainer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  message: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});
