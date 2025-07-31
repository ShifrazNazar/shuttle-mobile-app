// GPS and location services

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
}

export interface LocationService {
  getCurrentPosition: () => Promise<Location>;
  watchPosition: (callback: (location: Location) => void) => number;
  clearWatch: (watchId: number) => void;
  requestPermissions: () => Promise<boolean>;
}

export interface LocationPermissions {
  foreground: boolean;
  background: boolean;
}

export {};
