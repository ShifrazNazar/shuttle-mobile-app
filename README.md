# 🚍 Smart Shuttle Mobile App

**A React Native app for university shuttle tracking.**  
Students and drivers get real-time GPS updates, smart schedules, and smooth digital check-ins — all from one unified app.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

---

## 🧭 Project Overview

To develop a cross-platform mobile app that enhances campus commuting by giving students and drivers real-time shuttle tracking, notifications, and optimized schedules via AI-powered demand prediction.

---

## 🎯 App Objectives

### For Students:

- Track shuttles in real time on interactive maps
- Receive arrival alerts and notifications
- Check in with digital travel cards (QR/NFC)
- View live schedules and route information
- Plan trips with accurate timing

### For Drivers:

- Update GPS location automatically in background
- Access assigned routes and schedules
- Report incidents (delays, breakdowns, route changes)
- Receive real-time updates from administrators

---

## 👥 User Roles

| Role         | Capabilities                                   |
| ------------ | ---------------------------------------------- |
| **Students** | Track buses, get notified, scan in, plan trips |
| **Drivers**  | Get routes, auto-send location, report issues  |

---

## 📲 Key Features

### 🔐 Authentication

- Institutional login for students/staff
- Driver credential system
- Role-based access control

### 🗺️ GPS & Real-time Tracking

- Live shuttle locations on map
- Background location updates for drivers
- Route visualization and progress tracking

### 🔔 Smart Notifications

- ETA alerts when shuttle approaches your stop
- Emergency and delay notifications
- Push notifications for service updates

### 💳 Digital Check-in System

- QR code or NFC-based boarding
- Digital travel card validation
- Usage analytics and reporting

### 📅 Dynamic Scheduling

- Real-time schedule updates
- Route change notifications
- AI-powered demand prediction

---

## ⚙️ Tech Stack

| Category           | Technology                     |
| ------------------ | ------------------------------ |
| Framework          | React Native with Expo SDK     |
| Maps & Location    | Google Maps API, Expo Location |
| Authentication     | Firebase Auth                  |
| Real-time Data     | Firebase Firestore/RTDB        |
| Push Notifications | Expo Push Notifications        |
| State Management   | Context API / Zustand          |
| Navigation         | React Navigation               |

---

## 📦 Project Structure

```
/smart-shuttle-app
├── /app                  # Entry point and route definitions
├── /assets                 # Images, fonts, static files
├── /components            # Reusable UI components
│   ├── /common           # Generic components
│   ├── /student          # Student-specific components
│   └── /driver           # Driver-specific components
├── /screens              # Screen components
│   ├── /auth            # Login/signup screens
│   ├── /student         # Student app screens
│   └── /driver          # Driver app screens
├── /services            # API and external service integrations
│   ├── /firebase        # Firebase configuration
│   ├── /location        # GPS and location services
│   └── /notifications   # Push notification logic
├── /contexts            # React Context providers
├── /utils               # Helper functions and constants
├── /hooks               # Custom React hooks
├── app.json             # Expo configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) / Android Emulator

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/smart-shuttle-app.git
   cd smart-shuttle-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device testing

### Development Options

- **[Development Build](https://docs.expo.dev/develop/development-builds/introduction/)** - Custom native runtime
- **[Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)** - Android testing
- **[iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)** - iOS testing
- **[Expo Go](https://expo.dev/go)** - Quick testing sandbox

---

## 🔧 Configuration

### Environment Setup

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
```

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication, Firestore, and Cloud Messaging
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Place configuration files in appropriate directories

---

## 📍 Location & GPS Notes

- **Drivers**: Require background location access for continuous tracking
- **Students**: Only need foreground location access for map viewing
- Uses `expo-location` with `TaskManager` for background updates
- Location permissions handled gracefully with fallback options

---

## 🔔 Push Notifications

- Built with `expo-notifications`
- User tokens stored for targeted messaging
- Supports both scheduled and real-time alerts
- Admin panel integration for broadcast messages

---

## 📚 Learn More

- **[Expo Documentation](https://docs.expo.dev/)** - Learn fundamentals and advanced topics
- **[Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)** - Step-by-step project tutorial
- **[React Native Docs](https://reactnative.dev/docs/getting-started)** - React Native fundamentals

---

## 🌐 Community

- **[Expo GitHub](https://github.com/expo/expo)** - Open source platform
- **[Discord Community](https://chat.expo.dev)** - Chat with developers
- **[Expo Forums](https://forums.expo.dev/)** - Community discussions

---

## 🔄 Reset Project

When ready to start fresh development:

```bash
npm run reset-project
```

This moves starter code to **app-example** directory and creates a blank **app** directory for your custom development.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Development Notes

- Use **feature-based folder structure** for scalability
- Keep **role-specific logic separated** (student vs. driver interfaces)
- Implement **modular services** for auth, location, database, and notifications
- Store configuration in `/utils/constants.js` - avoid hardcoding
- Follow React Native and Expo best practices for performance
- Implement proper error handling and offline functionality
