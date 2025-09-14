import {
  Database,
  DataSnapshot,
  getDatabase,
  off,
  onValue,
  ref,
  remove,
  set,
} from "firebase/database";
import { app } from "../firebase";

// Initialize Realtime Database
export const database: Database = getDatabase(app);

// Location data interface
export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  driverId: string;
  busId: string;
  driverEmail?: string;
  isActive: boolean;
}

// Driver location tracking
export const updateDriverLocation = async (
  driverId: string,
  busId: string,
  latitude: number,
  longitude: number,
  driverEmail?: string
) => {
  try {
    const locationData: LocationData = {
      latitude,
      longitude,
      timestamp: Date.now(),
      driverId,
      busId,
      driverEmail,
      isActive: true,
    };

    // Store under driver ID for better tracking
    await set(ref(database, `activeDrivers/${driverId}`), locationData);
    console.log("Driver location updated:", locationData);
  } catch (error) {
    console.error("Error updating driver location:", error);
  }
};

// Stop driver location tracking
export const stopDriverLocation = async (driverId: string) => {
  try {
    await remove(ref(database, `activeDrivers/${driverId}`));
    console.log("Driver location tracking stopped for:", driverId);
  } catch (error) {
    console.error("Error stopping driver location:", error);
  }
};

// Listen to bus location updates
export const subscribeToBusLocation = (
  busId: string,
  callback: (location: LocationData | null) => void
) => {
  const locationRef = ref(database, `activeDrivers`);

  // Keep a stable handler reference so we can detach only this listener
  const handleValue = (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    if (data) {
      const busData = (Object.values(data) as LocationData[]).find(
        (location: LocationData) =>
          location.busId === busId && location.isActive === true
      ) as LocationData | undefined;
      callback(busData || null);
    } else {
      callback(null);
    }
  };

  onValue(locationRef, handleValue);

  // Return unsubscribe function that detaches only this specific callback
  return () => {
    off(locationRef, "value", handleValue);
  };
};

// Get all active buses/drivers
export const getActiveBuses = (
  callback: (buses: Record<string, LocationData>) => void
) => {
  const locationsRef = ref(database, "activeDrivers");

  const handleValue = (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    if (data) {
      const activeBuses: Record<string, LocationData> = {};
      Object.entries(data).forEach(([, location]) => {
        const locationData = location as LocationData;
        if (locationData.isActive === true) {
          activeBuses[locationData.busId] = locationData;
        }
      });
      callback(activeBuses);
    } else {
      callback({});
    }
  };

  onValue(locationsRef, handleValue);

  return () => {
    off(locationsRef, "value", handleValue);
  };
};

// Get all active drivers (for admin purposes)
export const getAllActiveDrivers = (
  callback: (drivers: Record<string, LocationData>) => void
) => {
  const driversRef = ref(database, "activeDrivers");

  const handleValue = (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    if (data) {
      const activeDrivers: Record<string, LocationData> = {};
      Object.entries(data).forEach(([driverId, location]) => {
        const locationData = location as LocationData;
        if (locationData.isActive) {
          activeDrivers[driverId] = locationData;
        }
      });
      callback(activeDrivers);
    } else {
      callback({});
    }
  };

  onValue(driversRef, handleValue);

  return () => {
    off(driversRef, "value", handleValue);
  };
};
