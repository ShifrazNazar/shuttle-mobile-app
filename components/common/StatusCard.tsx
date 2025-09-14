import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StatusCardProps } from "../../types";

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  icon,
  items,
  quickActions,
}) => {
  const getStatusColor = (color?: string) => {
    switch (color) {
      case "green":
        return "bg-[#22c55e]";
      case "red":
        return "bg-[#ef4444]";
      case "yellow":
        return "bg-[#f59e0b]";
      case "blue":
        return "bg-[#2563eb]";
      default:
        return "bg-[#6b7280]";
    }
  };

  const getActionColor = (color?: string) => {
    switch (color) {
      case "green":
        return "bg-[#22c55e]";
      case "red":
        return "bg-[#ef4444]";
      case "blue":
      default:
        return "bg-[#2563eb]";
    }
  };

  return (
    <View className="bg-white p-4 rounded-[12px] border border-[#e5e7eb] shadow-sm mb-4">
      <Text className="text-base font-semibold text-gray-800 mb-3">
        {icon} {title}
      </Text>

      <View className="flex-col gap-3 mb-4">
        {items.map((item, index) => (
          <View key={index} className="flex-row justify-between items-center">
            <Text className="text-base text-gray-600">{item.label}:</Text>
            {item.type === "status" ? (
              <View
                className={`px-3 py-1 rounded-full ${getStatusColor(item.statusColor)}`}
              >
                <Text className="text-white text-sm font-medium">
                  {item.value}
                </Text>
              </View>
            ) : (
              <Text className="text-base font-bold text-gray-800">
                {item.value}
              </Text>
            )}
          </View>
        ))}
      </View>

      {quickActions && quickActions.length > 0 && (
        <View className="pt-3 border-t border-gray-200">
          <Text className="text-sm font-medium text-gray-700 mb-3">
            ⚡ Quick Actions
          </Text>
          <View className="flex-row gap-3">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-1 py-3 rounded-[8px] ${getActionColor(action.color)}`}
                onPress={action.onPress}
              >
                <Text className="text-white text-center font-medium">
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default StatusCard;
