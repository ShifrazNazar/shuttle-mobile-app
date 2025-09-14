// Location-related types
export interface LocationData {
  locationId?: string;
  name?: string;
  fullName?: string;
  type?:
    | "university"
    | "residential"
    | "transport_hub"
    | "religious"
    | "commercial";
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  // For real-time bus tracking
  busId: string;
  driverId: string;
  driverEmail?: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}
