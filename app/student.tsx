import React, { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import StudentDashboard from "../screens/student/StudentDashboard";
import LoadingScreen from "../components/common/LoadingScreen";

export default function StudentScreen() {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (role !== "student") {
        router.replace("/");
      }
    }
  }, [user, role, loading]);

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Show loading while redirecting
  if (!user || role !== "student") {
    return <LoadingScreen message="Redirecting..." />;
  }

  return <StudentDashboard navigation={null} />;
}
