import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthError,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword as updateFirebasePassword,
  User,
} from "firebase/auth";
import { auth, firestore } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthResult, AuthContextType, AuthProviderProps } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch role from Firestore (document keyed by Auth UID)
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as {
              role?: string;
              defaultPassword?: string;
              passwordChanged?: boolean;
            };
            setUser(user);
            setRole(userData.role || null);
            // Check if this is first time login (has default password and hasn't changed it)
            setIsFirstTimeLogin(
              !!userData.defaultPassword && !userData.passwordChanged
            );
          } else {
            setUser(user);
            setRole(null);
            setIsFirstTimeLogin(false);
          }
        } catch (e) {
          setUser(user);
          setRole(null);
          setIsFirstTimeLogin(false);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign in with email and password and fetch role
  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Fetch role from Firestore using Auth UID
      try {
        const userDoc = await getDoc(doc(firestore, "users", result.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as {
            role?: string;
            defaultPassword?: string;
            passwordChanged?: boolean;
          };
          setRole(userData.role || null);
          // Check if this is first time login
          setIsFirstTimeLogin(
            !!userData.defaultPassword && !userData.passwordChanged
          );
        } else {
          setRole(null);
          setIsFirstTimeLogin(false);
        }
      } catch (e) {
        setRole(null);
        setIsFirstTimeLogin(false);
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
      setIsFirstTimeLogin(false);
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: result.user };
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

  // Update password (for first-time login)
  const updatePassword = async (newPassword: string): Promise<AuthResult> => {
    if (!user) {
      return { success: false, error: "No user logged in" };
    }

    try {
      // Update password in Firebase Auth
      await updateFirebasePassword(user, newPassword);

      // Update Firestore to mark password as changed
      await updateDoc(doc(firestore, "users", user.uid), {
        passwordChanged: true,
        updatedAt: new Date(),
      });

      setIsFirstTimeLogin(false);
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  };

  const value: AuthContextType = useMemo(
    () => ({
      user,
      role,
      loading,
      isFirstTimeLogin,
      signIn,
      signUp,
      signOut: signOutUser,
      resetPassword,
      updatePassword,
    }),
    [user, role, loading, isFirstTimeLogin]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
