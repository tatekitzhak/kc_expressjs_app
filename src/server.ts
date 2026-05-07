import express, { type Express, Request, Response, NextFunction } from "express";
import cors from "cors";

import { blogsRouter } from "./routes/blog.routes.js";
import { corsOptions } from "./middleware/corsGateway.js";
import { keycloakRouter } from "./routes/keycloakProtec.js";
import healthCheckRouter from './routes/healthCheck.js';
import { healthRoutes } from './routes/health.routes.js'

const app: Express = express();

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", blogsRouter);
app.use("/", healthCheckRouter, healthRoutes);
app.use("/keycloak", keycloakRouter);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        status: 'success',
        message: 'Welcome to the Blog API.',
    });
});

// Error handlers
app.get('*', (req: Request, res: Response, next: NextFunction) => {
    console.log('404 Error:')
    res.status(404).json({
        success: false,
        status: 'fail',
        message: 'Route Not Found',
    });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('errorHandler::::::')
    res.status(500).json({
        success: false,
        status: 'error',
        message: `Something went wrong: ${err.message}`,
    });
});

(async () => {
    await console.log('dbCreateConnection:server:')
})();

export default app;