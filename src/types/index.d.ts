import { Request } from 'express';
declare module 'name-of-the-module';
declare global {
  namespace Express {
    interface Request {
      user: any;
      id: number;
    }
  }
}
