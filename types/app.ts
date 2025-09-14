// App configuration and general types
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
