import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface LocationData {
  busId: string;
  driverId: string;
  driverEmail?: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface MapViewProps {
  busLocation: LocationData | null;
  allBuses: Record<string, LocationData>;
  isTracking: boolean;
  busId: string;
  onStopTracking: () => void;
  defaultRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  getMapRegion: () => {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const StudentMapView: React.FC<MapViewProps> = ({
  busLocation,
  allBuses,
  isTracking,
  busId,
  onStopTracking,
  defaultRegion,
  getMapRegion,
}) => {
  const mapRef = useRef<MapView | null>(null);
  const mapReadyRef = useRef(false);

  useEffect(() => {
    const target = getMapRegion();
    if (mapReadyRef.current && mapRef.current) {
      try {
        mapRef.current.animateToRegion(target, 500);
      } catch (e) {
        console.error("Error animating to region:", e);
      }
    }
  }, [busLocation?.latitude, busLocation?.longitude]);

  return (
    <View className="flex-1">
      <View className="p-4 bg-white border-b border-[#e5e7eb]">
        <Text className="text-lg font-bold text-gray-800 mb-1">
          🗺️ Live Tracking
        </Text>
        <Text className="text-sm text-gray-600">
          {busLocation && busLocation.busId
            ? `Tracking Bus ${busLocation.busId}`
            : "Select a bus from Routes tab to start tracking"}
        </Text>
        {isTracking && (
          <TouchableOpacity
            className="bg-[#ef4444] px-3 py-2 rounded-[6px] mt-2 self-start"
            onPress={onStopTracking}
          >
            <Text className="text-white text-sm font-medium">
              Stop Tracking
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-1">
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
  );
};

export default StudentMapView;
