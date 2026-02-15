# OneThing - Minimal Daily Reflection App

A calm, private mobile app for daily reflection. One question per day, one answer, completely local.

## Features

✅ **Daily Question System**
- 70 reflective questions that cycle deterministically
- Same question all day, changes at midnight
- No randomness - questions follow a (days since epoch) % 70 formula

✅ **Core Screens**
- Daily Question Screen with answer input
- Mood Selection (Calm, Neutral, Heavy, Hopeful, or Skip)
- Confirmation Screen
- History Screen (list view)
- Entry Detail Screen
- Settings Screen

✅ **Privacy First**
- No user accounts or login
- All data stored locally (AsyncStorage)
- No cloud sync
- No analytics or tracking
- No notifications (v1)

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
- **Backend**: FastAPI (minimal, available for future features)
- **Database**: MongoDB (available for future features)

## Project Structure

```
/app/frontend/
├── app/
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Home/Daily Question Screen
│   ├── mood.tsx             # Mood Selection Screen
│   ├── confirmation.tsx     # Confirmation Screen
│   ├── history.tsx          # History List Screen
│   ├── settings.tsx         # Settings Screen
│   └── entry/
│       └── [date].tsx       # Entry Detail Screen
├── constants/
│   └── theme.ts             # Color palette and design tokens
├── utils/
│   ├── questions.ts         # 70 questions + deterministic selection logic
│   └── storage.ts           # AsyncStorage utilities
└── app.json                 # Expo configuration
```

## URLs

- **Preview**: https://onething.preview.emergentagent.com
- **Backend API**: https://onething.preview.emergentagent.com/api

## Development

```bash
# Install dependencies
cd frontend
yarn install

# Start Expo
yarn start

# Restart Expo service
sudo supervisorctl restart expo
```

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

### Answer Flow
1. User answers today's question
2. Navigates to mood selection
3. Selects mood or skips
4. Entry is saved locally
5. Confirmation screen ("Noted.")
6. Auto-redirects to home (locked state)

## Core Principles (Do Not Implement)

❌ No AI advice or chat
❌ No mental health diagnosis
❌ No user profiles or social features
❌ No gamification (streaks, scores, badges)
❌ No push notifications (v1)
❌ No ads
❌ No motivational quotes

## Ready for Play Store

The app is configured and ready for Android Play Store submission:
- Package: `com.onething.app`
- Clean permissions (none required)
- Privacy-focused design
- Portrait orientation only
- Supports tablets

## Version

1.0.0
