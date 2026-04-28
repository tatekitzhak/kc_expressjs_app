import app from "./server.js";
import { ConnectionConfig } from "./config/auth.config.js";


const appPort = ConnectionConfig.app['port'] as number;
const appHost = ConnectionConfig.app['host'] as string;

const server = app.listen(3000, () => {
  console.log(`NodeJS Server running on port http://localhost:3000`);
});

['SIGINT', 'SIGTERM', 'SIGQUIT']
  .forEach(signal => process.on(signal, () => {
    server.close(() => {
      process.exit();
    });
    setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
  }));

(async () => {
  console.log('dbCreateConnection:index:')
})();