import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import {
  startFullService,
  startBidirectionalDemo,
  stopAllDemos,
  getDemoStatus,
  getAvailableScenarios,
} from "../../services/demo";
import DashboardHeader from "../../components/common/DashboardHeader";
import StatusCard from "../../components/common/StatusCard";
import DemoScenarioSelector from "../../components/admin/DemoScenarioSelector";

const AdminDemoControl: React.FC = () => {
  const { signOut } = useAuth();
  const [activeDemoScenario, setActiveDemoScenario] = useState<string | null>(
    null
  );
  const [availableScenarios, setAvailableScenarios] = useState<any[]>([]);
  const [demoStatus, setDemoStatus] = useState<any>(null);

  useEffect(() => {
    try {
      // Load available demo scenarios
      const scenarios = getAvailableScenarios();
      setAvailableScenarios(scenarios);

      // Monitor demo status
      const interval = global.setInterval(() => {
        try {
          const status = getDemoStatus();
          setDemoStatus(status);
        } catch (error) {
          console.error("Error getting demo status:", error);
        }
      }, 1000);

      return () => global.clearInterval(interval);
    } catch (error) {
      console.error("Error initializing admin demo control:", error);
    }
  }, []);

  const handleScenarioDemo = (scenarioKey: string) => {
    // Use setTimeout to avoid blocking the UI thread
    setTimeout(async () => {
      try {
        if (activeDemoScenario === scenarioKey) {
          // Stop current demo
          await stopAllDemos();
          setActiveDemoScenario(null);
        } else {
          // Stop all current demos first
          await stopAllDemos();
          setActiveDemoScenario(null);

          // Start new scenario
          switch (scenarioKey) {
            case "FULL_SERVICE":
              await startFullService();
              setActiveDemoScenario(scenarioKey);
              break;
            case "BIDIRECTIONAL":
              await startBidirectionalDemo();
              setActiveDemoScenario(scenarioKey);
              break;
            default:
              console.error("Unknown scenario:", scenarioKey);
              return;
          }
        }
      } catch (error) {
        console.error("Failed to control demo:", error);
        setActiveDemoScenario(null);
      }
    }, 0);
  };

  const handleStopAllDemos = async () => {
    try {
      await stopAllDemos();
      setActiveDemoScenario(null);
    } catch (error) {
      console.error("Failed to stop demos:", error);
      setActiveDemoScenario(null);
    }
  };

  const handleSignOut = async () => {
    try {
      // Stop all demos before signing out
      await stopAllDemos();

      const result = await signOut();
      if (!result.success) {
        Alert.alert("Error", result.error);
      } else {
        router.replace("/");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f7f8fb]">
      {/* Header */}
      <DashboardHeader
        title="Demo Control Panel"
        subtitle="Manage system demonstrations"
        icon="🎭"
        onSignOut={handleSignOut}
      />

      <View className="flex-1 p-6">
        {/* Demo Scenarios */}
        <DemoScenarioSelector
          scenarios={availableScenarios}
          activeScenario={activeDemoScenario}
          onScenarioSelect={handleScenarioDemo}
        />

        {/* Emergency Stop */}
        <TouchableOpacity
          className="bg-red-500 p-4 rounded-[12px] mb-6"
          onPress={handleStopAllDemos}
        >
          <Text className="text-white text-center font-semibold text-lg">
            🛑 Stop All Demos
          </Text>
        </TouchableOpacity>

        {/* Demo Status */}
        {demoStatus && (
          <StatusCard
            title="Demo Status"
            icon="📊"
            items={[
              {
                label: "Active Buses",
                value: demoStatus.activeBuses.toString(),
              },
              {
                label: "Active Scenarios",
                value: demoStatus.activeScenarios.length.toString(),
              },
              {
                label: "Current Scenario",
                value: activeDemoScenario || "None",
              },
            ]}
          />
        )}

        {/* Active Buses List */}
        {demoStatus && demoStatus.buses.length > 0 && (
          <View className="bg-white p-4 rounded-[12px] border border-[#e5e7eb] shadow-sm mt-4">
            <Text className="text-lg font-bold mb-3 text-gray-800">
              🚌 Active Demo Buses
            </Text>
            {demoStatus.buses.map((bus: any, index: number) => (
              <View
                key={index}
                className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <Text className="text-sm font-medium">{bus.busId}</Text>
                <Text className="text-sm text-gray-600">
                  {bus.progress}% • {bus.runningTime}s
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdminDemoControl;
