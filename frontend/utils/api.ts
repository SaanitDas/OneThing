import Constants from 'expo-constants';

// Get Gemini API key from expo-constants (safe for client-side use)
const GEMINI_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('EXPO_PUBLIC_GEMINI_API_KEY not found in app.json. Monthly Reflection will not work.');
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface MonthlyReflectionRequest {
  entries: string[];
}

export interface MonthlyReflectionResponse {
  summary: string;
}

/**
 * Generate monthly reflection using Google Gemini API
 * This calls the Gemini REST API directly from the client
 */
export const generateMonthlyReflection = async (
  request: MonthlyReflectionRequest
): Promise<MonthlyReflectionResponse> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to app.json');
  }

  try {
    console.log('Calling Gemini API for monthly reflection...');
    console.log('Request entries count:', request.entries.length);
    
    // Create prompt for Gemini
    const prompt = `You are a neutral reflection assistant for a daily journaling app called OneThing.

Your role is to:
- Detect recurring themes and patterns in the user's journal entries
- Summarize emotional patterns neutrally
- Reflect language back to the user

You MUST NOT:
- Give advice or recommendations
- Diagnose mental health conditions
- Use motivational or therapeutic language
- Suggest actions or changes
- Make judgments or evaluations
- Use emojis

Tone: Neutral, descriptive, reflective, non-judgmental.
Length: 3-5 sentences maximum.

Example style:
"This month, your answers often referenced tiredness around work and moments of relief during quieter days. Several entries reflected a desire for fewer obligations. This summary simply reflects recurring themes without judgment."

Here are the journal entries to analyze:

${request.entries.join('\n\n---\n\n')}

Please provide a brief, neutral summary of recurring themes and patterns.`;

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Monthly reflection generated successfully');

    // Extract text from Gemini response
    const summary = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary';

    return { summary };
  } catch (error) {
    console.error('Error generating monthly reflection:', error);
    throw error;
  }
};
