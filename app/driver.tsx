import React, { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import DriverDashboard from "../screens/driver/DriverDashboard";
import LoadingScreen from "../components/common/LoadingScreen";

export default function DriverScreen() {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (role !== "driver") {
        router.replace("/");
      }
    }
  }, [user, role, loading]);

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Show loading while redirecting
  if (!user || role !== "driver") {
    return <LoadingScreen message="Redirecting..." />;
  }

  return <DriverDashboard navigation={null} />;
}
