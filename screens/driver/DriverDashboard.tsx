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

// Import components
import DashboardHeader from "../../components/common/DashboardHeader";
import StatusCard from "../../components/common/StatusCard";
import TrackingButton from "../../components/driver/TrackingButton";
import BusAssignmentCard from "../../components/driver/BusAssignmentCard";
import RouteAssignmentCard from "../../components/driver/RouteAssignmentCard";
import QRCodeScannerComponent from "../../components/driver/QRCodeScanner";

// Import hooks and types
import { useDriverRouteAssignments } from "../../hooks/useDriverRouteAssignments";
import { DriverDashboardProps } from "../../types";

const DriverDashboard: React.FC<DriverDashboardProps> = () => {
  const { signOut, user } = useAuth();
  const { assignments: assignedRoutes } = useDriverRouteAssignments(
    user?.uid || ""
  );
  const [isTracking, setIsTracking] = useState(false);
  const [driverId, setDriverId] = useState(user?.uid || "");
  const [busId, setBusId] = useState("");
  const [stopTracking, setStopTracking] = useState<(() => void) | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [currentRouteId, setCurrentRouteId] = useState("");
  const [currentLocation, setCurrentLocation] = useState<LocationObject | null>(
    null
  );

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
      console.error("Error starting tracking:", error);
      Alert.alert(
        "Error",
        "Failed to start location sharing. Please check permissions."
      );
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

  const handleQRScannerPress = () => {
    if (assignedRoutes.length > 0) {
      setCurrentRouteId(assignedRoutes[0].routeId);
      setShowQRScanner(true);
    } else {
      Alert.alert(
        "No Route Assigned",
        "Please wait for a route assignment before scanning QR codes."
      );
    }
  };

  const handleBoardingSuccess = (record: any) => {
    // Additional logic can be added here if needed
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
        {/* Main Tracking Button */}
        <View className="mb-6">
          <TrackingButton
            isTracking={isTracking}
            busId={busId}
            onStartTracking={startTracking}
            onStopTracking={stopLocationTracking}
          />
        </View>

        {/* QR Scanner Button */}
        <View className="mb-6">
          <TouchableOpacity
            className={`py-4 px-6 rounded-lg flex-row items-center justify-center ${
              isTracking ? "bg-blue-600" : "bg-gray-400"
            }`}
            onPress={handleQRScannerPress}
            disabled={false} // Always enabled for testing
          >
            <Text className="text-white text-lg font-semibold mr-2">📱</Text>
            <Text className="text-white text-lg font-semibold">
              Scan Student QR Code
            </Text>
          </TouchableOpacity>
          {!isTracking && (
            <Text className="text-gray-500 text-sm text-center mt-2">
              Note: Start tracking for full functionality
            </Text>
          )}
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

      {/* QR Scanner Modal */}
      <QRCodeScannerComponent
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        shuttleId={busId}
        routeId={currentRouteId}
        onBoardingSuccess={handleBoardingSuccess}
      />
    </SafeAreaView>
  );
};

export default DriverDashboard;
