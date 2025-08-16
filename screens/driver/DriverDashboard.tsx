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
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../services/firebase";

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
  const [busId, setBusId] = useState("");
  const [stopTracking, setStopTracking] = useState<(() => void) | null>(null);

  // Update driverId when user changes
  useEffect(() => {
    if (user?.uid) {
      setDriverId(user.uid);
    }
  }, [user]);

  // Fetch assigned bus from Firestore
  const fetchAssignedBus = async () => {
    if (!user?.uid) return;

    try {
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.assignedShuttleId) {
          setBusId(userData.assignedShuttleId);
        }
      }
    } catch (error) {
      console.error("Error fetching assigned bus:", error);
    }
  };

  const handleSignOut = async () => {
    // Stop location tracking before signing out
    if (isTracking) {
      await stopLocationTracking();
    }

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

    // Fetch assigned bus
    fetchAssignedBus();
  }, [user]);

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
    <SafeAreaView className="flex-1 theme-bg">
      {/* Header */}
      <View className="bg-white border-b border-[#e5e7eb] px-6 pt-12 pb-6">
        <View className="flex-col justify-between items-center">
          <Text className="text-2xl font-bold theme-text-primary">
            🚗 Driver Dashboard
          </Text>
          <Text className="theme-text-secondary text-base">
            Share your location with students
          </Text>
        </View>
      </View>

      <View className="flex-1 p-6">
        {/* Main Tracking Button */}
        <View className="flex-1 justify-center">
          {!isTracking ? (
            <TouchableOpacity
              className={`p-8 rounded-[12px] items-center ${
                busId ? "theme-button-primary" : "bg-[#94a3b8]"
              }`}
              onPress={startTracking}
              disabled={!busId}
            >
              <Text className="text-white text-2xl font-bold mb-2">
                ▶️ Start Sharing Location
              </Text>
              <Text className="text-white text-base opacity-90">
                {busId
                  ? "Students will see your location in real-time"
                  : "You need to be assigned to a bus first"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-[#ef4444] p-8 rounded-[12px] items-center"
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

        {/* Assigned Bus Info */}
        <View className="theme-card p-4 mb-4">
          <Text className="text-lg font-bold mb-4 theme-text-primary">
            🚌 Bus Assignment
          </Text>
          {busId ? (
            <View className="bg-[#22c55e] p-3 rounded-[8px]">
              <Text className="text-white text-center font-bold text-lg">
                Assigned to Bus: {busId}
              </Text>
              <Text className="text-white text-center text-sm opacity-90 mt-1">
                You can now start sharing your location
              </Text>
            </View>
          ) : (
            <View className="bg-[#f59e0b] p-3 rounded-[8px]">
              <Text className="text-white text-center font-bold text-lg">
                No Bus Assigned
              </Text>
              <Text className="text-white text-center text-sm opacity-90 mt-1">
                Contact administrator to get assigned to a bus
              </Text>
            </View>
          )}
        </View>

        {/* Status */}
        <View className="theme-card p-4 mb-6">
          <Text className="text-lg font-bold mb-4 theme-text-primary">
            📊 Status
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-base theme-text-secondary">
              Location Sharing:
            </Text>
            <Text
              className={`text-base font-bold ${
                isTracking ? "text-[#22c55e]" : "text-[#ef4444]"
              }`}
            >
              {isTracking ? "🟢 ACTIVE" : "🔴 INACTIVE"}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-base theme-text-secondary">Bus ID:</Text>
            <Text className="text-base font-bold theme-text-primary">
              {busId || "Not assigned"}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-base theme-text-secondary">
              Driver Email:
            </Text>
            <Text className="text-base font-bold theme-text-primary">
              {user?.email || "Not available"}
            </Text>
          </View>
          {currentLocation && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-base theme-text-secondary">
                Last Update:
              </Text>
              <Text className="text-base font-bold theme-text-primary">
                {new Date(currentLocation.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity
            className="bg-[#ef4444] px-4 py-2 rounded-[10px]"
            onPress={handleSignOut}
          >
            <Text className="text-white font-semibold text-sm">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DriverDashboard;
