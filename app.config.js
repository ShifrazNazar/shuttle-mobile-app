import "dotenv/config";

export default {
  expo: {
    name: "shuttle-app",
    slug: "shuttle-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.shuttleapp",
      googleServicesFile: "./ios/GoogleService-Info.plist",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.anonymous.shuttleapp",
      googleServicesFile: "./android/app/google-services.json",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "This app needs location access to track shuttle bus locations. Background location allows continuous tracking even when the app is not active.",
          locationAlwaysPermission:
            "Background location is needed to continuously track shuttle bus locations and provide real-time updates to students.",
          locationWhenInUsePermission:
            "Location access is needed to track shuttle bus positions and provide real-time location updates.",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission:
            "This app needs camera access to scan student QR codes for boarding verification.",
        },
      ],
    ],
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
      firebaseDatabaseURL: process.env.FIREBASE_DATABASE_URL,
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
};
