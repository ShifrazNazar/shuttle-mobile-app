import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>
          Loading your digital travel card...
        </Text>
      </View>
    );
  }

  if (!travelCard) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="card-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Failed to load digital travel card</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadTravelCard}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="card" size={24} color="#3B82F6" />
          <Text style={styles.headerTitle}>Digital Travel Card</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
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

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.studentId}>Student ID: {studentId}</Text>
            <Text style={styles.cardStatus}>
              {travelCard.isActive ? "Active" : "Inactive"}
            </Text>
          </View>

          <View style={styles.qrContainer}>
            <QRCode
              value={travelCard.qrCode}
              size={width * 0.6}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.usageText}>
              Used {travelCard.usageCount} times
            </Text>
            {travelCard.lastUsed && (
              <Text style={styles.lastUsedText}>
                Last used:{" "}
                {(() => {
                  try {
                    return travelCard.lastUsed instanceof Date
                      ? travelCard.lastUsed.toLocaleDateString()
                      : new Date(travelCard.lastUsed).toLocaleDateString();
                  } catch (error) {
                    console.error("Error formatting lastUsed date:", error);
                    return "Unknown";
                  }
                })()}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How to use:</Text>
        <Text style={styles.instructionText}>
          1. Show this QR code to the driver when boarding
        </Text>
        <Text style={styles.instructionText}>
          2. The driver will scan it to verify your identity
        </Text>
        <Text style={styles.instructionText}>
          3. QR code refreshes automatically every 5 minutes
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  cardContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: "100%",
    maxWidth: 400,
  },
  cardHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  studentId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  cardStatus: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "500",
  },
  qrContainer: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 20,
  },
  cardFooter: {
    width: "100%",
    alignItems: "center",
  },
  usageText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  lastUsedText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  instructions: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default DigitalTravelCardComponent;
