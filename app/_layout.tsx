import "./global.css";
import { AuthProvider } from "../contexts/AuthContext";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

function AuthGuard() {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Only redirect if user is authenticated and has a valid role
      if (user && role) {
        if (role === "driver") {
          router.replace("/driver");
        } else if (role === "student") {
          router.replace("/student");
        }
      }
    }
  }, [user, role, loading]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AuthProvider>
        <AuthGuard />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
