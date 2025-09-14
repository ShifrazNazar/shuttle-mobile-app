import { stopDriverLocation, updateDriverLocation } from "../firebase-realtime";
import { DemoConfig, DemoState } from "../../types";

// APU Shuttle Services Routes (Effective 2 May 2025)
const ROUTE_WAYPOINTS = {
  // Based on official APU Campus Connect shuttle services (March 2025)
  // Route 1: LRT Bukit Jalil to APU (Main Route - Peak Hours)
  LRT_BUKIT_JALIL: [
    { lat: 3.0582, lng: 101.69212, name: "LRT Bukit Jalil Station" },
    { lat: 3.058, lng: 101.6925, name: "Bukit Jalil Highway Junction" },
    { lat: 3.0575, lng: 101.693, name: "Jalan 1/149" },
    { lat: 3.057, lng: 101.6935, name: "Bukit Jalil Park Connector" },
    { lat: 3.0565, lng: 101.694, name: "Jalan 1/149A" },
    { lat: 3.056, lng: 101.695, name: "Technology Park Malaysia Entry" },
    { lat: 3.0558, lng: 101.697, name: "Jalan Teknologi 3" },
    { lat: 3.0556, lng: 101.6985, name: "Jalan Teknologi 4" },
    { lat: 3.0555, lng: 101.6995, name: "Technology Park Center" },
    {
      lat: 3.056069,
      lng: 101.700466,
      name: "APU Campus - Main Entrance (Jalan Teknologi 5)",
    },
  ],

  // Route 2: Fortune Park to APU (Paid Service - RM75/month)
  FORTUNE_PARK: [
    { lat: 3.036267, lng: 101.7073743, name: "Fortune Park Residence" },
    { lat: 3.0365, lng: 101.707, name: "Fortune Park Main Gate" },
    { lat: 3.037, lng: 101.7065, name: "Sungai Besi Road Junction" },
    { lat: 3.038, lng: 101.7055, name: "Taman Serdang Perdana" },
    { lat: 3.04, lng: 101.704, name: "Serdang Perdana Junction" },
    { lat: 3.043, lng: 101.702, name: "Jalan Teknologi Connector" },
    { lat: 3.048, lng: 101.701, name: "Technology Park Approach" },
    { lat: 3.052, lng: 101.7008, name: "Technology Park Malaysia" },
    { lat: 3.055, lng: 101.7006, name: "Jalan Teknologi 5 Approach" },
    {
      lat: 3.056069,
      lng: 101.700466,
      name: "APU Campus - Main Entrance (Jalan Teknologi 5)",
    },
  ],

  // Route 3: M Vertica to APU (University Managed Accommodation - Complimentary)
  M_VERTICA: [
    { lat: 3.1185411, lng: 101.7272555, name: "M Vertica KL City Residences" },
    { lat: 3.118, lng: 101.727, name: "M Vertica Main Gate" },
    { lat: 3.115, lng: 101.725, name: "KL City Connector" },
    { lat: 3.11, lng: 101.722, name: "Jalan Ampang Junction" },
    { lat: 3.1, lng: 101.715, name: "Highway Connector" },
    { lat: 3.08, lng: 101.71, name: "Technology Park Approach" },
    { lat: 3.07, lng: 101.708, name: "Bukit Jalil Connector" },
    { lat: 3.065, lng: 101.706, name: "Jalan Teknologi Approach" },
    { lat: 3.06, lng: 101.702, name: "Technology Park Malaysia" },
    {
      lat: 3.056069,
      lng: 101.700466,
      name: "APU Campus - Main Entrance (Jalan Teknologi 5)",
    },
  ],

  // Route 4: City of Green to APU (University Managed Accommodation - Complimentary)
  CITY_OF_GREEN: [
    { lat: 3.0438964, lng: 101.6929362, name: "City of Green Condominium" },
    { lat: 3.044, lng: 101.6925, name: "City of Green Main Gate" },
    { lat: 3.0445, lng: 101.692, name: "Bukit Jalil Residential Area" },
    { lat: 3.045, lng: 101.6915, name: "Jalan 1/149 Connector" },
    { lat: 3.048, lng: 101.695, name: "Technology Park Approach" },
    { lat: 3.052, lng: 101.697, name: "Jalan Teknologi 2" },
    { lat: 3.054, lng: 101.698, name: "Jalan Teknologi 3" },
    { lat: 3.055, lng: 101.699, name: "Jalan Teknologi 4" },
    { lat: 3.0555, lng: 101.6995, name: "Technology Park Center" },
    {
      lat: 3.056069,
      lng: 101.700466,
      name: "APU Campus - Main Entrance (Jalan Teknologi 5)",
    },
  ],

  // Route 5: Bloomsvale to APU (University Managed Accommodation - Van Service)
  BLOOMSVALE: [
    { lat: 3.0757673, lng: 101.6609445, name: "Bloomsvale Residence" },
    { lat: 3.0755, lng: 101.6615, name: "Bloomsvale Main Gate" },
    { lat: 3.075, lng: 101.6625, name: "Residential Area Connector" },
    { lat: 3.072, lng: 101.665, name: "Sungai Besi Highway" },
    { lat: 3.068, lng: 101.67, name: "Highway Junction" },
    { lat: 3.064, lng: 101.675, name: "Bukit Jalil Approach" },
    { lat: 3.06, lng: 101.685, name: "Technology Park Connector" },
    { lat: 3.058, lng: 101.69, name: "Jalan Teknologi Approach" },
    { lat: 3.0565, lng: 101.695, name: "Technology Park Malaysia" },
    {
      lat: 3.056069,
      lng: 101.700466,
      name: "APU Campus - Main Entrance (Jalan Teknologi 5)",
    },
  ],

  // Route 6: APU to LRT Bukit Jalil (Return Route)
  APU_TO_LRT: [
    {
      lat: 3.056069,
      lng: 101.700466,
      name: "APU Campus - Main Entrance (Jalan Teknologi 5)",
    },
    { lat: 3.0555, lng: 101.6995, name: "Technology Park Center" },
    { lat: 3.0556, lng: 101.6985, name: "Jalan Teknologi 4" },
    { lat: 3.0558, lng: 101.697, name: "Jalan Teknologi 3" },
    { lat: 3.056, lng: 101.695, name: "Technology Park Malaysia Entry" },
    { lat: 3.0565, lng: 101.694, name: "Jalan 1/149A" },
    { lat: 3.057, lng: 101.6935, name: "Bukit Jalil Park Connector" },
    { lat: 3.0575, lng: 101.693, name: "Jalan 1/149" },
    { lat: 3.058, lng: 101.6925, name: "Bukit Jalil Highway Junction" },
    { lat: 3.0582, lng: 101.69212, name: "LRT Bukit Jalil Station" },
  ],
};

// APU Shuttle Services Demo Scenarios (Effective 2 May 2025)
export const DEMO_SCENARIOS = {
  // Scenario 1: Full Service - All Routes Active
  FULL_SERVICE: {
    name: "Full Service - All Routes",
    description: "Complete APU Shuttle Services in operation",
    buses: [
      {
        driverId: "lrt_full_1",
        busId: "LRT001",
        driverEmail: "lrt1@apu.edu.my",
        routeId: "LRT_BUKIT_JALIL",
        speed: 25,
        updateInterval: 2000,
        delay: 0,
      },
      {
        driverId: "fortune_full_1",
        busId: "FP001",
        driverEmail: "fp1@apu.edu.my",
        routeId: "FORTUNE_PARK",
        speed: 22,
        updateInterval: 2000,
        delay: 10000,
      },
      {
        driverId: "mvertica_full_1",
        busId: "MV001",
        driverEmail: "mv1@apu.edu.my",
        routeId: "M_VERTICA",
        speed: 20,
        updateInterval: 2000,
        delay: 20000,
      },
      {
        driverId: "citygreen_full_1",
        busId: "CG001",
        driverEmail: "cg1@apu.edu.my",
        routeId: "CITY_OF_GREEN",
        speed: 20,
        updateInterval: 2000,
        delay: 30000,
      },
      {
        driverId: "bloomsvale_full_1",
        busId: "BV001",
        driverEmail: "bv1@apu.edu.my",
        routeId: "BLOOMSVALE",
        speed: 20,
        updateInterval: 2000,
        delay: 40000,
      },
    ],
  },

  BIDIRECTIONAL: {
    name: "Bidirectional Traffic",
    description: "Buses going both directions (LRT ↔ APU)",
    buses: [
      {
        driverId: "lrt_bi_1",
        busId: "LRT001",
        driverEmail: "lrt1@apu.edu.my",
        routeId: "LRT_BUKIT_JALIL", // LRT to APU
        speed: 25,
        updateInterval: 2000,
        delay: 0,
      },
      {
        driverId: "lrt_bi_2",
        busId: "LRT002",
        driverEmail: "lrt2@apu.edu.my",
        routeId: "APU_TO_LRT", // APU to LRT
        speed: 25,
        updateInterval: 2000,
        delay: 15000, // Start 15 seconds later
      },
    ],
  },
};

class DemoService {
  private demos: Map<string, DemoState> = new Map();
  private intervals: Map<string, ReturnType<typeof global.setInterval>> =
    new Map();

  startDemo(config: DemoConfig): Promise<boolean> {
    const { routeId, busId, driverId, speed, updateInterval } = config;
    const demoKey = `${driverId}-${busId}`;

    // Stop existing demo if running
    this.stopDemo(driverId, busId);

    // Get waypoints for the specific route
    const waypoints =
      ROUTE_WAYPOINTS[routeId as keyof typeof ROUTE_WAYPOINTS] ||
      ROUTE_WAYPOINTS.LRT_BUKIT_JALIL;

    // Calculate total route time based on speed
    const totalDistance = this.calculateTotalDistance(waypoints);
    const totalTimeMs = (totalDistance / speed) * 3600000; // Convert to ms
    const waypointInterval = totalTimeMs / (waypoints.length - 1);

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

    // Get waypoints for the specific route
    const waypoints =
      ROUTE_WAYPOINTS[routeId as keyof typeof ROUTE_WAYPOINTS] ||
      ROUTE_WAYPOINTS.LRT_BUKIT_JALIL;

    // Calculate current position
    const currentIndex = Math.floor(progress * (waypoints.length - 1));
    const nextIndex = Math.min(currentIndex + 1, waypoints.length - 1);

    const currentWaypoint = waypoints[currentIndex];
    const nextWaypoint = waypoints[nextIndex];

    // Interpolate between waypoints
    const segmentProgress = progress * (waypoints.length - 1) - currentIndex;
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
    waypoints: Array<{ lat: number; lng: number; name: string }>
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

    for (const [demoKey, state] of Array.from(this.demos.entries())) {
      if (state.isRunning) {
        const [driverId, busId] = demoKey.split("-");
        activeDemos.push({ driverId, busId, state });
      }
    }

    return activeDemos;
  }
}

class MultiBusDemoManager {
  private activeScenarios: Set<string> = new Set();
  private timeouts: Map<string, ReturnType<typeof global.setTimeout>> =
    new Map();

  /**
   * Start a predefined demo scenario
   */
  async startScenario(
    scenarioName: keyof typeof DEMO_SCENARIOS
  ): Promise<void> {
    const scenario = DEMO_SCENARIOS[scenarioName];

    console.log(
      `🚀 Starting ${scenario.name} scenario with ${scenario.buses.length} buses`
    );
    console.log(`📝 ${scenario.description}`);

    for (const busConfig of scenario.buses) {
      const { delay, ...config } = busConfig;

      if (delay > 0) {
        // Schedule delayed start
        const timeoutId = global.setTimeout(async () => {
          await this.startSingleBus(config);
        }, delay);
        this.timeouts.set(`${scenarioName}-${config.busId}`, timeoutId);
      } else {
        // Start immediately
        await this.startSingleBus(config);
      }
    }

    this.activeScenarios.add(scenarioName);
    console.log(`✅ ${scenario.name} scenario scheduled`);
  }

  /**
   * Start a single bus with custom configuration
   */
  async startSingleBus(config: {
    driverId: string;
    busId: string;
    driverEmail: string;
    routeId: string;
    speed: number;
    updateInterval: number;
  }): Promise<void> {
    const baseConfig =
      DEMO_CONFIGS[config.routeId as keyof typeof DEMO_CONFIGS];
    if (!baseConfig) {
      console.error(`❌ Unknown route: ${config.routeId}`);
      return;
    }

    const demoConfig: DemoConfig = {
      ...baseConfig,
      routeId: config.routeId,
      busId: config.busId,
      driverId: config.driverId,
      driverEmail: config.driverEmail,
      speed: config.speed,
      updateInterval: config.updateInterval,
      routeName:
        config.routeId === "R001"
          ? "LRT Bukit Jalil to APU"
          : "APU to LRT Bukit Jalil",
      waypoints: baseConfig.waypoints.map((wp) => ({
        latitude: wp.lat,
        longitude: wp.lng,
      })),
    };

    try {
      await demoService.startDemo(demoConfig);
      console.log(
        `🚌 Started bus ${config.busId} (${config.driverEmail}) on route ${config.routeId}`
      );
    } catch (error) {
      console.error(`❌ Failed to start bus ${config.busId}:`, error);
    }
  }

  /**
   * Stop a specific scenario
   */
  async stopScenario(scenarioName: keyof typeof DEMO_SCENARIOS): Promise<void> {
    const scenario = DEMO_SCENARIOS[scenarioName];

    console.log(`🛑 Stopping ${scenario.name} scenario`);

    // Clear any pending timeouts
    for (const busConfig of scenario.buses) {
      const timeoutId = this.timeouts.get(`${scenarioName}-${busConfig.busId}`);
      if (timeoutId) {
        global.clearTimeout(timeoutId);
        this.timeouts.delete(`${scenarioName}-${busConfig.busId}`);
      }

      // Stop the bus if it's running
      await demoService.stopDemo(busConfig.driverId, busConfig.busId);
    }

    this.activeScenarios.delete(scenarioName);
    console.log(`✅ ${scenario.name} scenario stopped`);
  }

  /**
   * Stop all active demos
   */
  async stopAllDemos(): Promise<void> {
    console.log("🛑 Stopping all demos");

    // Clear all timeouts
    for (const [, timeoutId] of this.timeouts.entries()) {
      global.clearTimeout(timeoutId);
    }
    this.timeouts.clear();

    // Stop all active demos
    const activeDemos = demoService.getAllActiveDemos();
    for (const demo of activeDemos) {
      await demoService.stopDemo(demo.driverId, demo.busId);
    }

    this.activeScenarios.clear();
    console.log("✅ All demos stopped");
  }

  /**
   * Get status of all demos
   */
  getDemoStatus() {
    const activeDemos = demoService.getAllActiveDemos();
    return {
      activeBuses: activeDemos.length,
      buses: activeDemos.map((demo) => ({
        busId: demo.busId,
        driverId: demo.driverId,
        progress: Math.round(demo.state.progress * 100),
        waypoint: demo.state.currentWaypointIndex + 1,
        totalWaypoints: 10, // Based on DEMO_ROUTE_WAYPOINTS length
        runningTime: Math.round((Date.now() - demo.state.startTime) / 1000),
      })),
      activeScenarios: Array.from(this.activeScenarios),
    };
  }

  /**
   * Get available scenarios
   */
  getAvailableScenarios() {
    return Object.entries(DEMO_SCENARIOS).map(([key, scenario]) => ({
      key,
      name: scenario.name,
      description: scenario.description,
      busCount: scenario.buses.length,
    }));
  }

  /**
   * Get scenario info
   */
  getScenarioInfo(scenarioName: keyof typeof DEMO_SCENARIOS) {
    const scenario = DEMO_SCENARIOS[scenarioName];
    return {
      name: scenario.name,
      description: scenario.description,
      busCount: scenario.buses.length,
      buses: scenario.buses.map((bus) => ({
        busId: bus.busId,
        routeId: bus.routeId,
        speed: bus.speed,
        delay: bus.delay,
      })),
    };
  }
}

export const demoService = new DemoService();
export const multiBusDemo = new MultiBusDemoManager();

// APU Shuttle Services Demo Configurations
export const DEMO_CONFIGS = {
  LRT_BUKIT_JALIL: {
    routeId: "LRT_BUKIT_JALIL",
    speed: 25, // km/h
    updateInterval: 2000, // 2 seconds
    waypoints: ROUTE_WAYPOINTS.LRT_BUKIT_JALIL,
  },
  FORTUNE_PARK: {
    routeId: "FORTUNE_PARK",
    speed: 22, // km/h
    updateInterval: 2000,
    waypoints: ROUTE_WAYPOINTS.FORTUNE_PARK,
  },
  M_VERTICA: {
    routeId: "M_VERTICA",
    speed: 20, // km/h - campus speed
    updateInterval: 2000,
    waypoints: ROUTE_WAYPOINTS.M_VERTICA,
  },
  CITY_OF_GREEN: {
    routeId: "CITY_OF_GREEN",
    speed: 20, // km/h - campus speed
    updateInterval: 2000,
    waypoints: ROUTE_WAYPOINTS.CITY_OF_GREEN,
  },
  BLOOMSVALE: {
    routeId: "BLOOMSVALE",
    speed: 20, // km/h - campus speed
    updateInterval: 2000,
    waypoints: ROUTE_WAYPOINTS.BLOOMSVALE,
  },
  APU_TO_LRT: {
    routeId: "APU_TO_LRT",
    speed: 25, // km/h
    updateInterval: 2000,
    waypoints: ROUTE_WAYPOINTS.APU_TO_LRT,
  },
};

// APU Shuttle Services Convenience Functions
export const startFullService = () =>
  multiBusDemo.startScenario("FULL_SERVICE");
export const startBidirectionalDemo = () =>
  multiBusDemo.startScenario("BIDIRECTIONAL");
export const stopAllDemos = () => multiBusDemo.stopAllDemos();
export const getDemoStatus = () => multiBusDemo.getDemoStatus();
export const getAvailableScenarios = () => multiBusDemo.getAvailableScenarios();
export const getScenarioInfo = (scenario: keyof typeof DEMO_SCENARIOS) =>
  multiBusDemo.getScenarioInfo(scenario);

export default demoService;
