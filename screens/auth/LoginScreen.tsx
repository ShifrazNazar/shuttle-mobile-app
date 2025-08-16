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

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn } = useAuth();

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      router.push("/");
    } else {
      // Handle login error
      console.error("Login failed:", result.error);
      Alert.alert(
        "Login Failed",
        result.error || "An unexpected error occurred"
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
            Welcome Back
          </Text>
          <Text className="theme-text-secondary text-base">
            Sign in to your account
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="theme-text-primary mb-2 font-medium">Email</Text>
            <TextInput
              className="theme-input"
              placeholder="Enter your email"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View>
            <Text className="theme-text-primary mb-2 font-medium">
              Password
            </Text>
            <TextInput
              className="theme-input"
              placeholder="Enter your password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            className={`rounded-[10px] py-4 mt-6 ${
              loading ? "bg-[#94a3b8]" : "theme-button-primary"
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="theme-text-secondary text-center text-sm">
              Contact your administrator to create an account
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
