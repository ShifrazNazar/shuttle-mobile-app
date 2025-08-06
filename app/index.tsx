import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 bg-white p-6">
      {/* Header */}
      <View className="items-center mt-20 mb-12">
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          🚍 Smart Shuttle
        </Text>
        <Text className="text-gray-600 text-center">
          Choose your role to get started
        </Text>
      </View>

      {/* Role Buttons */}
      <View className="flex-1 justify-center space-y-4">
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg"
          onPress={() => router.push("/driver")}
        >
          <Text className="text-white text-lg font-semibold text-center">
            🚗 Driver Mode
          </Text>
          <Text className="text-white/80 text-sm text-center mt-1">
            Share your location with students
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-500 p-4 rounded-lg"
          onPress={() => router.push("/student")}
        >
          <Text className="text-white text-lg font-semibold text-center">
            🎓 Student Mode
          </Text>
          <Text className="text-white/80 text-sm text-center mt-1">
            Track shuttles in real-time
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View className="bg-gray-50 p-4 rounded-lg mb-6">
        <Text className="text-sm text-gray-600 text-center">
          Note: You'll need to sign up and log in first
        </Text>
      </View>
    </View>
  );
}
