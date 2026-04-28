import express, { Application, Request, Response, NextFunction, type Router } from 'express';
import { HealthService } from '../resources/health.service.js'
import { SomeServiceCheck } from '../resources/some-service.check.js'
import { ResourceHealth } from '../resources/health-indicator.js'

const healthRoutes: Router = express.Router()

// https://www.elliotdenolf.com/blog/standardized-health-checks-in-typescript

healthRoutes.get('/health2', async (req, res) => {
  const healthService = new HealthService(
    [
      new SomeServiceCheck(),
      // Add more checks here...
    ]
  );

  const healthResults = await healthService.getHealth();

  res.status(healthResults.status === ResourceHealth.Healthy ? 200 : 503)
    .send({
      status: healthResults.status, 
      dependencies: healthResults.results
    });
});

export { healthRoutes };
