import React, { useState, useEffect } from "react";
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

interface StudentDashboardProps {
  navigation: any;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ navigation }) => {
  const { signOut, user } = useAuth();
  const [busId, setBusId] = useState("BUS001");
  const [busLocation, setBusLocation] = useState<LocationData | null>(null);
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const [allBuses, setAllBuses] = useState<Record<string, LocationData>>({});
  const [isTracking, setIsTracking] = useState(false);

  const handleSignOut = async () => {
    const result = await signOut();
    if (!result.success) {
      Alert.alert("Error", result.error);
    } else {
      router.replace("/");
    }
  };

  useEffect(() => {
    // Get user's current location
    getCurrentLocation().then(setUserLocation);

    // Subscribe to all active buses
    const unsubscribeAllBuses = getActiveBuses((buses) => {
      setAllBuses(buses);
    });

    return () => {
      unsubscribeAllBuses();
    };
  }, []);

  const startTrackingBus = () => {
    if (!busId.trim()) {
      Alert.alert("Error", "Please enter a Bus ID");
      return;
    }

    setIsTracking(true);
    Alert.alert("Success", `Now tracking bus: ${busId}`);
  };

  const stopTrackingBus = () => {
    setIsTracking(false);
    setBusLocation(null);
    Alert.alert("Success", "Stopped tracking bus");
  };

  useEffect(() => {
    if (!isTracking || !busId) return;

    const unsubscribe = subscribeToBusLocation(busId, (location) => {
      setBusLocation(location);
    });

    return () => {
      unsubscribe();
    };
  }, [isTracking, busId]);

  const getMapRegion = () => {
    if (busLocation) {
      return {
        latitude: busLocation.latitude,
        longitude: busLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    if (userLocation) {
      return {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    // Default region (you can change this to your campus location)
    return {
      latitude: 3.055465,
      longitude: 101.700363,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  };

  return (
    <SafeAreaView className="flex-1 theme-bg">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white border-b border-[#e5e7eb] px-6 pt-12 pb-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-2xl font-bold theme-text-primary mb-1">
                🎓 Student Dashboard
              </Text>
              <Text className="theme-text-secondary text-base">
                Track your shuttle in real-time
              </Text>
              {user?.email && (
                <Text className="theme-text-muted text-sm mt-1">
                  Logged in as: {user.email}
                </Text>
              )}
            </View>
            <TouchableOpacity
              className="bg-[#ef4444] px-4 py-2 rounded-[10px]"
              onPress={handleSignOut}
            >
              <Text className="text-white font-semibold text-sm">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="theme-card p-5 m-5">
          <Text className="text-base font-bold mb-2 theme-text-primary">
            🚌 Bus ID to Track:
          </Text>
          <TextInput
            className="theme-input mb-4"
            placeholder="Enter Bus ID (e.g., BUS001)"
            placeholderTextColor="#94a3b8"
            value={busId}
            onChangeText={setBusId}
          />
          {!isTracking ? (
            <TouchableOpacity
              className={`p-4 rounded-[10px] items-center ${
                busId.trim() ? "theme-button-primary" : "bg-[#94a3b8]"
              }`}
              onPress={startTrackingBus}
              disabled={!busId.trim()}
            >
              <Text className="text-white text-lg font-bold">
                🔍 Track Bus {busId.trim() ? `(${busId})` : ""}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-[#ef4444] p-4 rounded-[10px] items-center"
              onPress={stopTrackingBus}
            >
              <Text className="text-white text-lg font-bold">
                ⏹️ Stop Tracking {busId}
              </Text>
            </TouchableOpacity>
          )}

          {/* Bus Status Info */}
          {busId.trim() && (
            <View className="mt-4 p-3 bg-[#f8fafc] rounded-[8px] border border-[#e2e8f0]">
              <Text className="text-sm theme-text-secondary text-center">
                {isTracking
                  ? `Currently tracking Bus ${busId}`
                  : `Ready to track Bus ${busId}`}
              </Text>
            </View>
          )}
        </View>

        {/* Available Buses */}
        {Object.keys(allBuses).length > 0 && (
          <View className="theme-card p-5 m-5">
            <Text className="text-base font-bold mb-3 theme-text-primary">
              🚌 Available Buses to Track
            </Text>
            <Text className="text-sm theme-text-secondary mb-3">
              Tap on a bus to start tracking it
            </Text>
            {Object.entries(allBuses).map(([id, location]) => (
              <TouchableOpacity
                key={id}
                className={`p-3 rounded-[8px] mb-2 border ${
                  busId === location.busId
                    ? "border-[#2563eb] bg-[#eff6ff]"
                    : "border-[#e5e7eb] bg-white"
                }`}
                onPress={() => setBusId(location.busId)}
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="font-semibold theme-text-primary">
                      Bus {location.busId}
                    </Text>
                    <Text className="text-sm theme-text-secondary">
                      Driver: {location.driverEmail || location.driverId}
                    </Text>
                  </View>
                  <View className="bg-[#22c55e] px-2 py-1 rounded-[4px]">
                    <Text className="text-white text-xs font-medium">
                      Active
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Map Section */}
        <View className="m-5 rounded-xl overflow-hidden">
          <View className="bg-white p-4 rounded-t-xl">
            <Text className="text-lg font-bold text-gray-800">
              🗺️ Live Bus Tracking
            </Text>
            <Text className="text-sm text-gray-600">
              {busLocation
                ? `Tracking Bus ${busLocation.busId}`
                : "Enter Bus ID to start tracking"}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {Object.keys(allBuses).length} active drivers on map
            </Text>
          </View>
          <View className="h-80">
            <MapView
              style={{ flex: 1 }}
              region={getMapRegion()}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {/* Show tracked bus */}
              {busLocation && (
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
              {Object.entries(allBuses).map(([id, location]) => (
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
              ))}
            </MapView>
          </View>
        </View>

        <View className="p-5 bg-white m-5 rounded-xl">
          <Text className="text-lg font-bold mb-4 text-gray-800">
            📊 Tracking Status
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-base text-gray-600">Status:</Text>
            <Text
              className={`text-base font-bold ${
                isTracking ? "text-green-500" : "text-red-500"
              }`}
            >
              {isTracking ? "🟢 TRACKING" : "🔴 NOT TRACKING"}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-base text-gray-600">Bus ID:</Text>
            <Text className="text-base font-bold">{busId}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-base text-gray-600">Active Drivers:</Text>
            <Text className="text-base font-bold">
              {Object.keys(allBuses).length}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-base text-gray-600">Your Email:</Text>
            <Text className="text-base font-bold">
              {user?.email || "Not logged in"}
            </Text>
          </View>
        </View>

        {busLocation && (
          <View className="p-5 bg-green-50 m-5 rounded-xl">
            <Text className="text-lg font-bold mb-4 text-gray-800">
              🚌 Tracked Bus: {busLocation.busId}
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">Driver:</Text>
              <Text className="text-sm font-bold text-gray-800">
                {busLocation.driverEmail || busLocation.driverId}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">Latitude:</Text>
              <Text className="text-sm font-bold text-gray-800">
                {busLocation.latitude.toFixed(6)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">Longitude:</Text>
              <Text className="text-sm font-bold text-gray-800">
                {busLocation.longitude.toFixed(6)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">Last Update:</Text>
              <Text className="text-sm font-bold text-gray-800">
                {new Date(busLocation.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        )}

        {userLocation && (
          <View className="p-5 bg-blue-50 m-5 rounded-xl">
            <Text className="text-lg font-bold mb-4 text-gray-800">
              📍 Your Location
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">Latitude:</Text>
              <Text className="text-sm font-bold text-gray-800">
                {userLocation.coords.latitude.toFixed(6)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">Longitude:</Text>
              <Text className="text-sm font-bold text-gray-800">
                {userLocation.coords.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        )}

        {Object.keys(allBuses).length > 0 && (
          <View className="p-5 bg-white m-5 rounded-xl">
            <Text className="text-lg font-bold mb-4 text-gray-800">
              🚌 All Active Drivers ({Object.keys(allBuses).length})
            </Text>
            {Object.entries(allBuses).map(([id, location]) => (
              <View key={id} className="bg-gray-50 p-4 rounded-lg mb-2">
                <Text className="text-base font-bold text-gray-800 mb-1">
                  Bus {location.busId}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  Driver: {location.driverEmail || location.driverId}
                </Text>
                <Text className="text-xs text-gray-500 mb-1">
                  {location.latitude.toFixed(4)},{" "}
                  {location.longitude.toFixed(4)}
                </Text>
                <Text className="text-xs text-gray-500">
                  {new Date(location.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View className="p-5 bg-orange-50 m-5 rounded-xl mb-10">
          <Text className="text-base font-bold mb-2 text-gray-800">
            ℹ️ How it works:
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            • Enter the Bus ID you want to track
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            • Real-time location updates from Firebase
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            • See all active drivers and their locations
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            • Location updates every 5 seconds
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            • Map shows bus location in real-time
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            • Red pin = tracked bus, Blue pins = other buses
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentDashboard;
