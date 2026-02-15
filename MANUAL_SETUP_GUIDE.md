# OneThing - Manual Setup Guide

Since direct ZIP download isn't available in Emergent, here's how to recreate the project locally:

## Option 1: Use GitHub Integration (EASIEST)

1. Click **"Save to GitHub"** button in Emergent
2. This will push the complete project to your GitHub
3. Clone to your local machine:
   ```bash
   git clone <your-github-repo-url>
   cd onething/frontend
   ```

## Option 2: Manual File Creation

If GitHub isn't available, create these files manually:

### Step 1: Create Project Structure
```bash
mkdir -p onething/frontend
cd onething/frontend
mkdir -p app/entry utils constants assets
```

### Step 2: Initialize Project
```bash
# Create package.json
npm init -y

# Install dependencies
npx create-expo-app@latest . --template blank-typescript
yarn add @react-native-async-storage/async-storage date-fns expo-notifications @react-native-community/datetimepicker expo-dev-client
```

### Step 3: Copy Essential Files

I'll provide the critical files in separate messages. You'll need:

**Core Configuration:**
- `app.json` - Expo config
- `eas.json` - Build config
- `package.json` - Dependencies

**App Screens (app/):**
- `_layout.tsx` - Navigation layout
- `index.tsx` - Home/Daily Question
- `onboarding.tsx` - First launch onboarding
- `mood.tsx` - Mood selection
- `confirmation.tsx` - Confirmation screen
- `history.tsx` - History list
- `settings.tsx` - Settings with notifications
- `monthly-reflection.tsx` - AI reflections
- `entry/[date].tsx` - Entry detail

**Utilities (utils/):**
- `questions.ts` - 70 questions
- `storage.ts` - AsyncStorage functions
- `notifications.ts` - Notification utilities
- `api.ts` - Backend API calls

**Design (constants/):**
- `theme.ts` - Color palette and spacing

### Step 4: Build Configuration

**app.json** - See next message
**eas.json** - See next message
**All screen files** - I'll provide in chunks

---

## Option 3: Request GitHub Access

Ask Emergent support (support@emergent.sh) to help export your project with your job ID.

---

## Which Method Do You Prefer?

1. **GitHub Integration** - Fastest if available
2. **I'll share all code** - I can provide every file's content
3. **Contact Support** - For direct export help

Let me know and I'll proceed accordingly!
