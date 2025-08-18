import {
  getDatabase,
  ref,
  set,
  onValue,
  off,
  Database,
  remove,
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

  onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Find the specific bus and ensure it's active
      const busData = Object.values(data).find(
        (location: any) =>
          location.busId === busId && location.isActive === true
      ) as LocationData | undefined;
      callback(busData || null);
    } else {
      callback(null);
    }
  });

  // Return unsubscribe function
  return () => {
    off(locationRef);
  };
};

// Get all active buses/drivers
export const getActiveBuses = (
  callback: (buses: Record<string, LocationData>) => void
) => {
  const locationsRef = ref(database, "activeDrivers");

  onValue(locationsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Filter only active drivers and convert to busId-based structure
      const activeBuses: Record<string, LocationData> = {};
      Object.entries(data).forEach(([driverId, location]: [string, any]) => {
        if (location.isActive === true) {
          activeBuses[location.busId] = location as LocationData;
        }
      });
      callback(activeBuses);
    } else {
      callback({});
    }
  });

  return () => {
    off(locationsRef);
  };
};

// Get all active drivers (for admin purposes)
export const getAllActiveDrivers = (
  callback: (drivers: Record<string, LocationData>) => void
) => {
  const driversRef = ref(database, "activeDrivers");

  onValue(driversRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Filter only active drivers
      const activeDrivers: Record<string, LocationData> = {};
      Object.entries(data).forEach(([driverId, location]: [string, any]) => {
        if (location.isActive) {
          activeDrivers[driverId] = location as LocationData;
        }
      });
      callback(activeDrivers);
    } else {
      callback({});
    }
  });

  return () => {
    off(driversRef);
  };
};
