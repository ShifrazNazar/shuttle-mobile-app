// Component-related types
import { RouteAssignment, RouteData } from "./routes";
import { LocationData } from "./locations";

// Dashboard Props
export interface StudentDashboardProps {
  navigation?: unknown;
}

export interface DriverDashboardProps {
  navigation?: unknown;
}

// Route Card Props
export interface RouteCardProps {
  route: RouteData;
  routeStatus: {
    status: "active" | "inactive" | "completed";
    text: string;
  };
  routeDrivers: RouteAssignment[];
  activeBuses: [string, LocationData][];
  onTrackBus: (busId: string) => void;
  onViewMap: (busId: string) => void;
}

// Route Filter Props
export interface RouteFilterProps {
  routes: RouteData[];
  selectedRoute: string;
  onRouteSelect: (routeId: string) => void;
}

// Map View Props
export interface MapViewProps {
  busLocation: LocationData | null;
  allBuses: Record<string, LocationData>;
  isTracking: boolean;
  busId: string;
  onStopTracking: () => void;
  defaultRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  getMapRegion: () => {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

// Status Card Props
export interface StatusItem {
  label: string;
  value: string;
  type?: "text" | "status" | "badge";
  statusColor?: "green" | "red" | "yellow" | "blue";
}

export interface StatusCardProps {
  title: string;
  icon: string;
  items: StatusItem[];
  quickActions?: Array<{
    label: string;
    onPress: () => void;
    color: string;
  }>;
}

// Dashboard Header Props
export interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  icon: string;
  onSignOut: () => void;
}

// Tab Navigation Props
export interface TabButtonProps {
  tab: string;
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export interface TabNavigationProps {
  tabs: Array<{
    id: string;
    icon: string;
    label: string;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// Loading Screen Props
export interface LoadingScreenProps {
  message?: string;
}

// Tracking Button Props
export interface TrackingButtonProps {
  isTracking: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

// Bus Assignment Card Props
export interface BusAssignmentCardProps {
  busId: string;
  routeName: string;
  isActive: boolean;
  onPress: () => void;
}

// Route Assignment Card Props
export interface RouteAssignmentCardProps {
  assignment: RouteAssignment;
  onPress: () => void;
}

// Demo Bus Props
export interface DemoBus {
  id: string;
  routeId: string;
  location: LocationData;
}
