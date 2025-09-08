import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-[#f7f8fb]">
      {/* Header */}
      <View className="bg-white border-b border-[#e5e7eb] px-6 pt-12 pb-6">
        <View className="items-center">
          <Text className="text-3xl font-bold text-[#0f172a] mb-2">
            Smart Shuttle
          </Text>
          <Text className="text-[#475569] text-center text-base">
            Asia Pacific University
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6 pt-6">
        {/* Welcome Section */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-[#0f172a] mb-1">
            Welcome
          </Text>
          <Text className="text-[#475569] text-sm">
            Choose your role to access the shuttle system
          </Text>
        </View>

        <View className="flex-col gap-4 mt-8">
          {/* Driver Card */}
          <TouchableOpacity
            className="bg-white p-5 rounded-[12px] border border-[#e5e7eb] shadow-sm"
            onPress={() => router.push("/driver")}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="bg-[#dbeafe] p-3 rounded-[8px] mr-4">
                <Text className="text-xl">🚗</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-[#0f172a] mb-2">
                  Driver Mode
                </Text>
                <Text className="text-[#475569] text-sm leading-5">
                  Share your location and manage passenger check-ins
                </Text>
              </View>
              <View className="bg-[#2563eb] p-2 rounded-[8px]">
                <Text className="text-white text-sm font-medium">→</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View className="h-px bg-[#e5e7eb] my-4" />

          {/* Student Card */}
          <TouchableOpacity
            className="bg-white p-5 rounded-[12px] border border-[#e5e7eb] shadow-sm"
            onPress={() => router.push("/student")}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="bg-[#e0e7ff] p-3 rounded-[8px] mr-4">
                <Text className="text-xl">🎓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-[#0f172a] mb-2">
                  Student Mode
                </Text>
                <Text className="text-[#475569] text-sm leading-5">
                  Track shuttles in real-time and plan your journey
                </Text>
              </View>
              <View className="bg-[#2563eb] p-2 rounded-[8px]">
                <Text className="text-white text-sm font-medium">→</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Footer */}
        <View className="mt-auto pt-6 pb-6">
          <View className="bg-white p-4 rounded-[10px] border border-[#e5e7eb]">
            <Text className="text-xs text-[#475569] text-center">
              Asia Pacific University of Technology & Innovation
            </Text>
            <Text className="text-xs text-[#94a3b8] text-center mt-1">
              Smart Shuttle System v1.0
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
