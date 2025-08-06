import * as Location from "expo-location";
import { LocationObject } from "expo-location";

// Request location permissions
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission denied");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
};

// Request background location permissions (for drivers)
export const requestBackgroundLocationPermission =
  async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Background location permission denied");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error requesting background location permission:", error);
      return false;
    }
  };

// Get current location
export const getCurrentLocation = async (): Promise<LocationObject | null> => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return location;
  } catch (error) {
    console.error("Error getting current location:", error);
    return null;
  }
};

// Start location tracking with fallback options
export const startLocationTracking = async (
  callback: (location: LocationObject) => void
): Promise<() => void> => {
  try {
    // First try to get background permission
    let hasBackgroundPermission = await requestBackgroundLocationPermission();

    if (hasBackgroundPermission) {
      // Use background tracking if permission granted
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        callback
      );

      return () => {
        subscription.remove();
      };
    } else {
      // Fallback to foreground tracking with manual updates
      console.log("Using foreground location tracking fallback");

      let isActive = true;

      const updateLocation = async () => {
        if (!isActive) return;

        try {
          const location = await getCurrentLocation();
          if (location) {
            callback(location);
          }
        } catch (error) {
          console.error("Error updating location:", error);
        }

        // Schedule next update
        if (isActive) {
          setTimeout(updateLocation, 5000);
        }
      };

      // Start the update loop
      updateLocation();

      return () => {
        isActive = false;
      };
    }
  } catch (error) {
    console.error("Error starting location tracking:", error);

    // Final fallback: just get current location once
    console.log("Using single location update fallback");
    const location = await getCurrentLocation();
    if (location) {
      callback(location);
    }

    // Return a no-op cleanup function
    return () => {};
  }
};

// Check if location services are enabled
export const checkLocationServices = async (): Promise<boolean> => {
  try {
    const isEnabled = await Location.hasServicesEnabledAsync();
    return isEnabled;
  } catch (error) {
    console.error("Error checking location services:", error);
    return false;
  }
};

// Get location permission status
export const getLocationPermissionStatus = async (): Promise<{
  foreground: Location.PermissionStatus;
  background: Location.PermissionStatus;
}> => {
  try {
    const foreground = await Location.getForegroundPermissionsAsync();
    const background = await Location.getBackgroundPermissionsAsync();

    return {
      foreground: foreground.status,
      background: background.status,
    };
  } catch (error) {
    console.error("Error getting permission status:", error);
    return {
      foreground: Location.PermissionStatus.UNDETERMINED,
      background: Location.PermissionStatus.UNDETERMINED,
    };
  }
};
