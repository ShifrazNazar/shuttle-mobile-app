// Firebase configuration and setup

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FirebaseService {
  initializeApp: (config: FirebaseConfig) => void;
  auth: () => any;
  firestore: () => any;
  messaging: () => any;
}

export {};
