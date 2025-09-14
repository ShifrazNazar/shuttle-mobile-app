import React, { useRef } from "react";
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
  const onScenarioSelectRef = useRef(onScenarioSelect);
  onScenarioSelectRef.current = onScenarioSelect;
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 12,
          color: "#1f2937",
        }}
      >
        🎭 Demo Scenarios
      </Text>
      <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
        Select a scenario to start system demonstration
      </Text>

      {/* Demo Scenarios */}
      {scenarios.map((scenario) => (
        <TouchableOpacity
          key={scenario.key}
          style={{
            marginBottom: 12,
            padding: 16,
            borderRadius: 12,
            borderWidth: 2,
            backgroundColor:
              activeScenario === scenario.key ? "#8b5cf6" : "#ffffff",
            borderColor:
              activeScenario === scenario.key ? "#8b5cf6" : "#e5e7eb",
            shadowColor: activeScenario === scenario.key ? "#8b5cf6" : "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: activeScenario === scenario.key ? 0.3 : 0.1,
            shadowRadius: 4,
            elevation: activeScenario === scenario.key ? 4 : 2,
          }}
          onPress={() => {
            // Use ref to avoid navigation context issues
            try {
              onScenarioSelectRef.current(scenario.key);
            } catch (error) {
              console.error("Error in scenario selection:", error);
            }
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "600",
              color: activeScenario === scenario.key ? "#ffffff" : "#374151",
              fontSize: 16,
            }}
          >
            {activeScenario === scenario.key ? "🛑 Stop Demo" : "▶️ Start Demo"}{" "}
            {scenario.name}
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              marginTop: 4,
              color: activeScenario === scenario.key ? "#e9d5ff" : "#6b7280",
            }}
          >
            {scenario.description} ({scenario.busCount} buses)
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default DemoScenarioSelector;
