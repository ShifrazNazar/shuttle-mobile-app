# 🚍 Smart University Shuttle System - Mobile App

**A comprehensive React Native mobile application for university shuttle management.**  
Students and drivers get real-time GPS tracking, digital travel cards, and seamless shuttle management through a unified cross-platform app built with Expo.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

---

## 🧭 Project Overview

The Smart University Shuttle System Mobile App is part of a comprehensive transportation management solution that provides real-time shuttle tracking, digital travel card management, and AI-powered analytics. The mobile app serves as the primary interface for students and drivers, offering seamless navigation, real-time location sharing, and digital boarding capabilities.

### System Architecture

- **Mobile App**: React Native with Expo (this repository)
- **Web Dashboard**: Next.js 15 admin interface for fleet management
- **Backend**: Firebase services (Firestore, Realtime Database, Authentication)
- **AI Integration**: Google Gemini AI for demand prediction and analytics

---

## 🎯 App Objectives

### For Students

- **Real-time Shuttle Tracking**: Live GPS location updates with interactive map visualization
- **Route Management**: View available routes, schedules, and real-time status
- **Digital Travel Card**: QR code-based boarding system with usage tracking
- **Interactive Maps**: Real-time shuttle locations with route visualization
- **Route Filtering**: Filter routes by various criteria for better navigation

### For Drivers

- **GPS Location Broadcasting**: Background location sharing with configurable intervals
- **Route Assignment Management**: View assigned routes and schedules
- **QR Code Scanner**: Student boarding verification and validation
- **Location Tracking**: Start/stop location sharing functionality

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

### 💳 Digital Check-in System

- QR code boarding
- Digital travel card validation
- Usage analytics and reporting

### 📅 Dynamic Scheduling

- Real-time schedule updates
- AI-powered demand prediction

---

## ⚙️ Tech Stack

| Category         | Technology                     | Version  |
| ---------------- | ------------------------------ | -------- |
| Framework        | React Native with Expo SDK     | v52.0.47 |
| Maps & Location  | Google Maps API, Expo Location | v18.0.10 |
| Authentication   | Firebase Auth                  | v12.0.0  |
| Real-time Data   | Firebase Firestore/RTDB        | v12.0.0  |
| QR Code Scanning | Expo Camera                    | v16.0.18 |
| State Management | React Context API              | Built-in |
| Navigation       | Expo Router                    | v4.0.21  |
| Styling          | NativeWind (Tailwind CSS)      | v4.1.23  |

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
