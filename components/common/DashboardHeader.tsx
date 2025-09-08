import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  icon: string;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  icon,
  onSignOut,
}) => {
  return (
    <View className="bg-white border-b border-[#e5e7eb] px-6 pt-12 pb-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            {icon} {title}
          </Text>
          <Text className="text-gray-600 text-sm">{subtitle}</Text>
        </View>
        <TouchableOpacity
          className="bg-[#ef4444] px-4 py-2 rounded-[12px]"
          onPress={onSignOut}
        >
          <Text className="text-white font-semibold text-sm">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardHeader;
