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
import {
  DEMO_CONFIGS,
  demoService,
  startFullService,
  startBidirectionalDemo,
  stopAllDemos,
  getDemoStatus,
  getAvailableScenarios,
} from "../../services/demo";

// Import components
import DashboardHeader from "../../components/common/DashboardHeader";
import StatusCard from "../../components/common/StatusCard";
import TrackingButton from "../../components/driver/TrackingButton";
import BusAssignmentCard from "../../components/driver/BusAssignmentCard";
import RouteAssignmentCard from "../../components/driver/RouteAssignmentCard";
import DemoScenarioSelector from "../../components/driver/DemoScenarioSelector";

// Import hooks and types
import { useDriverRouteAssignments } from "../../hooks/useDriverRouteAssignments";
import { DriverDashboardProps } from "../../types";

const DriverDashboard: React.FC<DriverDashboardProps> = () => {
  const { signOut, user } = useAuth();
  const { assignments: assignedRoutes, loading: routesLoading } =
    useDriverRouteAssignments(user?.uid || "");
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationObject | null>(
    null
  );
  const [driverId, setDriverId] = useState(user?.uid || "");
  const [busId, setBusId] = useState("");
  const [stopTracking, setStopTracking] = useState<(() => void) | null>(null);
  const [activeDemoScenario, setActiveDemoScenario] = useState<string | null>(
    null
  );
  const [availableScenarios, setAvailableScenarios] = useState<any[]>([]);

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

    // Load available demo scenarios
    setAvailableScenarios(getAvailableScenarios());

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

    // Remove driver from active drivers in Firebase
    try {
      await stopDriverLocation(driverId);
    } catch (error) {
      console.error("Error stopping driver location:", error);
    }

    setIsTracking(false);
    Alert.alert("Success", "Location sharing stopped!");
  };

  const handleScenarioDemo = async (scenarioKey: string) => {
    try {
      if (activeDemoScenario === scenarioKey) {
        await stopAllDemos();
        setActiveDemoScenario(null);
        Alert.alert("Success", "Demo stopped!");
      } else {
        // Stop current demo if running
        if (activeDemoScenario) {
          await stopAllDemos();
        }

        // Start new scenario
        switch (scenarioKey) {
          case "FULL_SERVICE":
            await startFullService();
            break;
          case "BIDIRECTIONAL":
            await startBidirectionalDemo();
            break;
          default:
            Alert.alert("Error", "Unknown scenario");
            return;
        }

        setActiveDemoScenario(scenarioKey);
        const scenario = availableScenarios.find((s) => s.key === scenarioKey);
        Alert.alert("Success", `${scenario?.name} started!`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to control demo");
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
        {/* Demo Scenarios */}
        {!isTracking && (
          <DemoScenarioSelector
            scenarios={availableScenarios}
            activeScenario={activeDemoScenario}
            onScenarioSelect={handleScenarioDemo}
          />
        )}

        {/* Main Tracking Button */}
        <View className="mb-6">
          <TrackingButton
            isTracking={isTracking}
            busId={busId}
            onStartTracking={startTracking}
            onStopTracking={stopLocationTracking}
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
              label: "Location",
              value: isTracking ? "🟢 ACTIVE" : "🔴 INACTIVE",
              type: "status",
              statusColor: isTracking ? "green" : "red",
            },
            {
              label: "Demo Scenario",
              value: activeDemoScenario
                ? `🟢 ${activeDemoScenario}`
                : "🔴 NONE",
              type: "status",
              statusColor: activeDemoScenario ? "green" : "red",
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
