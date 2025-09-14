import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import {
  getBoardingStats,
  validateAndProcessBoarding,
} from "../../services/digital-travel-card";
import { useAuth } from "../../contexts/AuthContext";

const { width: _width, height: _height } = Dimensions.get("window");

interface QRCodeScannerProps {
  visible: boolean;
  onClose: () => void;
  shuttleId: string;
  routeId: string;
  onBoardingSuccess?: (record: any) => void;
}

const QRCodeScannerComponent: React.FC<QRCodeScannerProps> = ({
  visible,
  onClose,
  shuttleId,
  routeId,
  onBoardingSuccess,
}) => {
  const { user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({
    totalBoardings: 0,
    successfulBoardings: 0,
    failedBoardings: 0,
    students: [] as string[],
  });

  useEffect(() => {
    if (visible && user) {
      loadBoardingStats();
      // Reset scanner state when modal opens
      resetScanner();
    }
  }, [visible, user]);

  const loadBoardingStats = async () => {
    if (!user) return;

    try {
      const todayStats = await getBoardingStats(user.uid, new Date());
      setStats(todayStats);
    } catch (error) {
      console.error("Error loading boarding stats:", error);
    }
  };

  const handleBarCodeScanned = async (event: any) => {
    const { data } = event;
    const now = Date.now();

    // Prevent multiple scans within 2 seconds
    if (scanned || scanning || isProcessing || now - lastScanTime < 2000) {
      return;
    }

    setLastScanTime(now);
    setScanning(true);
    setIsProcessing(true);

    try {
      // Get current location (you might want to get actual GPS location)
      const location = {
        latitude: 3.055465, // Default APU location
        longitude: 101.700363,
      };

      const result = await validateAndProcessBoarding(
        data,
        user?.uid || "",
        shuttleId,
        routeId,
        location
      );

      if (result.success) {
        setScanned(true);
        onBoardingSuccess?.(result.record);
        loadBoardingStats(); // Refresh stats

        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);

        Alert.alert(
          "Boarding Successful",
          `Student ${result.record?.studentId} has been checked in successfully.`,
          [
            {
              text: "OK",
              onPress: () => {
                // Already closed by timeout, but this handles manual close
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert("Boarding Failed", result.message, [
          {
            text: "OK",
            onPress: () => {
              setScanned(false);
              setIsProcessing(false);
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      Alert.alert("Error", "Failed to process QR code. Please try again.", [
        {
          text: "OK",
          onPress: () => {
            setScanned(false);
            setIsProcessing(false);
          },
        },
      ]);
    } finally {
      setScanning(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setScanning(false);
    setIsProcessing(false);
    setLastScanTime(0);
  };

  const closeScanner = () => {
    setScanned(false);
    setScanning(false);
    setIsProcessing(false);
    setLastScanTime(0);
    onClose();
  };

  if (!permission) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.permissionContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.permissionText}>
            Requesting camera permission...
          </Text>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.permissionContainer}>
          <Ionicons name="camera" size={64} color="#EF4444" />
          <Text style={styles.permissionText}>
            Camera permission is required to scan QR codes
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={closeScanner}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="qr-code" size={24} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Scan Student QR Code</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closeScanner}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />

          {scanned && (
            <View style={styles.scannedOverlay}>
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              <Text style={styles.scannedText}>QR Code Scanned</Text>
              <TouchableOpacity
                style={styles.scanAgainButton}
                onPress={resetScanner}
              >
                <Text style={styles.scanAgainButtonText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {scanning && (
            <View style={styles.scanningOverlay}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.scanningText}>Processing...</Text>
            </View>
          )}

          {isProcessing && !scanned && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.processingText}>Validating QR Code...</Text>
            </View>
          )}

          <View style={styles.scanArea}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanInstructions}>
              Position the QR code within the frame
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Today's Boardings</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalBoardings}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#10B981" }]}>
                {stats.successfulBoardings}
              </Text>
              <Text style={styles.statLabel}>Successful</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#EF4444" }]}>
                {stats.failedBoardings}
              </Text>
              <Text style={styles.statLabel}>Failed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.students.length}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    padding: 32,
  },
  permissionText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 16,
  },
  permissionButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  scannedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  scannedText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  scanAgainButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  scanAgainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scanningOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanningText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 16,
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 16,
    fontWeight: "600",
  },
  scanArea: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -100 }],
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  scanInstructions: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statsTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
});

export default QRCodeScannerComponent;
