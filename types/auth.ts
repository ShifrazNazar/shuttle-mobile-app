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
