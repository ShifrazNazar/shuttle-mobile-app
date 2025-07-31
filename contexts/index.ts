// React Context providers

export interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
}

export interface LocationContextType {
  currentLocation: any | null;
  locationPermission: boolean;
  updateLocation: (location: any) => void;
  requestLocationPermission: () => Promise<boolean>;
}

export interface NotificationContextType {
  notifications: any[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  clearAll: () => void;
}

export {};
