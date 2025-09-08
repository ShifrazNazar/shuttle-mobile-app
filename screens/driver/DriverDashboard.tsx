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

// Import components
import DashboardHeader from "../../components/common/DashboardHeader";
import StatusCard from "../../components/common/StatusCard";
import TrackingButton from "../../components/driver/TrackingButton";
import BusAssignmentCard from "../../components/driver/BusAssignmentCard";
import RouteAssignmentCard from "../../components/driver/RouteAssignmentCard";

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

        {/* Assigned Bus Info */}
        <BusAssignmentCard busId={busId} />

        {/* Assigned Routes Info */}
        <RouteAssignmentCard
          assignedRoutes={assignedRoutes}
          routesLoading={routesLoading}
        />

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
              value: assignedRoutes.length,
            },
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

export default DriverDashboard;
