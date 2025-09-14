import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { demoService } from "../../services/demo";
import { DemoBus, LocationData } from "../../types";

const DemoMonitor: React.FC = () => {
  const [demoBuses, setDemoBuses] = useState<DemoBus[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const interval = global.setInterval(() => {
      const activeDemos = demoService.getAllActiveDemos();
      const transformedDemos: DemoBus[] = activeDemos.map((demo) => ({
        id: demo.busId,
        routeId: demo.driverId, // Using driverId as routeId for demo purposes
        location: {
          busId: demo.busId,
          driverId: demo.driverId,
          latitude: 0, // Demo location not needed for monitor
          longitude: 0,
          timestamp: Date.now(),
        },
        driverId: demo.driverId,
        busId: demo.busId,
        state: demo.state,
      }));
      setDemoBuses(transformedDemos);
    }, 1000); // Update every second

    return () => global.clearInterval(interval);
  }, [refreshKey]);

  const formatProgress = (progress: number) => {
    return `${Math.round(progress * 100)}%`;
  };

  const formatDuration = (startTime: number) => {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View className="bg-white p-4 rounded-[12px] border border-[#e5e7eb] shadow-sm">
      <Text className="text-lg font-bold mb-4 text-gray-800">
        🎭 Demo Monitor
      </Text>

      {demoBuses.length === 0 ? (
        <View className="bg-gray-50 p-4 rounded-[8px]">
          <Text className="text-center text-gray-500">
            No active demo buses
          </Text>
        </View>
      ) : (
        <ScrollView className="max-h-64">
          {demoBuses.map((demo, _index) => (
            <View
              key={`${demo.driverId}-${demo.busId}`}
              className="bg-purple-50 p-3 rounded-[8px] mb-2 border border-purple-200"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-semibold text-purple-800">
                  Bus {demo.busId}
                </Text>
                <Text className="text-xs text-purple-600">
                  {formatDuration(demo.state.startTime)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-purple-700">
                  Progress: {formatProgress(demo.state.progress)}
                </Text>
                <Text className="text-xs text-purple-600">
                  Waypoint {demo.state.currentWaypointIndex + 1}/6
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="mt-2 bg-purple-200 rounded-full h-2">
                <View
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${demo.state.progress * 100}%` }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        className="mt-3 bg-purple-100 p-2 rounded-[8px]"
        onPress={() => setRefreshKey((prev) => prev + 1)}
      >
        <Text className="text-center text-purple-700 font-medium">
          🔄 Refresh
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DemoMonitor;
