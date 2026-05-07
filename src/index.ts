import app from "./server.js";
import { ConnectionConfig } from "./config/auth.config.js";


const NODE_PORT = process.env['NODE_PORT'];

const server = app.listen(NODE_PORT, () => {
  console.log(`NodeJS Server running on port http://localhost:${NODE_PORT}`);
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