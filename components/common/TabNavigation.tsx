import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TabButtonProps } from "../../types";

const TabButton: React.FC<TabButtonProps> = ({
  tab: _tab,
  icon,
  label,
  isActive,
  onPress,
}) => (
  <TouchableOpacity
    className={`flex-1 py-3 px-2 items-center ${
      isActive ? "border-b-2 border-[#2563eb]" : ""
    }`}
    onPress={onPress}
  >
    <Text className={`text-lg mb-1 ${isActive ? "opacity-100" : "opacity-60"}`}>
      {icon}
    </Text>
    <Text
      className={`text-xs font-medium ${
        isActive ? "text-[#2563eb]" : "text-gray-600"
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

interface TabNavigationProps {
  tabs: Array<{
    id: string;
    icon: string;
    label: string;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <View className="bg-white border-b border-[#e5e7eb]">
      <View className="flex-row">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab.id}
            icon={tab.icon}
            label={tab.label}
            isActive={activeTab === tab.id}
            onPress={() => onTabChange(tab.id)}
          />
        ))}
      </View>
    </View>
  );
};

export default TabNavigation;
