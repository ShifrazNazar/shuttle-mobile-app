import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import {
  createDigitalTravelCard,
  DigitalTravelCard,
  getDigitalTravelCard,
} from "../../services/digital-travel-card";

const { width } = Dimensions.get("window");

interface DigitalTravelCardProps {
  onRefresh?: () => void;
}

const DigitalTravelCardComponent: React.FC<DigitalTravelCardProps> = ({
  onRefresh,
}) => {
  const { user, role } = useAuth();
  const [travelCard, setTravelCard] = useState<DigitalTravelCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get student ID from user data (assuming it's stored in user metadata)
  const studentId =
    user?.displayName || user?.email?.split("@")[0] || "Unknown";

  const loadTravelCard = async () => {
    try {
      setLoading(true);
      if (!user) return;

      // Try to get existing card first
      let card = await getDigitalTravelCard(studentId, user.uid);

      // If no card exists, create one
      if (!card) {
        card = await createDigitalTravelCard(studentId, user.uid);
      }

      setTravelCard(card);
    } catch (error) {
      console.error("Error loading travel card:", error);
      Alert.alert("Error", "Failed to load digital travel card");
    } finally {
      setLoading(false);
    }
  };

  const refreshCard = async () => {
    try {
      setRefreshing(true);
      if (!user) return;

      const card = await createDigitalTravelCard(studentId, user.uid);
      setTravelCard(card);

      Alert.alert("Success", "Digital travel card refreshed");
      onRefresh?.();
    } catch (error) {
      console.error("Error refreshing travel card:", error);
      Alert.alert("Error", "Failed to refresh digital travel card");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (role === "student") {
      loadTravelCard();
    }
  }, [user, role]);

  if (role !== "student") {
    return null;
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-base text-slate-500">
          Loading your digital travel card...
        </Text>
      </View>
    );
  }

  if (!travelCard) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-8">
        <Ionicons name="card-outline" size={48} color="#EF4444" />
        <Text className="mt-4 text-center text-base text-red-500">
          Failed to load digital travel card
        </Text>
        <TouchableOpacity
          className="mt-4 rounded-lg bg-blue-500 px-6 py-3"
          onPress={loadTravelCard}
        >
          <Text className="text-base font-semibold text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <View className="mb-5 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="card" size={24} color="#3B82F6" />
          <Text className="ml-2 text-xl font-semibold text-gray-800">
            Digital Travel Card
          </Text>
        </View>
        <TouchableOpacity
          className="rounded-lg bg-gray-100 p-2"
          onPress={refreshCard}
          disabled={refreshing}
        >
          <Ionicons
            name="refresh"
            size={20}
            color={refreshing ? "#9CA3AF" : "#3B82F6"}
          />
        </TouchableOpacity>
      </View>

      <View className="mb-6 items-center">
        <View className="w-full max-w-[400px] items-center rounded-2xl bg-white p-6 shadow-md">
          <View className="mb-5 w-full flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-800">
              Student ID: {studentId}
            </Text>
            <Text className="text-sm font-medium text-emerald-500">
              {travelCard.isActive ? "Active" : "Inactive"}
            </Text>
          </View>

          <View className="mb-5 rounded-xl bg-gray-50 p-4">
            <QRCode
              value={travelCard.qrCode}
              size={width * 0.6}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          </View>

          <View className="w-full items-center">
            <Text className="mb-1 text-sm text-slate-500">
              Used {travelCard.usageCount} times
            </Text>
          </View>
        </View>
      </View>

      <View className="rounded-xl bg-white p-4 shadow-sm">
        <Text className="mb-3 text-base font-semibold text-gray-800">
          How to use:
        </Text>
        <Text className="mb-2 text-sm leading-5 text-slate-500">
          1. Show this QR code to the driver when boarding
        </Text>
        <Text className="mb-2 text-sm leading-5 text-slate-500">
          2. The driver will scan it to verify your identity
        </Text>
        <Text className="mb-2 text-sm leading-5 text-slate-500">
          3. QR code refreshes automatically every 5 minutes
        </Text>
      </View>
    </View>
  );
};

export default DigitalTravelCardComponent;
