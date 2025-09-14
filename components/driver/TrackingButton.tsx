import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { TrackingButtonProps } from "../../types";



const TrackingButton: React.FC<TrackingButtonProps> = ({
  isTracking,
  busId,
  onStartTracking,
  onStopTracking,
  isDemoMode = false,
  onStartDemo: _onStartDemo,
  onStopDemo,
}) => {
  if (!isTracking) {
    return (
      <TouchableOpacity
        className={`p-8 rounded-[16px] items-center shadow-lg ${
          busId
            ? "bg-[#2563eb] shadow-blue-200"
            : "bg-[#94a3b8] shadow-gray-200"
        }`}
        onPress={onStartTracking}
        disabled={!busId}
      >
        <Text className="text-white text-3xl font-bold mb-3">
          ▶️ Start Sharing
        </Text>
        <Text className="text-white text-lg opacity-90 text-center">
          {busId
            ? "Students can now track your bus in real-time"
            : "You need to be assigned to a bus first"}
        </Text>
      </TouchableOpacity>
    );
  }

  if (isDemoMode) {
    return (
      <TouchableOpacity
        className="bg-[#8b5cf6] p-8 rounded-[16px] items-center shadow-lg shadow-purple-200"
        onPress={onStopDemo}
      >
        <Text className="text-white text-3xl font-bold mb-3">🎭 Stop Demo</Text>
        <Text className="text-white text-lg opacity-90 text-center">
          Demo simulation is running - Bus {busId}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className="bg-[#ef4444] p-8 rounded-[16px] items-center shadow-lg shadow-red-200"
      onPress={onStopTracking}
    >
      <Text className="text-white text-3xl font-bold mb-3">
        ⏹️ Stop Sharing
      </Text>
      <Text className="text-white text-lg opacity-90 text-center">
        Location sharing is currently active
      </Text>
    </TouchableOpacity>
  );
};

export default TrackingButton;
