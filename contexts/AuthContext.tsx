import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
  AuthError,
} from "firebase/auth";
import { auth, firestore } from "../services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Auth result interface
interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  role: string | null;
  signUp: (
    email: string,
    password: string,
    role: "student" | "driver"
  ) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch role from Firestore
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role || null);
          } else {
            setRole(null);
          }
        } catch (e) {
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign up with email and password and store role in Firestore
  const signUp = async (
    email: string,
    password: string,
    role: "student" | "driver"
  ): Promise<AuthResult> => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Store role in Firestore
      await setDoc(doc(firestore, "users", result.user.uid), {
        email,
        role,
      });
      setRole(role);
      return { success: true, user: result.user };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  };

  // Sign in with email and password and fetch role
  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Fetch role from Firestore
      try {
        const userDoc = await getDoc(doc(firestore, "users", result.user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role || null);
        } else {
          setRole(null);
        }
      } catch (e) {
        setRole(null);
      }
      return { success: true, user: result.user };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  };

  // Sign out
  const signOutUser = async (): Promise<AuthResult> => {
    try {
      await signOut(auth);
      setRole(null);
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  };

  const value: AuthContextType = {
    user,
    role,
    signUp,
    signIn,
    signOut: signOutUser,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
