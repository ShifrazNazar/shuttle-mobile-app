// Driver-specific components

export interface DriverComponentProps {
  driverId?: string;
  vehicleId?: string;
  onLocationUpdate?: (location: {
    latitude: number;
    longitude: number;
  }) => void;
}

export {};
