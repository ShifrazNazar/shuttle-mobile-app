import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
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
        <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.9)] p-8">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="my-4 text-center text-base text-white">
            Requesting camera permission...
          </Text>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.9)] p-8">
          <Ionicons name="camera" size={64} color="#EF4444" />
          <Text className="my-4 text-center text-base text-white">
            Camera permission is required to scan QR codes
          </Text>
          <TouchableOpacity
            className="my-2 rounded-lg bg-blue-500 px-6 py-3"
            onPress={requestPermission}
          >
            <Text className="text-base font-semibold text-white">
              Grant Permission
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="my-2 rounded-lg bg-[rgba(255,255,255,0.2)] px-6 py-3"
            onPress={closeScanner}
          >
            <Text className="text-base text-white">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black">
        <View className="flex-row items-center justify-between bg-[rgba(0,0,0,0.8)] px-4 py-3">
          <View className="flex-row items-center">
            <Ionicons name="qr-code" size={24} color="#FFFFFF" />
            <Text className="ml-2 text-lg font-semibold text-white">
              Scan Student QR Code
            </Text>
          </View>
          <TouchableOpacity
            className="rounded-lg bg-[rgba(255,255,255,0.2)] px-6 py-3"
            onPress={closeScanner}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View className="relative flex-1">
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />

          {scanned && (
            <View className="absolute inset-0 items-center justify-center bg-[rgba(0,0,0,0.8)]">
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              <Text className="mt-4 text-lg font-semibold text-white">
                QR Code Scanned
              </Text>
              <TouchableOpacity
                className="mt-4 rounded-lg bg-blue-500 px-6 py-3"
                onPress={resetScanner}
              >
                <Text className="text-base font-semibold text-white">
                  Scan Again
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {scanning && (
            <View className="absolute inset-0 items-center justify-center bg-[rgba(0,0,0,0.8)]">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="mt-4 text-base text-white">Processing...</Text>
            </View>
          )}

          {isProcessing && !scanned && (
            <View className="absolute inset-0 items-center justify-center bg-[rgba(0,0,0,0.7)]">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="mt-4 text-base font-semibold text-white">
                Validating QR Code...
              </Text>
            </View>
          )}

          <View
            className="absolute left-1/2 top-1/2 -translate-x-[100px] -translate-y-[100px] items-center"
            style={{ width: 200, height: 200 }}
          >
            <View
              className="rounded-xl border-2 border-blue-500 bg-transparent"
              style={{ width: 200, height: 200 }}
            />
            <Text className="mt-4 rounded-lg bg-[rgba(0,0,0,0.6)] px-4 py-2 text-center text-sm text-white">
              Position the QR code within the frame
            </Text>
          </View>
        </View>

        <View className="bg-[rgba(0,0,0,0.8)] px-4 py-3">
          <Text className="mb-2 text-base font-semibold text-white">
            Today's Boardings
          </Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-xl font-extrabold text-white">
                {stats.totalBoardings}
              </Text>
              <Text className="mt-0.5 text-xs text-gray-400">Total</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-extrabold text-emerald-500">
                {stats.successfulBoardings}
              </Text>
              <Text className="mt-0.5 text-xs text-gray-400">Successful</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-extrabold text-red-500">
                {stats.failedBoardings}
              </Text>
              <Text className="mt-0.5 text-xs text-gray-400">Failed</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-extrabold text-white">
                {stats.students.length}
              </Text>
              <Text className="mt-0.5 text-xs text-gray-400">Students</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default QRCodeScannerComponent;
