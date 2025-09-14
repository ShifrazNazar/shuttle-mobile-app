import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RouteAssignmentCardProps } from "../../types";

const RouteAssignmentCard: React.FC<RouteAssignmentCardProps> = ({
  assignment,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-[12px] border border-[#e5e7eb] shadow-sm mb-4"
      onPress={onPress}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-[#1e40af] font-semibold text-base mb-1">
            {assignment.routeName}
          </Text>
          <Text className="text-[#3b82f6] text-sm">
            Route ID: {assignment.routeId}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            Status: {assignment.status}
          </Text>
        </View>
        <View className="ml-3">
          <Text className="text-2xl">🚌</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RouteAssignmentCard;
