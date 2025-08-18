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
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../../services/firebase";

interface RouteAssignment {
  id: string;
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  status: "active" | "inactive" | "temporary";
  assignedAt: any;
}

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
  const [assignedRoutes, setAssignedRoutes] = useState<RouteAssignment[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);

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

  // Fetch assigned routes from Firestore
  const fetchAssignedRoutes = () => {
    if (!user?.uid) return;

    try {
      const routesRef = collection(firestore, "routeAssignments");
      const routesQuery = query(
        routesRef,
        where("driverId", "==", user.uid),
        where("status", "==", "active")
      );

      const unsubscribe = onSnapshot(
        routesQuery,
        (snapshot) => {
          const routes: RouteAssignment[] = [];
          snapshot.forEach((doc) => {
            routes.push({
              id: doc.id,
              ...doc.data(),
            } as RouteAssignment);
          });

          setAssignedRoutes(routes);
          setRoutesLoading(false);
        },
        (error) => {
          console.error("Error listening to route assignments:", error);
          setRoutesLoading(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching assigned routes:", error);
      setRoutesLoading(false);
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

    // Fetch assigned routes
    const unsubscribeRoutes = fetchAssignedRoutes();

    // Cleanup function
    return () => {
      if (unsubscribeRoutes) {
        unsubscribeRoutes();
      }
    };
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
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-2xl font-bold theme-text-primary mb-2">
              🚗 Driver Dashboard
            </Text>
            <Text className="theme-text-secondary text-base">
              Share your location with students
            </Text>
          </View>
          <TouchableOpacity
            className="bg-[#ef4444] px-4 py-2 rounded-[12px]"
            onPress={handleSignOut}
          >
            <Text className="text-white font-semibold text-sm">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 p-6">
        {/* Main Tracking Button */}
        <View className="mb-6">
          {!isTracking ? (
            <TouchableOpacity
              className={`p-8 rounded-[16px] items-center shadow-lg ${
                busId
                  ? "bg-[#2563eb] shadow-blue-200"
                  : "bg-[#94a3b8] shadow-gray-200"
              }`}
              onPress={startTracking}
              disabled={!busId}
            >
              <Text className="text-white text-3xl font-bold mb-3">
                ▶️ Start Sharing
              </Text>
              <Text className="text-white text-lg opacity-90 text-center">
                {busId
                  ? "Students can now track your bus in real-time"
                  : "You need to be assigned to a bus first"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-[#ef4444] p-8 rounded-[16px] items-center shadow-lg shadow-red-200"
              onPress={stopLocationTracking}
            >
              <Text className="text-white text-3xl font-bold mb-3">
                ⏹️ Stop Sharing
              </Text>
              <Text className="text-white text-lg opacity-90 text-center">
                Location sharing is currently active
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Assigned Bus Info */}
        <View className="theme-card p-4 mb-6 shadow-sm border border-[#e5e7eb]">
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

        {/* Assigned Routes Info */}
        <View className="theme-card p-4 mb-6 shadow-sm border border-[#e5e7eb]">
          <Text className="text-lg font-bold mb-3 theme-text-primary">
            🛣️ Your Routes
          </Text>
          {routesLoading ? (
            <View className="bg-[#f3f4f6] p-4 rounded-[12px]">
              <Text className="text-center text-[#6b7280]">Loading...</Text>
            </View>
          ) : assignedRoutes.length > 0 ? (
            <View className="flex flex-col gap-2">
              {assignedRoutes.map((route) => (
                <View
                  key={route.id}
                  className="bg-[#eff6ff] p-3 rounded-[12px] border border-[#dbeafe] mb-2"
                >
                  <Text className="text-[#1e40af] font-semibold text-base">
                    {route.routeName}
                  </Text>
                  <Text className="text-[#3b82f6] text-sm">
                    {route.origin} → {route.destination}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-[#fef3c7] p-4 rounded-[12px] border border-[#f59e0b]">
              <Text className="text-center text-[#92400e] font-medium">
                No routes assigned yet
              </Text>
            </View>
          )}
        </View>

        {/* Status */}
        <View className="theme-card p-4 mb-8 shadow-sm border border-[#e5e7eb]">
          <Text className="text-lg font-bold mb-3 theme-text-primary">
            📊 Status
          </Text>
          <View className="flex-col gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base theme-text-secondary">Location:</Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  isTracking ? "bg-[#22c55e]" : "bg-[#ef4444]"
                }`}
              >
                <Text className="text-white text-sm font-medium">
                  {isTracking ? "🟢 ACTIVE" : "🔴 INACTIVE"}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-base theme-text-secondary">Bus:</Text>
              <Text className="text-base font-bold theme-text-primary">
                {busId || "Not assigned"}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-base theme-text-secondary">Routes:</Text>
              <Text className="text-base font-bold theme-text-primary">
                {assignedRoutes.length}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DriverDashboard;
