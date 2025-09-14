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

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- Firebase project with Realtime Database enabled
- Google Maps API key

### Quick Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**

   ```bash
   cp env.example .env
   # Fill in your Firebase and Google Maps credentials
   ```

3. **Firebase Setup**
   - Create Firebase project and enable Realtime Database
   - Set database rules to allow read/write for testing

4. **Google Maps Setup**
   - Enable Maps SDK for Android and iOS
   - Create API key and add to `.env`

5. **Start the app**
   ```bash
   npx expo start
   ```

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
