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
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-5">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-2">
            Change Password
          </Text>
          <Text className="text-center text-gray-600">
            Please change your default password for security
          </Text>
        </View>

        <View className="gap-4">
          <View>
            <Text className="text-gray-700 mb-2 font-medium">New Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-white"
              placeholder="Enter your new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-medium">
              Confirm New Password
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-white"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            className={`rounded-lg py-3 mt-6 ${
              loading ? "bg-gray-400" : "bg-blue-500"
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
