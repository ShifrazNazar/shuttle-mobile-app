// Service-related types

// Firebase Configuration
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  databaseURL?: string;
}

// Demo Service Types
export interface DemoConfig {
  routeId: string;
  routeName: string;
  busId: string;
  driverId: string;
  driverEmail: string;
  speed: number; // km/h
  updateInterval: number; // in milliseconds
  waypoints: Array<{
    latitude: number;
    longitude: number;
  }>;
}

export interface DemoState {
  isRunning: boolean;
  currentWaypointIndex: number;
  progress: number;
  startTime: number;
}
