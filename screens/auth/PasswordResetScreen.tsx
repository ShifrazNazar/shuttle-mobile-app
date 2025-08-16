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

const PasswordResetScreen: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { updatePassword } = useAuth();

  const handlePasswordUpdate = async (): Promise<void> => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const result = await updatePassword(newPassword);
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", "Password updated successfully!");
      router.push("/");
    } else {
      Alert.alert("Password Update Failed", result.error);
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
            Change Password
          </Text>
          <Text className="theme-text-secondary text-base">
            Please change your default password for security
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="theme-text-primary mb-2 font-medium">
              New Password
            </Text>
            <TextInput
              className="theme-input"
              placeholder="Enter your new password"
              placeholderTextColor="#94a3b8"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="theme-text-primary mb-2 font-medium">
              Confirm New Password
            </Text>
            <TextInput
              className="theme-input"
              placeholder="Confirm your new password"
              placeholderTextColor="#94a3b8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            className={`rounded-[10px] py-4 mt-6 ${
              loading ? "bg-[#94a3b8]" : "theme-button-primary"
            }`}
            onPress={handlePasswordUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Update Password
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PasswordResetScreen;
