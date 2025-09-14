import React from "react";
import { Text, View } from "react-native";
import { BusAssignmentCardProps } from "../../types";



const BusAssignmentCard: React.FC<BusAssignmentCardProps> = ({ busId }) => {
  return (
    <View className="bg-white p-4 rounded-[12px] border border-[#e5e7eb] shadow-sm mb-6">
      <Text className="text-lg font-bold mb-4 text-gray-800">
        🚌 Bus Assignment
      </Text>
      {busId ? (
        <View className="bg-[#22c55e] p-3 rounded-[8px]">
          <Text className="text-white text-center font-bold text-lg">
            Assigned to Bus: {busId}
          </Text>
          <Text className="text-white text-center text-sm opacity-90 mt-1">
            You can now start sharing your location
          </Text>
        </View>
      ) : (
        <View className="bg-[#f59e0b] p-3 rounded-[8px]">
          <Text className="text-white text-center font-bold text-lg">
            No Bus Assigned
          </Text>
          <Text className="text-white text-center text-sm opacity-90 mt-1">
            Contact administrator to get assigned to a bus
          </Text>
        </View>
      )}
    </View>
  );
};

export default BusAssignmentCard;
