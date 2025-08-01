import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";

const HomeScreen: React.FC = () => {
  const { user, role, signOut } = useAuth();

  const handleSignOut = async (): Promise<void> => {
    const result = await signOut();
    if (!result.success) {
      Alert.alert("Error", result.error);
    } else {
      router.replace("/");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 px-6">
      <View className="w-full max-w-sm">
        <Text className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome!
        </Text>
        <Text className="text-center text-gray-600 mb-8">
          You are successfully signed in
        </Text>
        <Text className="text-center text-sm text-gray-500 mb-8">
          Email: {user?.email || "Unknown"}
        </Text>
        <Text className="text-center text-sm text-gray-500 mb-8">
          Role: {role || "Unknown"}
        </Text>
        <TouchableOpacity
          className="rounded-lg py-3 mt-6 bg-red-500"
          onPress={handleSignOut}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
