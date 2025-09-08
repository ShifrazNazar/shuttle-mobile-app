// Firebase configuration and setup

import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import Constants from "expo-constants";

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  databaseURL?: string;
}

// Firebase configuration using environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "",
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || "",
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || "",
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || "",
  messagingSenderId:
    Constants.expoConfig?.extra?.firebaseMessagingSenderId || "",
  appId: Constants.expoConfig?.extra?.firebaseAppId || "",
  measurementId:
    Constants.expoConfig?.extra?.firebaseMeasurementId ||
    process.env.FIREBASE_MEASUREMENT_ID,
  databaseURL:
    Constants.expoConfig?.extra?.firebaseDatabaseURL ||
    process.env.FIREBASE_DATABASE_URL,
};

console.log("[DEBUG] Firebase config:", firebaseConfig);

// Validate required configuration
const requiredConfig: (keyof FirebaseConfig)[] = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];
const missingConfig = requiredConfig.filter((key) => !firebaseConfig[key]);

if (missingConfig.length > 0) {
  console.error("Missing Firebase configuration:", missingConfig);
  console.error("Please set the following environment variables:");
  missingConfig.forEach((key) => {
    console.error(`- ${key.toUpperCase()}`);
  });
}

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore
import { getFirestore } from "firebase/firestore";
export const firestore = getFirestore(app);
