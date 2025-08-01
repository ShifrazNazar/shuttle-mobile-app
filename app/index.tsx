import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // User is authenticated, redirect to home
      router.replace("/(auth)/home");
    }
  }, [user]);

  if (user) {
    // Show loading while redirecting
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  // Show login screen for unauthenticated users
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 px-6">
      <View className="w-full max-w-sm">
        <Text className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome to Shuttle App
        </Text>
        <Text className="text-center text-gray-600 mb-8">
          Your ride companion
        </Text>

        <View className="space-y-4">
          <View className="bg-blue-500 rounded-lg py-3">
            <Text
              className="text-white text-center font-semibold text-lg"
              onPress={() => router.push("/login")}
            >
              Sign In
            </Text>
          </View>

          <View className="bg-gray-100 rounded-lg py-3">
            <Text
              className="text-gray-800 text-center font-semibold text-lg"
              onPress={() => router.push("/signup")}
            >
              Create Account
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
