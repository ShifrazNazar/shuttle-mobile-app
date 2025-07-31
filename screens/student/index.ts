// Student app screens

export interface StudentScreenProps {
  navigation: any;
  route: any;
}

export interface ShuttleLocation {
  id: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  lastUpdated: Date;
}

export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  estimatedArrival?: Date;
}

export {};
