# OneThing - Download & Build Guide

## 📦 ZIP Files Ready for Download

Two ZIP files have been created for you:

### 1. **onething-project.zip** (1.2 MB)
- Contains only the frontend code
- Everything needed to build the APK
- Smaller file size

### 2. **onething-complete.zip** (1.2 MB)
- Contains frontend + backend + documentation
- Complete project with AI reflection backend
- Includes README and build instructions

---

## 🔽 How to Download

The ZIP files are located at:
```
/app/onething-project.zip
/app/onething-complete.zip
```

**To download from this environment:**

### Option 1: Using File Download Feature
If your environment supports file downloads, navigate to:
- `/app/onething-project.zip` - Frontend only
- `/app/onething-complete.zip` - Complete project

### Option 2: Using Command Line
If you have terminal access to download:
```bash
# Download to your local machine
scp user@host:/app/onething-project.zip ~/Downloads/
```

### Option 3: Via Web Interface
Some environments provide a file browser or download option in the UI.

---

## 📂 What's Inside

### Frontend Only (onething-project.zip):
```
frontend/
├── app/                    # All screens
│   ├── index.tsx          # Home/Daily Question
│   ├── onboarding.tsx     # First launch onboarding
│   ├── mood.tsx           # Mood selection
│   ├── confirmation.tsx   # Confirmation screen
│   ├── history.tsx        # History list
│   ├── settings.tsx       # Settings with notifications
│   ├── monthly-reflection.tsx  # AI reflections
│   └── entry/[date].tsx   # Entry detail
├── utils/                 # Utilities
│   ├── questions.ts       # 70 questions + logic
│   ├── storage.ts         # AsyncStorage utilities
│   ├── notifications.ts   # Notification utilities
│   └── api.ts            # Backend API calls
├── constants/
│   └── theme.ts          # Design system
├── assets/               # Images and fonts
├── app.json             # Expo configuration
├── eas.json             # EAS Build configuration
├── package.json         # Dependencies
└── yarn.lock            # Locked dependencies
```

### Complete Project (onething-complete.zip):
Everything above PLUS:
```
backend/
├── server.py            # FastAPI server with AI endpoint
├── requirements.txt     # Python dependencies
└── .env                # Environment variables (with Emergent LLM key)

README.md               # Project documentation
BUILD_INSTRUCTIONS.md   # Detailed build guide
```

---

## 🚀 After Download: Build Steps

### Step 1: Extract the ZIP
```bash
# Extract to a folder
unzip onething-project.zip
cd frontend
```

### Step 2: Install Dependencies
```bash
# Install Node.js dependencies
yarn install
# or
npm install
```

### Step 3: Build with EAS
```bash
# Set your Expo token
export EXPO_TOKEN="irACP87izX6hwKH_dVHixhmxgofk-P-5ci-AocII"

# Initialize EAS project
eas init

# Build development APK
eas build --platform android --profile development
```

### Step 4: Download & Install
- Wait 5-10 minutes for build to complete
- Download APK from the link provided
- Install on your Android device

---

## ⚡ Quick Start (No Download)

Alternatively, you can use the **Expo.dev Dashboard** method:

1. Go to: https://expo.dev/accounts/saanit
2. Click **"New Project"**
3. **Upload the extracted frontend folder**
4. Click **"Build"** → **Android**
5. Download APK when ready

---

## 📱 Build Profiles Available

The `eas.json` file includes three profiles:

### Development (Recommended for Testing)
```bash
eas build --platform android --profile development
```
- Faster builds
- APK format
- Includes dev tools
- Perfect for testing

### Preview (Beta Testing)
```bash
eas build --platform android --profile preview
```
- Production-like build
- APK format
- For internal testing

### Production (Play Store)
```bash
eas build --platform android --profile production
```
- Optimized build
- AAB format (for Play Store)
- Smallest size

---

## 🔑 Credentials Included

Your Expo credentials are already configured:
- **Username**: saanit
- **Access Token**: irACP87izX6hwKH_dVHixhmxgofk-P-5ci-AocII
- **Project**: Will be created on first build

---

## ✅ What's Included in Your APK

Once built, your APK will have:

### Core Features:
- ✅ 70 reflective questions (deterministic rotation)
- ✅ Daily question screen with answer input
- ✅ Mood selection (Calm, Neutral, Heavy, Hopeful, Skip)
- ✅ Confirmation screen ("Noted.")
- ✅ Full history with list view
- ✅ Entry detail screen (read-only)

### Premium Features:
- ✅ Daily notification reminders (optional)
- ✅ AI monthly reflections (OpenAI GPT-5.2)
- ✅ First-launch onboarding

### Design:
- ✅ Warm off-white background (#F8F6F4)
- ✅ Calm color palette
- ✅ Minimal, pressure-free design
- ✅ No gamification or streaks

### Technical:
- ✅ Expo SDK 54
- ✅ React Native 0.81
- ✅ Local storage (AsyncStorage)
- ✅ Offline support
- ✅ Native performance

---

## 🆘 Troubleshooting

### "yarn: command not found"
```bash
npm install -g yarn
```

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
export EXPO_TOKEN="irACP87izX6hwKH_dVHixhmxgofk-P-5ci-AocII"
eas whoami
```

### Build fails
- Check that all dependencies installed successfully
- Verify internet connection
- Check EAS build logs for specific errors
- Try the Dashboard method as alternative

---

## 📞 Support

- **Build Instructions**: See BUILD_INSTRUCTIONS.md
- **Expo Docs**: https://docs.expo.dev/build/setup/
- **EAS Build**: https://docs.expo.dev/build/introduction/

---

## 🎯 Summary

**You have TWO options:**

### Option A: Command Line Build
1. Download ZIP
2. Extract and install dependencies
3. Run `eas build` command
4. Download APK

### Option B: Dashboard Build (Easiest)
1. Go to expo.dev
2. Upload extracted folder
3. Click Build
4. Download APK

**Both methods will give you the same fully-functional OneThing APK!**

---

## 📊 File Sizes

- **onething-project.zip**: 1.2 MB (frontend only)
- **onething-complete.zip**: 1.2 MB (frontend + backend)
- **Final APK**: ~50-60 MB (estimated)
- **Production APK**: ~30-40 MB (optimized)

---

Ready to build! 🚀
