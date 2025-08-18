import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  LocationData,
  subscribeToBusLocation,
  getActiveBuses,
} from "../../services/firebase-realtime";
import { getCurrentLocation } from "../../services/location";
import { LocationObject } from "expo-location";
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

interface RouteData {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  operatingDays: string[];
  schedule: string[];
  specialNotes?: string;
}

interface RouteAssignment {
  id: string;
  routeId: string;
  routeName: string;
  driverId: string;
  driverEmail: string;
  driverUsername: string;
  busId: string;
  assignedAt: any;
  status: "active" | "inactive" | "temporary";
}

interface StudentDashboardProps {
  navigation: any;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ navigation }) => {
  const { signOut, user } = useAuth();
  const [busId, setBusId] = useState("");
  const [busLocation, setBusLocation] = useState<LocationData | null>(null);
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const [allBuses, setAllBuses] = useState<Record<string, LocationData>>({});
  const [isTracking, setIsTracking] = useState(false);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [routeAssignments, setRouteAssignments] = useState<RouteAssignment[]>(
    []
  );
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [routesLoading, setRoutesLoading] = useState(true);
  const stopAlertShownRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);
  const mapRef = useRef<MapView | null>(null);
  const mapReadyRef = useRef(false);

  const handleSignOut = async () => {
    const result = await signOut();
    if (!result.success) {
      Alert.alert("Error", result.error);
    } else {
      router.replace("/");
    }
  };

  // Fetch routes data from Firestore
  const fetchRoutesData = async () => {
    try {
      // In a real app, you'd fetch this from Firestore
      // For now, we'll use the same static data structure as the admin routes page
      const routesData: RouteData[] = [
        {
          routeId: "R001",
          routeName: "LRT Bukit Jalil to APU",
          origin: "LRT - BUKIT JALIL",
          destination: "APU",
          operatingDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          schedule: [
            "07:30",
            "07:40",
            "07:45",
            "07:50",
            "07:55",
            "08:00",
            "08:05",
            "08:15",
            "08:20",
            "08:25",
            "08:30",
            "08:35",
            "08:45",
            "09:00",
            "09:10",
            "09:20",
            "09:30",
            "09:50",
            "10:00",
            "10:05",
            "10:10",
            "10:15",
            "10:30",
            "10:35",
            "10:45",
            "11:00",
            "11:05",
            "11:10",
            "11:25",
            "11:40",
            "12:10",
            "12:30",
            "12:45",
            "13:00",
            "13:15",
            "13:20",
            "13:25",
            "13:40",
            "14:10",
            "14:25",
            "14:40",
            "15:05",
            "15:20",
            "15:40",
            "15:55",
            "16:10",
            "16:25",
            "17:10",
            "17:20",
            "17:30",
            "18:20",
          ],
        },
        {
          routeId: "R002",
          routeName: "APU to LRT Bukit Jalil",
          origin: "APU",
          destination: "LRT - BUKIT JALIL",
          operatingDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          schedule: [
            "10:35",
            "10:45",
            "11:30",
            "11:50",
            "12:10",
            "12:35",
            "12:50",
            "13:05",
            "13:10",
            "13:15",
            "13:30",
            "14:00",
            "14:15",
            "14:30",
            "14:45",
            "15:10",
            "15:20",
            "15:30",
            "15:45",
            "15:50",
            "16:00",
            "16:15",
            "16:30",
            "16:45",
            "16:50",
            "17:00",
            "17:10",
            "17:20",
            "17:30",
            "17:40",
            "18:00",
            "18:10",
            "18:15",
            "18:30",
            "18:40",
            "18:55",
            "19:15",
            "20:45",
            "21:45",
          ],
        },
        {
          routeId: "R003",
          routeName: "M Vertica to APU",
          origin: "M VERTICA",
          destination: "APU",
          operatingDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          schedule: ["07:45", "09:45", "11:15", "14:30"],
        },
        {
          routeId: "R004",
          routeName: "APU to M Vertica",
          origin: "APU",
          destination: "M VERTICA",
          operatingDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          schedule: ["14:00", "15:00", "16:45", "17:45", "18:45"],
        },
        {
          routeId: "R005",
          routeName: "City of Green to APU",
          origin: "CITY OF GREEN",
          destination: "APU",
          operatingDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          schedule: [
            "07:45",
            "08:20",
            "09:00",
            "09:45",
            "11:00",
            "12:00",
            "13:00",
            "15:00",
          ],
        },
        {
          routeId: "R006",
          routeName: "APU to City of Green",
          origin: "APU",
          destination: "CITY OF GREEN",
          operatingDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          schedule: [
            "10:35",
            "11:30",
            "12:30",
            "14:30",
            "15:30",
            "16:00",
            "16:30",
            "17:40",
            "18:00",
            "18:40",
            "19:00",
            "20:45",
            "21:45",
          ],
        },
        {
          routeId: "R007",
          routeName: "Bloomsvale to APU",
          origin: "BLOOMSVALE",
          destination: "APU",
          operatingDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          schedule: ["07:45", "10:15"],
        },
        {
          routeId: "R008",
          routeName: "APU to Bloomsvale",
          origin: "APU",
          destination: "BLOOMSVALE",
          operatingDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          schedule: ["15:30", "18:30"],
        },
        {
          routeId: "R009",
          routeName: "Fortune Park to APU",
          origin: "FORTUNE PARK",
          destination: "APU",
          operatingDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          schedule: [
            "08:00",
            "08:15",
            "09:00",
            "09:30",
            "10:00",
            "10:15",
            "11:00",
            "11:30",
            "12:00",
            "13:30",
            "14:40",
            "15:40",
            "16:20",
            "16:40",
            "17:40",
            "18:10",
          ],
        },
        {
          routeId: "R010",
          routeName: "APU to Fortune Park",
          origin: "APU",
          destination: "FORTUNE PARK",
          operatingDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          schedule: [
            "10:30",
            "11:25",
            "13:00",
            "14:10",
            "15:00",
            "15:50",
            "16:20",
            "17:00",
            "17:40",
            "18:00",
            "18:40",
            "19:15",
          ],
        },
        {
          routeId: "R011",
          routeName: "APU to Mosque (Friday Only)",
          origin: "APU",
          destination: "MOSQUE",
          operatingDays: ["Friday"],
          schedule: ["12:30"],
          specialNotes: "Friday prayer service only",
        },
        {
          routeId: "R012",
          routeName: "Mosque to APU (Friday Only)",
          origin: "MOSQUE",
          destination: "APU",
          operatingDays: ["Friday"],
          schedule: ["13:30"],
          specialNotes: "Friday prayer service only",
        },
      ];

      setRoutes(routesData);
    } catch (error) {
      console.error("Error fetching routes data:", error);
    }
  };

  // Setup route assignments listener
  const setupRouteAssignmentsListener = () => {
    try {
      const assignmentsRef = collection(firestore, "routeAssignments");
      const assignmentsQuery = query(
        assignmentsRef,
        where("status", "==", "active")
      );

      const unsubscribe = onSnapshot(
        assignmentsQuery,
        (snapshot) => {
          const assignments: RouteAssignment[] = [];
          snapshot.forEach((doc) => {
            assignments.push({
              id: doc.id,
              ...doc.data(),
            } as RouteAssignment);
          });

          setRouteAssignments(assignments);
          setRoutesLoading(false);
        },
        (error) => {
          console.error("Error listening to route assignments:", error);
          setRoutesLoading(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up route assignments listener:", error);
      setRoutesLoading(false);
      return null;
    }
  };

  // Get drivers assigned to a specific route
  const getDriversByRouteId = (routeId: string) => {
    return routeAssignments.filter((a) => a.routeId === routeId);
  };

  // Get active buses for a specific route
  const getActiveBusesByRoute = (routeId: string) => {
    const routeDrivers = getDriversByRouteId(routeId);
    const routeBusIds = routeDrivers.map((d) => d.busId).filter(Boolean);

    return Object.entries(allBuses).filter(
      ([id, location]) => location.busId && routeBusIds.includes(location.busId)
    );
  };

  // Get route status (operating today or not)
  const getRouteStatus = (route: RouteData) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const isOperatingToday = route.operatingDays.includes(today);

    if (!isOperatingToday)
      return { status: "inactive", text: "Not Operating Today" };

    const now = new Date();
    const currentTime = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const nextDeparture = route.schedule.find((time) => time > currentTime);
    if (nextDeparture) {
      return { status: "active", text: `Next: ${nextDeparture}` };
    }

    return { status: "completed", text: "Service Ended" };
  };

  useEffect(() => {
    // Get user's current location
    getCurrentLocation().then(setUserLocation);

    // Subscribe to all active buses
    const unsubscribeAllBuses = getActiveBuses((buses) => {
      setAllBuses(buses);
    });

    // Fetch routes data
    fetchRoutesData();

    // Setup route assignments listener
    const unsubscribeRoutes = setupRouteAssignmentsListener();

    return () => {
      isMountedRef.current = false;
      // Cleanup tracking state
      setIsTracking(false);
      setBusLocation(null);
      setBusId("");

      unsubscribeAllBuses();
      if (unsubscribeRoutes) {
        unsubscribeRoutes();
      }
    };
  }, []);

  const startTrackingBusWithId = (busIdToTrack: string) => {
    if (!busIdToTrack.trim()) {
      Alert.alert("Error", "Invalid bus ID");
      return;
    }

    // Set bus ID and tracking state immediately
    setBusId(busIdToTrack);
    setIsTracking(true);
    stopAlertShownRef.current = null;

    // Show success message
    Alert.alert("Success", `Now tracking bus: ${busIdToTrack}`);
  };

  const stopTrackingBus = () => {
    setIsTracking(false);
    setBusLocation(null);
    setBusId(""); // Reset bus ID when stopping
    Alert.alert("Success", "Stopped tracking bus");
  };

  useEffect(() => {
    if (!isTracking || !busId || !busId.trim()) return;

    const unsubscribe = subscribeToBusLocation(busId, (location) => {
      if (!isMountedRef.current) return;
      if (
        location &&
        typeof location.latitude === "number" &&
        typeof location.longitude === "number" &&
        Number.isFinite(location.latitude) &&
        Number.isFinite(location.longitude)
      ) {
        setBusLocation(location);
      } else {
        // Driver stopped sharing location
        const currentBusId = busId;
        setBusLocation(null);
        setIsTracking((prev) => (prev ? false : prev));
        setBusId(""); // Reset bus ID
        if (stopAlertShownRef.current !== currentBusId && currentBusId) {
          stopAlertShownRef.current = currentBusId;
          try {
            setTimeout(() => {
              if (!isMountedRef.current) return;
              Alert.alert(
                "Driver Stopped Sharing",
                `Bus ${currentBusId} has stopped sharing location. You can select another active bus to track.`,
                [{ text: "OK" }]
              );
            }, 100);
          } catch (e) {
            // no-op: avoid crashing on alert edge-cases
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isTracking, busId]);

  const defaultRegion = {
    latitude: 3.055465,
    longitude: 101.700363,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const getMapRegion = () => {
    if (
      busLocation &&
      typeof busLocation.latitude === "number" &&
      typeof busLocation.longitude === "number" &&
      Number.isFinite(busLocation.latitude) &&
      Number.isFinite(busLocation.longitude)
    ) {
      return {
        latitude: busLocation.latitude,
        longitude: busLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    if (
      userLocation &&
      userLocation.coords &&
      typeof userLocation.coords.latitude === "number" &&
      typeof userLocation.coords.longitude === "number" &&
      Number.isFinite(userLocation.coords.latitude) &&
      Number.isFinite(userLocation.coords.longitude)
    ) {
      return {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    return defaultRegion;
  };

  useEffect(() => {
    const target = getMapRegion();
    if (mapReadyRef.current && mapRef.current) {
      try {
        mapRef.current.animateToRegion(target, 500);
      } catch (e) {
        console.error("Error animating to region:", e);
      }
    }
  }, [
    busLocation?.latitude,
    busLocation?.longitude,
    userLocation?.coords?.latitude,
    userLocation?.coords?.longitude,
  ]);

  return (
    <SafeAreaView className="flex-1 theme-bg">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white border-b border-[#e5e7eb] px-6 pt-12 pb-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-2xl font-bold theme-text-primary mb-2">
                🎓 Student Dashboard
              </Text>
              <Text className="theme-text-secondary text-base">
                Track your shuttle in real-time
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

        {/* Active Buses Section */}

        {/* Routes Section */}
        <View className="theme-card p-5 m-5">
          <Text className="text-lg font-bold mb-3 theme-text-primary">
            🛣️ Routes & Drivers
          </Text>
          <Text className="text-sm theme-text-secondary mb-4">
            See which drivers are active on each route
          </Text>

          {/* Route Filter */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 theme-text-primary">
              Filter by Route:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity
                className={`px-3 py-2 rounded-[8px] border ${
                  selectedRoute === ""
                    ? "bg-[#2563eb] border-[#2563eb]"
                    : "bg-white border-[#e5e7eb]"
                }`}
                onPress={() => setSelectedRoute("")}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedRoute === "" ? "text-white" : "text-gray-600"
                  }`}
                >
                  All Routes
                </Text>
              </TouchableOpacity>
              {routes.map((route) => (
                <TouchableOpacity
                  key={route.routeId}
                  className={`px-3 py-2 rounded-[8px] border ${
                    selectedRoute === route.routeId
                      ? "bg-[#2563eb] border-[#2563eb]"
                      : "bg-white border-[#e5e7eb]"
                  }`}
                  onPress={() => setSelectedRoute(route.routeId)}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedRoute === route.routeId
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {route.origin} → {route.destination}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Routes List */}
          {routesLoading ? (
            <View className="bg-[#f3f4f6] p-4 rounded-[8px]">
              <Text className="text-center text-[#6b7280]">
                Loading routes...
              </Text>
            </View>
          ) : (
            <View className="flex-col gap-3">
              {routes
                .filter(
                  (route) => !selectedRoute || route.routeId === selectedRoute
                )
                .map((route) => {
                  const routeStatus = getRouteStatus(route);
                  const routeDrivers = getDriversByRouteId(route.routeId);
                  const activeBuses = getActiveBusesByRoute(route.routeId);

                  return (
                    <View
                      key={route.routeId}
                      className="bg-white p-4 rounded-[8px] border border-[#e5e7eb]"
                    >
                      {/* Route Header */}
                      <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1">
                          <Text className="font-bold text-base text-gray-800 mb-1">
                            {route.routeName}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {route.origin} → {route.destination}
                          </Text>
                        </View>
                        <View
                          className={`px-2 py-1 rounded-[4px] ${
                            routeStatus.status === "active"
                              ? "bg-[#22c55e]"
                              : routeStatus.status === "completed"
                                ? "bg-[#6b7280]"
                                : "bg-[#f59e0b]"
                          }`}
                        >
                          <Text className="text-white text-xs font-medium">
                            {routeStatus.text}
                          </Text>
                        </View>
                      </View>

                      {/* Route Details */}
                      <View className="flex-row items-center gap-4 mb-3">
                        <View className="flex-row items-center gap-1">
                          <Text className="text-xs text-gray-500">📅</Text>
                          <Text className="text-xs text-gray-600">
                            {route.operatingDays.length === 7
                              ? "Daily"
                              : `${route.operatingDays.length} days/week`}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Text className="text-xs text-gray-500">🚌</Text>
                          <Text className="text-xs text-gray-600">
                            {routeDrivers.length} driver
                            {routeDrivers.length !== 1 ? "s" : ""}
                          </Text>
                        </View>
                      </View>

                      {/* Active Drivers for This Route */}
                      {activeBuses.length > 0 && (
                        <View className="mt-3 pt-3 border-t border-gray-200">
                          <Text className="text-sm font-medium text-gray-700 mb-2">
                            🚗 Active Drivers Coming Your Way:
                          </Text>
                          <View className="flex-col gap-2">
                            {activeBuses.map(([id, location]) => (
                              <View
                                key={id}
                                className="bg-[#eff6ff] p-2 rounded-[6px] border border-[#dbeafe]"
                              >
                                <View className="flex-row justify-between items-center">
                                  <View>
                                    <Text className="font-medium text-[#1e40af] text-sm">
                                      Bus {location.busId}
                                    </Text>
                                    <Text className="text-xs text-[#3b82f6]">
                                      Driver:{" "}
                                      {location.driverEmail ||
                                        location.driverId}
                                    </Text>
                                  </View>
                                  <TouchableOpacity
                                    className="bg-[#2563eb] px-2 py-1 rounded-[4px]"
                                    onPress={() =>
                                      startTrackingBusWithId(location.busId)
                                    }
                                  >
                                    <Text className="text-white text-xs font-medium">
                                      Track
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                <Text className="text-xs text-[#6b7280] mt-1">
                                  Last update:{" "}
                                  {location.timestamp
                                    ? new Date(
                                        location.timestamp
                                      ).toLocaleTimeString()
                                    : "Unknown"}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* No Active Drivers */}
                      {routeDrivers.length > 0 && activeBuses.length === 0 && (
                        <View className="mt-3 pt-3 border-t border-gray-200">
                          <View className="bg-[#fef3c7] p-2 rounded-[6px] border border-[#f59e0b]">
                            <Text className="text-xs text-[#92400e] text-center">
                              ⚠️ Drivers assigned but not currently active
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* No Drivers Assigned */}
                      {routeDrivers.length === 0 && (
                        <View className="mt-3 pt-3 border-t border-gray-200">
                          <View className="bg-[#f3f4f6] p-2 rounded-[6px] border border-[#d1d5db]">
                            <Text className="text-xs text-[#6b7280] text-center">
                              No drivers currently assigned to this route
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Special Notes */}
                      {route.specialNotes && (
                        <View className="mt-3 pt-3 border-t border-gray-200">
                          <View className="bg-[#fef3c7] p-2 rounded-[6px] border border-[#f59e0b]">
                            <Text className="text-xs text-[#92400e]">
                              ℹ️ {route.specialNotes}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
            </View>
          )}
        </View>

        {/* Map Section */}
        <View className="m-5 rounded-xl overflow-hidden shadow-lg">
          <View className="bg-white p-4 rounded-t-xl">
            <Text className="text-lg font-bold text-gray-800">
              🗺️ Live Tracking
            </Text>
            <Text className="text-sm text-gray-600">
              {busLocation && busLocation.busId
                ? `Tracking Bus ${busLocation.busId}`
                : "Click on an active bus above to start tracking"}
            </Text>
          </View>
          <View className="h-80">
            <MapView
              style={{ flex: 1 }}
              key={`map-${isTracking ? busId || "idle" : "idle"}`}
              ref={(ref) => (mapRef.current = ref)}
              onMapReady={() => {
                mapReadyRef.current = true;
                const initial = getMapRegion();
                try {
                  mapRef.current?.animateToRegion(initial, 0);
                } catch (e) {
                  console.error("Error animating to region:", e);
                }
              }}
              initialRegion={defaultRegion}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {/* Show tracked bus */}
              {busLocation &&
                typeof busLocation.latitude === "number" &&
                typeof busLocation.longitude === "number" && (
                  <Marker
                    coordinate={{
                      latitude: busLocation.latitude,
                      longitude: busLocation.longitude,
                    }}
                    title={`Bus ${busLocation.busId}`}
                    description={`Driver: ${busLocation.driverEmail || busLocation.driverId}`}
                    pinColor="red"
                  />
                )}

              {/* Show all active buses */}
              {Object.entries(allBuses).map(([id, location]) => {
                const latOk = typeof location.latitude === "number";
                const lngOk = typeof location.longitude === "number";
                if (!latOk || !lngOk) return null;
                return (
                  <Marker
                    key={id}
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    title={`Bus ${location.busId}`}
                    description={`Driver: ${location.driverEmail || location.driverId}`}
                    pinColor={id === busId ? "red" : "blue"}
                  />
                );
              })}
            </MapView>
          </View>
        </View>

        <View className="p-5 bg-white m-5 rounded-xl shadow-sm">
          <Text className="text-lg font-bold mb-4 text-gray-800">
            📊 Status
          </Text>
          <View className="flex-col gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-gray-600">Tracking:</Text>
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
              <Text className="text-base text-gray-600">Tracking:</Text>
              <Text className="text-base font-bold">
                {isTracking && busLocation ? `Bus ${busId}` : "None"}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-gray-600">Active Drivers:</Text>
              <Text className="text-base font-bold">
                {Object.keys(allBuses).length}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-gray-600">Routes:</Text>
              <Text className="text-base font-bold">{routes.length}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentDashboard;
