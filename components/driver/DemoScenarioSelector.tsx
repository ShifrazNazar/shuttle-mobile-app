import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DemoScenario {
  key: string;
  name: string;
  description: string;
  busCount: number;
}

interface DemoScenarioSelectorProps {
  scenarios: DemoScenario[];
  activeScenario: string | null;
  onScenarioSelect: (scenarioKey: string) => void;
}

const DemoScenarioSelector: React.FC<DemoScenarioSelectorProps> = ({
  scenarios,
  activeScenario,
  onScenarioSelect,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-lg font-bold mb-3 text-gray-800">
        🚌 APU Shuttle Services
      </Text>
      <Text className="text-sm text-gray-600 mb-4">
        Choose a scenario to demonstrate the APU shuttle tracking system
      </Text>

      {/* APU Shuttle Service Scenarios */}
      {scenarios.slice(0, 6).map((scenario) => (
        <TouchableOpacity
          key={scenario.key}
          className={`mb-2 p-4 rounded-[12px] border-2 ${
            activeScenario === scenario.key
              ? "bg-[#8b5cf6] border-[#8b5cf6]"
              : "bg-white border-[#e5e7eb]"
          }`}
          onPress={() => onScenarioSelect(scenario.key)}
        >
          <Text
            className={`text-center font-semibold ${
              activeScenario === scenario.key ? "text-white" : "text-gray-700"
            }`}
          >
            {activeScenario === scenario.key ? "🛑 Stop" : "▶️ Start"}{" "}
            {scenario.name}
          </Text>
          <Text
            className={`text-center text-sm mt-1 ${
              activeScenario === scenario.key
                ? "text-purple-100"
                : "text-gray-500"
            }`}
          >
            {scenario.description} ({scenario.busCount} buses)
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default DemoScenarioSelector;
