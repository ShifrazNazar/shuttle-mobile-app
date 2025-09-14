import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { LocationObject } from "expo-location";
import {
  getCurrentLocation,
  startLocationTracking,
} from "../../services/location";
import {
  stopDriverLocation,
  updateDriverLocation,
} from "../../services/firebase-realtime";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import { DEMO_CONFIGS, demoService } from "../../services/demo";

// Import components
import DashboardHeader from "../../components/common/DashboardHeader";
import StatusCard from "../../components/common/StatusCard";
import TrackingButton from "../../components/driver/TrackingButton";
import BusAssignmentCard from "../../components/driver/BusAssignmentCard";
import RouteAssignmentCard from "../../components/driver/RouteAssignmentCard";

// Import hooks and types
import { useDriverRouteAssignments } from "../../hooks/useDriverRouteAssignments";
import { DriverDashboardProps } from "../../types";

const DriverDashboard: React.FC<DriverDashboardProps> = () => {
  const { signOut, user } = useAuth();
  const { assignments: assignedRoutes, loading: routesLoading } =
    useDriverRouteAssignments(user?.uid || "");
  const [isTracking, setIsTracking] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
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

  // Route assignments are now managed by useDriverRouteAssignments hook

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

    // Route assignments are automatically managed by useDriverRouteAssignments hook
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

    // Stop demo if running
    if (isDemoMode) {
      await demoService.stopDemo(driverId, busId);
      setIsDemoMode(false);
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

  const startDemo = async () => {
    if (!busId) {
      Alert.alert("Error", "Please assign a bus ID first");
      return;
    }

    try {
      // Use the first assigned route for demo, or default to R001
      const demoRouteId =
        assignedRoutes.length > 0 ? assignedRoutes[0].routeId : "R001";
      const demoConfig =
        DEMO_CONFIGS[demoRouteId as keyof typeof DEMO_CONFIGS] ||
        DEMO_CONFIGS.R001;

      const config = {
        ...demoConfig,
        busId,
        driverId,
        driverEmail: user?.email || "",
        routeName:
          assignedRoutes.length > 0
            ? assignedRoutes[0].routeName
            : "Demo Route",
        waypoints: demoConfig.waypoints.map((wp) => ({
          latitude: wp.lat,
          longitude: wp.lng,
        })),
      };

      await demoService.startDemo(config);
      setIsDemoMode(true);
      setIsTracking(true);
      Alert.alert(
        "Demo Started",
        `Simulating ${demoRouteId} route with bus ${busId}`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to start demo");
      console.error(error);
    }
  };

  const stopDemo = async () => {
    try {
      await demoService.stopDemo(driverId, busId);
      setIsDemoMode(false);
      setIsTracking(false);
      Alert.alert("Demo Stopped", "Demo simulation ended");
    } catch (error) {
      Alert.alert("Error", "Failed to stop demo");
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f7f8fb]">
      {/* Header */}
      <DashboardHeader
        title="Driver Dashboard"
        subtitle="Share your location with students"
        icon="🚗"
        onSignOut={handleSignOut}
      />

      <View className="flex-1 p-6">
        {/* Demo Mode Toggle */}
        {!isTracking && (
          <View className="mb-4">
            <TouchableOpacity
              className={`p-4 rounded-[12px] border-2 ${
                isDemoMode
                  ? "bg-[#8b5cf6] border-[#8b5cf6]"
                  : "bg-white border-[#e5e7eb]"
              }`}
              onPress={() => {
                if (isDemoMode) {
                  stopDemo();
                } else {
                  startDemo();
                }
              }}
              disabled={!busId}
            >
              <Text
                className={`text-center font-semibold ${
                  isDemoMode ? "text-white" : "text-gray-700"
                }`}
              >
                {isDemoMode ? "🎭 Demo Mode Active" : "🎭 Start Demo Mode"}
              </Text>
              <Text
                className={`text-center text-sm mt-1 ${
                  isDemoMode ? "text-purple-100" : "text-gray-500"
                }`}
              >
                {isDemoMode
                  ? "Simulating bus movement along route"
                  : "Simulate bus movement for demonstration"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Main Tracking Button */}
        <View className="mb-6">
          <TrackingButton
            isTracking={isTracking}
            busId={busId}
            onStartTracking={startTracking}
            onStopTracking={stopLocationTracking}
            isDemoMode={isDemoMode}
            onStartDemo={startDemo}
            onStopDemo={stopDemo}
          />
        </View>

        {/* Assigned Bus Info */}
        <BusAssignmentCard
          busId={busId}
          routeName={
            assignedRoutes.length > 0
              ? assignedRoutes[0].routeName
              : "No route assigned"
          }
          isActive={isTracking}
          onPress={() => {}}
        />

        {/* Assigned Routes Info */}
        {assignedRoutes.map((assignment) => (
          <RouteAssignmentCard
            key={assignment.id}
            assignment={assignment}
            onPress={() => {}}
          />
        ))}

        {/* Status */}
        <StatusCard
          title="Status"
          icon="📊"
          items={[
            {
              label: "Mode",
              value: isDemoMode ? "🎭 DEMO" : "📍 REAL",
              type: "status",
              statusColor: isDemoMode ? "blue" : "green",
            },
            {
              label: "Location",
              value: isTracking ? "🟢 ACTIVE" : "🔴 INACTIVE",
              type: "status",
              statusColor: isTracking ? "green" : "red",
            },
            {
              label: "Bus",
              value: busId || "Not assigned",
            },
            {
              label: "Routes",
              value: assignedRoutes.length.toString(),
            },
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

export default DriverDashboard;
