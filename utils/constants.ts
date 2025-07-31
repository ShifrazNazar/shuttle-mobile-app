// Configuration constants - avoid hardcoding values

export interface AppConfig {
  apiBaseUrl: string;
  googleMapsApiKey: string;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  notificationConfig: {
    defaultSound: string;
    defaultBadge: number;
  };
}

export interface ApiEndpoints {
  auth: {
    login: string;
    register: string;
    logout: string;
  };
  shuttle: {
    locations: string;
    routes: string;
    stops: string;
  };
  notifications: {
    tokens: string;
    send: string;
  };
}

export const APP_CONFIG: AppConfig = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.example.com",
  googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  firebaseConfig: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId:
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
  },
  notificationConfig: {
    defaultSound: "default",
    defaultBadge: 1,
  },
};

export const API_ENDPOINTS: ApiEndpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },
  shuttle: {
    locations: "/shuttle/locations",
    routes: "/shuttle/routes",
    stops: "/shuttle/stops",
  },
  notifications: {
    tokens: "/notifications/tokens",
    send: "/notifications/send",
  },
};
