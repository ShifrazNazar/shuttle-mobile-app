import React, { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import AdminDemoControl from "../screens/admin/AdminDemoControl";
import LoadingScreen from "../components/common/LoadingScreen";

export default function AdminScreen() {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (role !== "admin") {
        router.replace("/");
      }
    }
  }, [user, role, loading]);

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Show loading while redirecting
  if (!user || role !== "admin") {
    return <LoadingScreen message="Redirecting..." />;
  }

  return <AdminDemoControl />;
}
