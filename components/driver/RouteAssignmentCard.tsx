import React from "react";
import { Text, View } from "react-native";
import { RouteAssignmentCardProps } from "../../types";

interface RouteAssignment {
  id: string;
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  status: "active" | "inactive" | "temporary";
  assignedAt: any;
}



const RouteAssignmentCard: React.FC<RouteAssignmentCardProps> = ({
  assignedRoutes,
  routesLoading,
}) => {
  return (
    <View className="bg-white p-4 rounded-[12px] border border-[#e5e7eb] shadow-sm mb-6">
      <Text className="text-lg font-bold mb-3 text-gray-800">
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
  );
};

export default RouteAssignmentCard;
