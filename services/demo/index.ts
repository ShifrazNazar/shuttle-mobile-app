import { stopDriverLocation, updateDriverLocation } from "../firebase-realtime";
import { DemoConfig, DemoState } from "../../types";

// Demo route waypoints for LRT Bukit Jalil to APU
const DEMO_ROUTE_WAYPOINTS = [
  { lat: 3.05852, lng: 101.69151, name: "LRT Bukit Jalil Station" },
  { lat: 3.0582, lng: 101.6918, name: "Bukit Jalil Highway Junction" },
  { lat: 3.0578, lng: 101.6925, name: "Jalan 1/149" },
  { lat: 3.0572, lng: 101.6935, name: "Bukit Jalil Park Connector" },
  { lat: 3.0565, lng: 101.6942, name: "Jalan 1/149A" },
  { lat: 3.056, lng: 101.695, name: "Technology Park Malaysia Entry" },
  { lat: 3.0558, lng: 101.6965, name: "Jalan Teknologi 3" },
  { lat: 3.0556, lng: 101.698, name: "Jalan Teknologi 4" },
  { lat: 3.0555, lng: 101.6995, name: "Technology Park Center" },
  { lat: 3.05550753, lng: 101.7005763, name: "APU Campus - Jalan Teknologi 5" },
];

class DemoService {
  private demos: Map<string, DemoState> = new Map();
  private intervals: Map<string, ReturnType<typeof global.setInterval>> =
    new Map();

  startDemo(config: DemoConfig): Promise<boolean> {
    const { routeId, busId, driverId, speed, updateInterval } = config;
    const demoKey = `${driverId}-${busId}`;

    // Stop existing demo if running
    this.stopDemo(driverId, busId);

    // Calculate total route time based on speed
    const totalDistance = this.calculateTotalDistance(DEMO_ROUTE_WAYPOINTS);
    const totalTimeMs = (totalDistance / speed) * 3600000; // Convert to ms
    const waypointInterval = totalTimeMs / (DEMO_ROUTE_WAYPOINTS.length - 1);

    const demoState: DemoState = {
      isRunning: true,
      currentWaypointIndex: 0,
      progress: 0,
      startTime: Date.now(),
    };

    this.demos.set(demoKey, demoState);

    // Start the demo loop
    const interval = global.setInterval(() => {
      this.updateDemoLocation(demoKey, config, waypointInterval);
    }, updateInterval);

    this.intervals.set(demoKey, interval);

    console.log(`🚌 Demo started: ${routeId} - Bus ${busId}`);
    return Promise.resolve(true);
  }

  stopDemo(driverId: string, busId: string): Promise<boolean> {
    const demoKey = `${driverId}-${busId}`;

    // Clear interval
    const interval = this.intervals.get(demoKey);
    if (interval) {
      global.clearInterval(interval);
      this.intervals.delete(demoKey);
    }

    // Update demo state
    const demoState = this.demos.get(demoKey);
    if (demoState) {
      demoState.isRunning = false;
    }

    // Stop location tracking in Firebase
    stopDriverLocation(driverId);

    console.log(`🛑 Demo stopped: Bus ${busId}`);
    return Promise.resolve(true);
  }

  private updateDemoLocation(
    demoKey: string,
    config: DemoConfig,
    waypointInterval: number
  ) {
    const demoState = this.demos.get(demoKey);
    if (!demoState || !demoState.isRunning) return;

    const { routeId, busId, driverId, driverEmail } = config;
    const elapsed = Date.now() - demoState.startTime;
    const progress = Math.min(elapsed / waypointInterval, 1);

    // Calculate current position
    const currentIndex = Math.floor(
      progress * (DEMO_ROUTE_WAYPOINTS.length - 1)
    );
    const nextIndex = Math.min(
      currentIndex + 1,
      DEMO_ROUTE_WAYPOINTS.length - 1
    );

    const currentWaypoint = DEMO_ROUTE_WAYPOINTS[currentIndex];
    const nextWaypoint = DEMO_ROUTE_WAYPOINTS[nextIndex];

    // Interpolate between waypoints
    const segmentProgress =
      progress * (DEMO_ROUTE_WAYPOINTS.length - 1) - currentIndex;
    const lat =
      currentWaypoint.lat +
      (nextWaypoint.lat - currentWaypoint.lat) * segmentProgress;
    const lng =
      currentWaypoint.lng +
      (nextWaypoint.lng - currentWaypoint.lng) * segmentProgress;

    // Update Firebase with current location
    updateDriverLocation(driverId, busId, lat, lng, driverEmail);

    // Update demo state
    demoState.currentWaypointIndex = currentIndex;
    demoState.progress = progress;

    // Check if demo is complete
    if (progress >= 1) {
      console.log(`✅ Demo completed: ${routeId} - Bus ${busId}`);
      this.stopDemo(driverId, busId);
    }
  }

  private calculateTotalDistance(
    waypoints: typeof DEMO_ROUTE_WAYPOINTS
  ): number {
    let totalDistance = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const distance = this.haversineDistance(
        waypoints[i].lat,
        waypoints[i].lng,
        waypoints[i + 1].lat,
        waypoints[i + 1].lng
      );
      totalDistance += distance;
    }
    return totalDistance;
  }

  private haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  getDemoState(driverId: string, busId: string): DemoState | null {
    const demoKey = `${driverId}-${busId}`;
    return this.demos.get(demoKey) || null;
  }

  isDemoRunning(driverId: string, busId: string): boolean {
    const demoState = this.getDemoState(driverId, busId);
    return demoState?.isRunning || false;
  }

  getAllActiveDemos(): Array<{
    driverId: string;
    busId: string;
    state: DemoState;
  }> {
    const activeDemos: Array<{
      driverId: string;
      busId: string;
      state: DemoState;
    }> = [];

    for (const [demoKey, state] of this.demos.entries()) {
      if (state.isRunning) {
        const [driverId, busId] = demoKey.split("-");
        activeDemos.push({ driverId, busId, state });
      }
    }

    return activeDemos;
  }
}

export const demoService = new DemoService();

// Demo configurations for different routes
export const DEMO_CONFIGS = {
  R001: {
    // LRT Bukit Jalil to APU
    routeId: "R001",
    speed: 25, // km/h
    updateInterval: 2000, // 2 seconds
    waypoints: DEMO_ROUTE_WAYPOINTS,
  },
  R002: {
    // APU to LRT Bukit Jalil (reverse)
    routeId: "R002",
    speed: 25,
    updateInterval: 2000,
    waypoints: [...DEMO_ROUTE_WAYPOINTS].reverse(),
  },
};

export default demoService;
