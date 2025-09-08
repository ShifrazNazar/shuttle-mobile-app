import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="mt-4 text-gray-600">{message}</Text>
    </View>
  );
};

export default LoadingScreen;
