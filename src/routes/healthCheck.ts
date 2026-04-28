import express, { Application, Request, Response, NextFunction, type Router } from 'express';

const healthCheckRouter: Router = express.Router()

healthCheckRouter.route("/health1").
  get(async function (req: Request, res: Response) {

    const healthCheck = {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: Date.now(),
      services: {
        database: 'connected', // Replace with actual DB ping logic
      },
      message: 'To validate keycloak go to: http://[address-name]:8443/keycloak/protected',
    };
  
    try {
      // Perform actual checks here (e.g., db.authenticate())
      res.status(200).json(healthCheck);
    } catch (error) {
      res.status(503).json({
        ...healthCheck,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  export default healthCheckRouter;