// ONLY FOR LOCAL DEVELOPMENT
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import express, { Application, Request, Response, NextFunction, type Router } from 'express';
import { SignJWT, jwtVerify, JWTPayload, generateSecret, createRemoteJWKSet } from "jose";

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import 'dotenv/config';
import { keycloakConfig } from '../config/auth.config.js'

export const keycloakRouter: Router = express.Router()


const JWKS = createRemoteJWKSet(new URL( keycloakConfig.KC_JWKS_URL as string));

async function authMiddleware(req: Request, res: Response, next: NextFunction) {

  const authHeader = req.headers.authorization;

  console.log('authMiddleware:', req.headers, authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Authorization token required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      
      issuer: keycloakConfig.KC_ISSUER as string,
      audience: 'account',
      clockTolerance: '5s',
      algorithms: ['RS256'],
    });

    console.log('payload:', payload)
    req.user = payload; // Attach decoded payload to request object

    next();

  } catch (error: any) {

    return res.status(401).json({ 
        error: 'Unauthorized', 
        details: error.message,
        message: 'Invalid or unauthorized token'
    });
    
  }
}

let user_data = {
  "sambankman@gmail.com": [
    "i am sorry",
    "not my fault",
    "binance is bad",
    "kevin is my best friend",
  ],
  "caroline@alameda.com": [
    "stop loss is bad",
    "conforable with risk",
    "never lost a trade",
    "alameda rocks!",
  ],
};

interface Name {
  username: string;
  first: string;
  last: string;
}

interface Location {
  street: string;
  city: string;
  state: string;
  postcode: number;
}

interface Login {
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}

interface Id {
  name: string;
  value: string;
}

interface Picture {
  large: string;
  medium: string;
  thumbnail: string;
}

interface Avatar {
  name: string;
  description: string;
  authors: string[];
  color: string;
}

interface ItemRequest {
  product_id: string;
  name: string;
  type: string;
  tags: string[];
  description: string;
  quantity: number;
  price: number;
}

export interface UserInfo {
  gender: 'male' | 'female' | 'other';
  name: Name;
  location: Location;
  email: string;
  login: Login;
  registered: number; // Unix timestamp
  dob: number;        // Unix timestamp
  phone: string;
  cell: string;
  id: Id;
  picture: Picture;
  avatar: Avatar;
  item_request: ItemRequest;
  nat: string;
}

// If your JSON file follows the standard format with an info wrapper:
export interface RootObject {
  user: UserInfo[];
  info: {
    seed: string;
    results: number;
    page: number;
    version: string;
  };
}

keycloakRouter.get("/protected", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const userPayload = req.user as JWTPayload;
  const email = req.user;

  try {
    // 1. Read the file (adjust path to where your es.json is located)
    const filePath = path.join(__dirname, 'data', 'users.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');

    // 2. Parse the JSON string into an object
    const parsedData = JSON.parse(rawData);
    console.log(parsedData)

    // 3. Access the specific users_info array
    const usersInfo: UserInfo[] = parsedData;

    res.json({
      message: 'Welcome to the protected route!',
      user: usersInfo,
      users_info: usersInfo, // Sending the parsed array
      secret_data: user_data[userPayload.email as keyof typeof user_data] || "No data for this user"
    });
  } catch (error) {
    console.log('error:', error)
    res.status(500).json({ message: "Error parsing user data", error });
  }
});

keycloakRouter.route("/health").
  get(async function (req: Request, res: Response) {

    const healthCheck = {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: Date.now(),
      services: {
        database: 'connected', // Replace with actual DB ping logic
      },
      message: 'keycloak',
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

  // 1. The Login Route: Redirects to Keycloak
keycloakRouter.get('/login', (req: Request, res: Response) => {
  // Replace with your actual Keycloak URL and Client ID
  const realm = 'webapp';
  const clientId = 'your-client-id'; 
  const redirectUri = encodeURIComponent('http://localhost:3000/keycloak/callback');
  
  const keycloakLoginUrl = `https://localhost:8443/realms/${realm}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`;

  res.redirect(keycloakLoginUrl);
});

// 2. The Callback Route: This is where you RECORD THE LOG
keycloakRouter.get('/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No code provided from Keycloak');
  }

  try {
    // Exchange the code for a token (Server-to-Server call)
    // Note: You might need axios or fetch here to talk to Keycloak's /token endpoint
    
    /* LOGGING LOGIC:
       Once the token is received and validated, you log it here:
    */
    console.log(`[AUTH LOG] User login attempt detected at ${new Date().toISOString()}`);
    
    // For local dev, you can return the token to the user so they can use it in Bearer headers
    res.json({ 
        message: "Login successful. Use the access_token in your Authorization header.",
        code_received: code 
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

  keycloakRouter.get('/logout', (req: Request, res: Response) => {
    // 1. Capture the user identity from the token if they are still authenticated
    // This is where you record who is leaving
    const authHeader = req.headers.authorization;
    if (authHeader) {
      // Optional: Decode without full verification just for logging purposes
      // or just log that a logout was requested.
      console.log(`[AUTH LOG] Logout initiated at ${new Date().toISOString()}`);
    }
  
    // 2. Define Keycloak parameters
    const realm = 'webapp';
    const postLogoutRedirectUri = encodeURIComponent('http://localhost:3000/keycloak/public');
    const clientId = 'your-client-id';
  
    /**
     * 3. Construct the Keycloak Logout URL
     * In modern Keycloak (v18+), the standard OIDC logout endpoint is used.
     * You can provide 'id_token_hint' if you have it, 
     * but for a simple redirect logout:
     */
    const keycloakLogoutUrl = `https://localhost:8443/realms/${realm}/protocol/openid-connect/logout?client_id=${clientId}&post_logout_redirect_uri=${postLogoutRedirectUri}`;
  
    // 4. Redirect the user to Keycloak to clear their session
    res.redirect(keycloakLogoutUrl);
  });

