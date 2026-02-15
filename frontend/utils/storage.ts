import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export type Mood = 'Calm' | 'Neutral' | 'Heavy' | 'Hopeful' | 'None';

export interface Entry {
  date: string; // YYYY-MM-DD format
  question: string;
  answer: string;
  mood: Mood;
}

const STORAGE_KEY = '@onething_entries';

// Get all entries from storage
export const getAllEntries = async (): Promise<Entry[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading entries:', e);
    return [];
  }
};

// Save a new entry
export const saveEntry = async (entry: Entry): Promise<void> => {
  try {
    const entries = await getAllEntries();
    // Remove existing entry for the same date if any
    const filteredEntries = entries.filter(e => e.date !== entry.date);
    // Add new entry
    filteredEntries.push(entry);
    // Sort by date descending
    filteredEntries.sort((a, b) => b.date.localeCompare(a.date));
    const jsonValue = JSON.stringify(filteredEntries);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving entry:', e);
    throw e;
  }
};

// Get entry for a specific date
export const getEntryForDate = async (date: string): Promise<Entry | null> => {
  try {
    const entries = await getAllEntries();
    return entries.find(e => e.date === date) || null;
  } catch (e) {
    console.error('Error getting entry for date:', e);
    return null;
  }
};

// Check if entry exists for today
export const hasEntryForToday = async (): Promise<boolean> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const entry = await getEntryForDate(today);
  return entry !== null;
};

// Get today's entry
export const getTodayEntry = async (): Promise<Entry | null> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return await getEntryForDate(today);
};
