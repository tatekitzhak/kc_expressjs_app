

// import express, { Application, Request, Response, NextFunction, type Router } from 'express';

// import { SignJWT, jwtVerify, JWTPayload, generateSecret, createRemoteJWKSet }from "jose";
// import { jwtSecret } from "./secrets";

// interface TokenPayload extends JWTPayload {
//     userId: string;
//     email: string;
//     role: "user" | "admin";
// }

// export async function generateToken(payload: Omit<TokenPayload, "iat" | "exp">): Promise<string> {
//     // Encode the secret as bytes for the signing algorithm 
//     const secret = new TextEncoder().encode(jwtSecret());

//     return new SignJWT(payload)
//         .setProtectedHeader({ alg: "HS256" })
//         .setIssuedAt()
//         .setExpirationTime("7d") // Token expires in 7 days 
//         .sign(secret);
// }
// export async function verifyToken(token: string): Promise<TokenPayload> {
//     const secret = new TextEncoder().encode(jwtSecret());

//     // This throws if the token is invalid or expired 
//     const { payload } = await jwtVerify(token, secret);
//     return payload as TokenPayload;
// }


// let SECRET_KEY; // This would be loaded from env in real app 

// // Middleware to verify JWTs
// async function authMiddleware(req: Request, res: Response, next: NextFunction) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).send('Authorization token required');
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const { payload } = await jwtVerify(token, SECRET_KEY, {
//       issuer: 'https://my-auth-service',
//       audience: 'https://my-protected-api',
//       clockTolerance: '5s',
//       algorithms: ['HS256'],
//     });
//     req.user = payload; // Attach decoded payload to request object
//     next();
//   } catch (error) {
//     console.error('JWT Verification Error:', error.message);
//     if (error.name === 'JWTExpired') {
//       return res.status(401).send('Token expired');
//     }
//     return res.status(401).send('Invalid or unauthorized token');
//   }
// }

// async function startServer() {
//   SECRET_KEY = await generateSecret('HS256'); // Generate a secret for this example

//   // Simulate login to get a token
//   app.get('/login', async (req: Request, res: Response, next: NextFunction) => {
//     const userId = 'testuser123';
//     const jwt = await new SignJWT({ userId: userId, roles: ['user'] })
//       .setProtectedHeader({ alg: 'HS256' })
//       .setIssuer('https://my-auth-service')
//       .setAudience('https://my-protected-api')
//       .setIssuedAt()
//       .setExpirationTime('15m')
//       .sign(SECRET_KEY);
//     res.json({ token: jwt });
//   });

//   // Protected route using the middleware
//   app.get('/protected', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
//     res.json({
//       message: 'Welcome to the protected route!',
//       user: req.user,
//     });
//   });

//   // Unprotected route
//   app.get('/public', (req: Request, res: Response, next: NextFunction) => {
//     res.send('This is a public route.');
//   });

//   app.listen(port, () => {
//     console.log(Express app listening at http://localhost:${port});
//     console.log(Try:);
//     console.log(  GET http://localhost:${port}/public);
//     console.log(  GET http://localhost:${port}/login (to get a token));
//     console.log(  GET http://localhost:${port}/protected (with Bearer token));
//   });
// }

// startServer();