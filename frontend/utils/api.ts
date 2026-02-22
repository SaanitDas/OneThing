import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 
  process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('EXPO_PUBLIC_BACKEND_URL environment variable is required');
}

export interface MonthlyReflectionRequest {
  entries: string[];
}

export interface MonthlyReflectionResponse {
  summary: string;
}

export const generateMonthlyReflection = async (
  request: MonthlyReflectionRequest
): Promise<MonthlyReflectionResponse> => {
  try {
    console.log('Calling Firebase Cloud Functions endpoint:', `${BACKEND_URL}/generateMonthlyReflection`);
    console.log('Request entries count:', request.entries.length);
    
    const response = await fetch(`${BACKEND_URL}/generateMonthlyReflection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to generate reflection: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Monthly reflection generated successfully');
    return result;
  } catch (error) {
    console.error('Error generating monthly reflection:', error);
    throw error;
  }
};
