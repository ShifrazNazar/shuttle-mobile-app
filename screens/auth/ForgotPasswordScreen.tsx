import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async (): Promise<void> => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        "Password Reset Sent",
        "If an account with this email exists, you will receive a password reset link shortly. Please check your email and spam folder.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      // Don't reveal if email exists or not for security
      Alert.alert(
        "Password Reset Sent",
        "If an account with this email exists, you will receive a password reset link shortly. Please check your email and spam folder.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 theme-bg">
      {/* Header */}
      <View className="bg-white border-b border-[#e5e7eb] px-6 pt-12 pb-6">
        <View className="items-center">
          <Text className="text-3xl font-bold theme-text-primary mb-2">
            Smart Shuttle
          </Text>
          <Text className="theme-text-secondary text-center text-base">
            Asia Pacific University
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6 pt-8">
        <View className="mb-8">
          <Text className="text-2xl font-bold theme-text-primary mb-2">
            Forgot Password
          </Text>
          <Text className="theme-text-secondary text-base">
            Enter your email address and we'll send you a link to reset your
            password
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="theme-text-primary mb-2 font-medium">
              Email Address
            </Text>
            <TextInput
              className="theme-input"
              placeholder="Enter your email address"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            className={`rounded-[10px] py-4 mt-6 ${
              loading ? "bg-[#94a3b8]" : "theme-button-primary"
            }`}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Send Reset Link
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity className="mt-4" onPress={() => router.back()}>
            <Text className="theme-text-secondary text-center text-base">
              ← Back to Login
            </Text>
          </TouchableOpacity>

          <View className="mt-8">
            <View className="theme-help-card">
              <Text className="theme-text-primary font-medium mb-2">
                💡 Need Help?
              </Text>
              <Text className="theme-text-secondary text-sm">
                If you're having trouble accessing your account, contact your
                administrator at:
              </Text>
              <Text className="theme-text-primary text-sm font-medium mt-1">
                admin@apu.edu.my
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
