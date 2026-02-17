import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 
  process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('EXPO_PUBLIC_BACKEND_URL environment variable is required');
}

export interface MonthlyReflectionRequest {
  entries: Array<{
    date: string;
    question: string;
    answer: string;
    mood: string;
  }>;
  month: string;
}

export interface MonthlyReflectionResponse {
  summary: string;
  month: string;
}

export const generateMonthlyReflection = async (
  request: MonthlyReflectionRequest
): Promise<MonthlyReflectionResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/monthly-reflection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate reflection');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating monthly reflection:', error);
    throw error;
  }
};
