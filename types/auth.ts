// Authentication-related types
import { ReactNode } from "react";
import { User } from "firebase/auth";

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
