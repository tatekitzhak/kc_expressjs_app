declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PORT: number;
      DB_USER: string;
      MONGODB_URI: string;
      MONGODB_DB: string;
      NODE_ENV: 'development' | 'production' | 'test';
      HOST: string;
      REDIS_PORT: number;
      APP_PORT: number;
      uri: string;
    }
  }
}

export { };