# OneThing - Minimal Daily Reflection App

A calm, private mobile app for daily reflection. One question per day, one answer, completely local.

## Features

✅ **Daily Question System**
- 70 reflective questions that cycle deterministically
- Same question all day, changes at midnight
- No randomness - questions follow a (days since epoch) % 70 formula

✅ **Core Screens**
- Daily Question Screen with answer input
- Mood Selection (Calm, Neutral, Heavy, Hopeful, Skip)
- Confirmation Screen
- History Screen (list view)
- Entry Detail Screen
- Settings Screen

✅ **NEW: Daily Reminder Notifications** 🔔
- Optional gentle daily reminders
- Customizable reminder time
- Non-guilting notification copy
- Respects answered state (no notification if already answered)

✅ **NEW: AI-Powered Monthly Reflections** 🤖
- On-demand AI-generated monthly summaries
- Theme detection and pattern analysis
- Neutral, reflective tone (no advice or diagnosis)
- Uses Emergent Universal Key (OpenAI GPT-5.2)

✅ **Privacy First**
- No user accounts or login
- All data stored locally (AsyncStorage)
- No cloud sync
- No analytics or tracking
- AI processing respects privacy

✅ **Minimal Design**
- Warm off-white background (#F8F6F4)
- Calm color palette
- No gamification
- No streaks or scores
- No bright colors or animations

## Tech Stack

- **Frontend**: Expo + React Native
- **Navigation**: Expo Router (file-based routing)
- **Storage**: AsyncStorage (local only)
- **Notifications**: expo-notifications
- **AI Integration**: emergentintegrations + OpenAI GPT-5.2
- **Backend**: FastAPI (for AI monthly reflections)
- **Database**: MongoDB (available for future features)

## Project Structure

```
/app/frontend/
├── app/
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Home/Daily Question Screen
│   ├── mood.tsx                 # Mood Selection Screen
│   ├── confirmation.tsx         # Confirmation Screen
│   ├── history.tsx              # History List Screen
│   ├── settings.tsx             # Settings Screen (with notifications & AI)
│   ├── monthly-reflection.tsx   # AI Monthly Reflection Screen
│   └── entry/
│       └── [date].tsx           # Entry Detail Screen
├── constants/
│   └── theme.ts                 # Color palette and design tokens
├── utils/
│   ├── questions.ts             # 70 questions + deterministic selection
│   ├── storage.ts               # AsyncStorage utilities
│   ├── notifications.ts         # Notification utilities
│   └── api.ts                   # Backend API calls
└── app.json                     # Expo configuration (with notification permissions)
```

## URLs

- **Preview**: https://onething.preview.emergentagent.com
- **Backend API**: https://onething.preview.emergentagent.com/api
- **Monthly Reflection API**: https://onething.preview.emergentagent.com/api/monthly-reflection

## Development

```bash
# Install dependencies
cd frontend
yarn install

# Start Expo
yarn start

# Restart services
sudo supervisorctl restart expo backend
```

## New Features Implementation

### 1. Daily Notifications
- **Location**: Settings > Daily Reminder
- **Features**: 
  - Toggle on/off
  - Time picker (12-hour format)
  - Gentle notification messages
  - Auto-cancels if already answered
- **Permissions**: POST_NOTIFICATIONS (Android), UIBackgroundModes (iOS)

### 2. AI Monthly Reflections
- **Location**: Settings > Monthly Reflection > View Monthly Reflection
- **Features**:
  - Month selector (with arrow navigation)
  - Entry count display
  - Generate reflection button
  - AI-generated summary display
  - Regenerate option
- **AI Model**: OpenAI GPT-5.2 via Emergent Universal Key
- **Tone**: Neutral, reflective, non-advisory

## Key Implementation Details

### Question Selection Algorithm
```typescript
const daysSinceEpoch = Math.floor((date.getTime() - epochStart.getTime()) / (1000 * 60 * 60 * 24));
const questionIndex = daysSinceEpoch % QUESTIONS.length;
```

### Data Model
```typescript
interface Entry {
  date: string;        // YYYY-MM-DD format
  question: string;
  answer: string;
  mood: 'Calm' | 'Neutral' | 'Heavy' | 'Hopeful' | 'None';
}
```

### Notification Settings
```typescript
interface NotificationSettings {
  enabled: boolean;
  hour: number;    // 0-23
  minute: number;  // 0-59
}
```

### AI Monthly Reflection Flow
1. User selects month and taps "Generate Reflection"
2. App sends entries to backend API
3. Backend uses GPT-5.2 to analyze patterns
4. AI returns neutral, theme-based summary
5. User can regenerate or view different months

## Core Principles (Do Not Implement)

❌ No AI advice or chat
❌ No mental health diagnosis  
❌ No user profiles or social features
❌ No gamification (streaks, scores, badges)
❌ No ads
❌ No motivational quotes

## Ready for Play Store

The app is configured and ready for Android Play Store submission:
- Package: `com.onething.app`
- Notification permission configured
- Privacy-focused design
- Portrait orientation only
- Supports tablets

## Version

1.0.0

## Environment Variables

### Backend (.env)
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
EMERGENT_LLM_KEY=sk-emergent-eA56bB4E7FeE66a338
```

### Frontend (.env)
```
EXPO_TUNNEL_SUBDOMAIN=onething
EXPO_PACKAGER_HOSTNAME=https://onething.preview.emergentagent.com
EXPO_PUBLIC_BACKEND_URL=https://onething.preview.emergentagent.com
```

## Testing

All features have been tested via screenshots:
- ✅ Daily Question flow
- ✅ Mood selection
- ✅ History viewing
- ✅ Settings with notifications toggle
- ✅ Monthly Reflection interface

For full testing, use Expo Go app or build for device.
