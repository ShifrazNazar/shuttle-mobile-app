// Authentication-related types
import { ReactNode } from "react";
import { User } from "firebase/auth";

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  isFirstTimeLogin: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

// Digital Travel Card Types
export interface DigitalTravelCard {
  cardId: string;
  studentId: string;
  userId: string;
  qrCode: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

export interface BoardingRecord {
  recordId: string;
  studentId: string;
  driverId: string;
  shuttleId: string;
  routeId: string;
  boardingTime: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  status: "success" | "failed" | "invalid";
  reason?: string;
}

export interface QRCodeData {
  studentId: string;
  userId: string;
  timestamp: number;
  signature: string;
}
