import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { RouteFilterProps } from "../../types";

const RouteFilter: React.FC<RouteFilterProps> = ({
  routes,
  selectedRoute,
  onRouteSelect,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2 text-gray-700">
        Filter by Route:
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3"
      >
        <View className="flex-row gap-2">
          <TouchableOpacity
            className={`px-3 py-2 rounded-[8px] border ${
              selectedRoute === ""
                ? "bg-[#2563eb] border-[#2563eb]"
                : "bg-white border-[#e5e7eb]"
            }`}
            onPress={() => onRouteSelect("")}
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
              onPress={() => onRouteSelect(route.routeId)}
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
      </ScrollView>
    </View>
  );
};

export default RouteFilter;
