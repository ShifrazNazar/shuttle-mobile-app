import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { LocationObject } from "expo-location";
import {
  startLocationTracking,
  getCurrentLocation,
} from "../../services/location";
import {
  updateDriverLocation,
  stopDriverLocation,
} from "../../services/firebase-realtime";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

interface DriverDashboardProps {
  navigation: any;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ navigation }) => {
  const { signOut, user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationObject | null>(
    null
  );
  const [driverId, setDriverId] = useState(user?.uid || "");
  const [busId, setBusId] = useState("BUS001");
  const [stopTracking, setStopTracking] = useState<(() => void) | null>(null);

  // Update driverId when user changes
  useEffect(() => {
    if (user?.uid) {
      setDriverId(user.uid);
    }
  }, [user]);

  const handleSignOut = async () => {
    const result = await signOut();
    if (!result.success) {
      Alert.alert("Error", result.error);
    } else {
      router.replace("/");
    }
  };

  useEffect(() => {
    // Get initial location
    getCurrentLocation().then(setCurrentLocation);
  }, []);

  const startTracking = async () => {
    try {
      const unsubscribe = await startLocationTracking((location) => {
        setCurrentLocation(location);

        // Update Firebase with new location including driver email
        updateDriverLocation(
          driverId,
          busId,
          location.coords.latitude,
          location.coords.longitude,
          user?.email || undefined
        );
      });

      setStopTracking(() => unsubscribe);
      setIsTracking(true);
      Alert.alert("Success", "Location sharing started!");
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to start location sharing. Please check permissions."
      );
      console.error(error);
    }
  };

  const stopLocationTracking = async () => {
    if (stopTracking) {
      stopTracking();
      setStopTracking(null);
    }

    // Remove driver from active drivers in Firebase
    try {
      await stopDriverLocation(driverId);
    } catch (error) {
      console.error("Error stopping driver location:", error);
    }

    setIsTracking(false);
    Alert.alert("Success", "Location sharing stopped!");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-6">
        {/* Header */}
        <View className="flex-col justify-between items-center mb-8">
          <Text className="text-2xl font-bold text-gray-800">
            🚗 Location Sharing
          </Text>
          <Text className="text-gray-600">
            Share your location with students
          </Text>
        </View>

        {/* Main Tracking Button */}
        <View className="flex-1 justify-center">
          {!isTracking ? (
            <TouchableOpacity
              className="bg-green-500 p-8 rounded-xl items-center"
              onPress={startTracking}
            >
              <Text className="text-white text-2xl font-bold mb-2">
                ▶️ Start Sharing Location
              </Text>
              <Text className="text-white text-base opacity-90">
                Students will see your location in real-time
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-red-500 p-8 rounded-xl items-center"
              onPress={stopLocationTracking}
            >
              <Text className="text-white text-2xl font-bold mb-2">
                ⏹️ Stop Sharing Location
              </Text>
              <Text className="text-white text-base opacity-90">
                Location sharing is currently active
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Status */}
        <View className="bg-gray-50 p-4 rounded-lg mb-6">
          <Text className="text-lg font-bold mb-4 text-gray-800">
            📊 Status
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-base text-gray-600">Location Sharing:</Text>
            <Text
              className={`text-base font-bold ${
                isTracking ? "text-green-500" : "text-red-500"
              }`}
            >
              {isTracking ? "🟢 ACTIVE" : "🔴 INACTIVE"}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-base text-gray-600">Bus ID:</Text>
            <Text className="text-base font-bold">{busId}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-base text-gray-600">Driver Email:</Text>
            <Text className="text-base font-bold">
              {user?.email || "Not available"}
            </Text>
          </View>
          {currentLocation && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-base text-gray-600">Last Update:</Text>
              <Text className="text-base font-bold">
                {new Date(currentLocation.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity
            className="bg-red-500 px-4 py-2 rounded-lg"
            onPress={handleSignOut}
          >
            <Text className="text-white font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DriverDashboard;
