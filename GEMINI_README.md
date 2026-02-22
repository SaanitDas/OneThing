# OneThing - Client-Side Expo App with Gemini API

## ⚠️ Important: API Key Configuration

This app uses Google Gemini API for monthly reflection summaries. The API key is stored as a **public environment variable** in `app.json` and is **safe to commit to GitHub**.

### Why is it safe?
- The key is client-exposed by design (`EXPO_PUBLIC_*` prefix)
- It's restricted to specific domains/bundle IDs in Google Cloud Console
- Monthly reflections are client-side only with no backend
- All data is stored locally on the device

### API Key Location
```json
// frontend/app.json
{
  "expo": {
    "extra": {
      "EXPO_PUBLIC_GEMINI_API_KEY": "YOUR_KEY_HERE"
    }
  }
}
```

### To Update the API Key:
1. Get a new key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Update `EXPO_PUBLIC_GEMINI_API_KEY` in `/app/frontend/app.json`
3. Rebuild the app: `eas build -p android`

---

## 🚀 Features

- **70 Daily Reflective Questions** - Deterministic rotation
- **Local Storage Only** - No backend, no cloud sync
- **Mood Tracking** - Calm, Neutral, Heavy, Hopeful
- **Monthly AI Reflections** - Powered by Google Gemini 1.5 Flash
- **Smart Caching** - Reflections generated once per month and cached
- **Daily Notifications** - Optional gentle reminders
- **First-Launch Onboarding** - Calm, pressure-free introduction

---

## 📦 Tech Stack

- **Framework**: Expo SDK 54
- **Language**: TypeScript
- **Storage**: AsyncStorage (local only)
- **AI**: Google Gemini 1.5 Flash API
- **Navigation**: Expo Router
- **Build**: EAS Build

---

## 🏗️ Project Structure

```
onething/
├── frontend/
│   ├── app/                    # Screens (file-based routing)
│   │   ├── index.tsx          # Daily question screen
│   │   ├── onboarding.tsx     # First-launch onboarding
│   │   ├── mood.tsx           # Mood selection
│   │   ├── confirmation.tsx   # Confirmation screen
│   │   ├── history.tsx        # Entry history
│   │   ├── settings.tsx       # Settings with notifications
│   │   ├── monthly-reflection.tsx  # AI-powered monthly summaries
│   │   └── entry/[date].tsx   # Individual entry view
│   ├── utils/
│   │   ├── questions.ts       # 70 reflective questions
│   │   ├── storage.ts         # AsyncStorage utilities + caching
│   │   ├── notifications.ts   # Notification management
│   │   └── api.ts             # Gemini API integration
│   ├── constants/
│   │   └── theme.ts           # Design system
│   ├── app.json               # Expo configuration (includes API key)
│   ├── eas.json               # EAS Build configuration
│   └── package.json           # Dependencies
└── README.md                  # This file
```

---

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- Yarn or npm
- Expo CLI
- EAS CLI (for builds)

### Install Dependencies
```bash
cd frontend
yarn install
```

### Run Development Server
```bash
yarn start
# or
expo start
```

### Build for Android
```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

---

## 🔐 Environment Variables

### Required in `app.json`:
```json
{
  "expo": {
    "extra": {
      "EXPO_PUBLIC_GEMINI_API_KEY": "YOUR_GEMINI_API_KEY"
    }
  }
}
```

### Accessing in Code:
```typescript
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY;
```

**⚠️ DO NOT USE `process.env` - Use `Constants.expoConfig.extra` instead!**

---

## 🤖 Monthly Reflection Feature

### How It Works:
1. **Unlock Conditions**:
   - Minimum 3 journal entries in the month
   - Minimum 300 total characters across all answers

2. **Generation**:
   - Can only be generated **once per month**
   - Calls Google Gemini 1.5 Flash API directly from the client
   - No backend or server required

3. **Caching**:
   - Reflection is cached locally in AsyncStorage
   - Cache key format: `@onething_monthly_reflections_YYYY-MM`
   - Loads instantly from cache on app restart
   - Preserves authenticity by preventing regeneration

4. **Privacy**:
   - All processing happens via Gemini API
   - Data never stored on any server
   - Reflections remain on your device only

---

## 📱 Build Profiles

### Development
```json
{
  "developmentClient": true,
  "distribution": "internal",
  "android": { "buildType": "apk" }
}
```
- Hot reload enabled
- Debugging tools included
- Faster build times

### Production
```json
{
  "android": { "buildType": "apk" }
}
```
- Optimized and minified
- Ready for Play Store
- Smaller file size

---

## 🚢 Deployment Checklist

- [ ] Gemini API key is set in `app.json`
- [ ] No hardcoded secrets or API keys in code
- [ ] All features tested locally
- [ ] EAS Build configuration is correct
- [ ] Package name is unique
- [ ] App permissions are declared
- [ ] Privacy policy is included

---

## 📝 Commit Guidelines

### Safe to Commit:
✅ `app.json` (with EXPO_PUBLIC_GEMINI_API_KEY)
✅ All source code
✅ Configuration files
✅ Build configurations

### DO NOT Commit:
❌ `node_modules/`
❌ `.expo/`
❌ `dist/`
❌ Build artifacts
❌ Local environment files (already in .gitignore)

---

## 🔒 Security Notes

1. **API Key Exposure**: The Gemini API key is client-exposed by design
2. **Key Restrictions**: Set domain/bundle ID restrictions in Google Cloud Console
3. **Rate Limiting**: Implement client-side rate limiting if needed
4. **No Backend**: No server-side secrets to protect
5. **Local Data**: All user data stays on the device

---

## 📄 License

Private project - All rights reserved

---

## 🙋 Support

For issues or questions:
1. Check the code comments
2. Review Expo documentation
3. Check Gemini API documentation

---

## 🎯 Ready for GitHub & EAS Build

This project is configured and ready for:
- ✅ GitHub push (including public API key)
- ✅ EAS Build (development & production)
- ✅ Play Store submission
- ✅ Client-side only architecture
- ✅ No backend dependencies
