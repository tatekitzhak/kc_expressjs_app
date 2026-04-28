// https://www.elliotdenolf.com/blog/standardized-health-checks-in-typescript

// health-indicator.ts
export abstract class HealthIndicator {
    abstract name: string;
    status: ResourceHealth = ResourceHealth.Unhealthy;
    details: string | undefined;
  
    abstract checkHealth(): Promise<void>;
  }
  
  // resource-health.enum.ts
  export enum ResourceHealth {
    Healthy = 'HEALTHY',
    Unhealthy = 'UNHEALTHY'
  }

  