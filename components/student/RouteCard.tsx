import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RouteData } from "../../utils/constants";

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

interface LocationData {
  busId: string;
  driverId: string;
  driverEmail?: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface RouteCardProps {
  route: RouteData;
  routeStatus: {
    status: "active" | "completed" | "inactive";
    text: string;
  };
  routeDrivers: RouteAssignment[];
  activeBuses: Array<[string, LocationData]>;
  onTrackBus: (busId: string) => void;
  onViewMap: (busId: string) => void;
}

const RouteCard: React.FC<RouteCardProps> = ({
  route,
  routeStatus,
  routeDrivers,
  activeBuses,
  onTrackBus,
  onViewMap,
}) => {
  return (
    <View className="bg-white p-4 rounded-[12px] border border-[#e5e7eb] shadow-sm">
      {/* Route Header */}
      <View className="flex-row justify-between items-start mb-3">
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
            🚗 Active Drivers:
          </Text>
          <View className="flex-col gap-2">
            {activeBuses.map(([id, location]) => (
              <View
                key={id}
                className="bg-[#eff6ff] p-3 rounded-[8px] border border-[#dbeafe]"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="font-medium text-[#1e40af] text-sm">
                      Bus {location.busId}
                    </Text>
                    <Text className="text-xs text-[#3b82f6]">
                      Driver: {location.driverEmail || location.driverId}
                    </Text>
                    <Text className="text-xs text-[#6b7280] mt-1">
                      Last update:{" "}
                      {location.timestamp
                        ? new Date(location.timestamp).toLocaleTimeString()
                        : "Unknown"}
                    </Text>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="bg-[#2563eb] px-3 py-2 rounded-[6px]"
                      onPress={() => onTrackBus(location.busId)}
                    >
                      <Text className="text-white text-xs font-medium">
                        Track
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-[#22c55e] px-3 py-2 rounded-[6px]"
                      onPress={() => onViewMap(location.busId)}
                    >
                      <Text className="text-white text-xs font-medium">
                        View Map
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* No Active Drivers */}
      {routeDrivers.length > 0 && activeBuses.length === 0 && (
        <View className="mt-3 pt-3 border-t border-gray-200">
          <View className="bg-[#fef3c7] p-3 rounded-[8px] border border-[#f59e0b]">
            <Text className="text-xs text-[#92400e] text-center">
              ⚠️ Drivers assigned but not currently active
            </Text>
          </View>
        </View>
      )}

      {/* No Drivers Assigned */}
      {routeDrivers.length === 0 && (
        <View className="mt-3 pt-3 border-t border-gray-200">
          <View className="bg-[#f3f4f6] p-3 rounded-[8px] border border-[#d1d5db]">
            <Text className="text-xs text-[#6b7280] text-center">
              No drivers currently assigned to this route
            </Text>
          </View>
        </View>
      )}

      {/* Special Notes */}
      {route.specialNotes && (
        <View className="mt-3 pt-3 border-t border-gray-200">
          <View className="bg-[#fef3c7] p-3 rounded-[8px] border border-[#f59e0b]">
            <Text className="text-xs text-[#92400e]">
              ℹ️ {route.specialNotes}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default RouteCard;
