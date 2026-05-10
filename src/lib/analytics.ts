/**
 * @description Performance OS Telemetry System
 * Integrated for: Data Analyst managed agent (Amplitude)
 */

type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
};

export class Analytics {
  /**
   * @description Tracks a user event. 
   * Currently logs to console, but optimized for Amplitude integration.
   */
  static async track(event: AnalyticsEvent) {
    const timestamp = new Date().toISOString();
    
    // In production, this would use the Amplitude SDK:
    // amplitude.track(event.name, event.properties);
    
    console.log(`[Analytics] ${timestamp} - ${event.name}`, event.properties);

    // OPTIONAL: Forward to internal analytics endpoint
    try {
      if (typeof window !== "undefined") {
        await fetch("/api/analytics/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...event, timestamp }),
        });
      }
    } catch (e) {
      // Silent fail to preserve UX
    }
  }

  // Common Event Helpers
  static trackSync(resource: string, macros: any) {
    return this.track({
      name: "Resource_Sync",
      properties: { resource, ...macros },
    });
  }

  static trackWorkoutStart(routineName: string) {
    return this.track({
      name: "Workout_Start",
      properties: { routine: routineName },
    });
  }

  static trackStrategicShift(tasksCompleted: number) {
    return this.track({
      name: "Strategic_Shift",
      properties: { tasks_completed: tasksCompleted },
    });
  }
}
