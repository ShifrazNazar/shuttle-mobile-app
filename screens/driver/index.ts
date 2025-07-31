// Driver app screens

export interface DriverScreenProps {
  navigation: any;
  route: any;
}

export interface Route {
  id: string;
  name: string;
  stops: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    order: number;
  }>;
  estimatedDuration: number;
}

export interface VehicleStatus {
  vehicleId: string;
  status: "active" | "inactive" | "maintenance";
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  lastUpdated: Date;
}

export {};
