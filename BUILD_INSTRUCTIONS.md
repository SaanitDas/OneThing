# OneThing - Development APK Build Instructions

## Prerequisites

1. **Expo Account**: Create a free account at https://expo.dev/signup
2. **EAS CLI**: Already installed globally in this environment

## Build Steps

### Option 1: Build via Command Line (Automated)

1. **Login to EAS** (required once):
   ```bash
   cd /app/frontend
   eas login
   ```
   Enter your Expo credentials when prompted.

2. **Configure EAS Project**:
   ```bash
   eas build:configure
   ```
   This will link your project to EAS Build.

3. **Build Development APK**:
   ```bash
   eas build --platform android --profile development --local
   ```
   
   Or for cloud build (recommended):
   ```bash
   eas build --platform android --profile development
   ```

4. **Download the APK**:
   - After build completes, you'll get a download link
   - Or view all builds at: https://expo.dev/accounts/[your-account]/projects/onething/builds

### Option 2: Build via Expo.dev Dashboard (Easiest)

1. Go to https://expo.dev/
2. Click **"Create a new project"** or **"Import project"**
3. Connect your repository or upload the `/app/frontend` folder
4. Click **"Build"** → **"Android"** → **"Development build"**
5. Wait for build to complete (~5-10 minutes)
6. Download the APK and install on your Android device

### Option 3: Local Build (No Expo Account Required)

For a completely local build without EAS:

```bash
cd /app/frontend
npx expo prebuild --platform android
cd android
./gradlew assembleDebug
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Installation on Android Device

### Method 1: Direct Install (Recommended)
1. Download the APK to your Android device
2. Open the file
3. Tap **"Install"**
4. If prompted, enable **"Install from unknown sources"**

### Method 2: ADB Install
```bash
adb install path/to/onething.apk
```

## Configuration Files Created

- ✅ `eas.json` - EAS Build configuration
- ✅ `expo-dev-client` - Installed for development builds

## Build Profiles

### Development Build
- **Profile**: `development`
- **Type**: APK (faster, smaller)
- **Features**: Hot reload, debugging, all native features
- **Use for**: Testing on your device

### Preview Build
- **Profile**: `preview`
- **Type**: APK
- **Use for**: Testing before production

### Production Build
- **Profile**: `production`
- **Type**: AAB (for Play Store) or APK
- **Use for**: Play Store submission

## Quick Command Reference

```bash
# Login to EAS
eas login

# Check build status
eas build:list

# Build development APK (cloud)
eas build --platform android --profile development

# Build development APK (local - no account needed)
eas build --platform android --profile development --local

# Build production AAB for Play Store
eas build --platform android --profile production
```

## Troubleshooting

### "Not logged in" error:
```bash
eas login
```

### "Project not configured" error:
```bash
eas build:configure
```

### Build fails:
- Check that all dependencies are installed
- Verify app.json configuration
- Check EAS build logs for specific errors

### Local build requires Android SDK:
Install Android Studio and Android SDK if building locally.

## APK Features

Your development APK will include:
- ✅ All 70 daily questions
- ✅ Mood tracking (Calm, Neutral, Heavy, Hopeful)
- ✅ Local storage (AsyncStorage)
- ✅ Daily notification reminders
- ✅ AI monthly reflections (GPT-5.2)
- ✅ First-launch onboarding
- ✅ Full native performance
- ✅ Offline functionality

## Next Steps After Build

1. Install the APK on your Android device
2. Open the app - you'll see the onboarding screen
3. Grant notification permission when prompted (optional)
4. Start using OneThing!

## Support

- Expo Documentation: https://docs.expo.dev/build/setup/
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Android Build Guide: https://docs.expo.dev/build-reference/apk/

---

## Current Project Status

- **Expo SDK**: 54.0.33
- **React Native**: 0.81.5
- **Build Type**: APK (Android)
- **Package**: com.onething.app
- **All Features**: Implemented and tested ✅
