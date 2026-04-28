import { Request } from 'express';
declare module 'name-of-the-module';
// declare global {
//   namespace Express {
//     interface Request {
//       user?: any; // Or use your specific User type/interface here
//     }
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}