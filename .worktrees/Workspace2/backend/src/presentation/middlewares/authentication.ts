import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// SECURITY: JWT Secret must be set via environment variable
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ CRITICAL: JWT_SECRET is not set or too short. Exiting.');
    process.exit(1);
  } else {
    console.warn('⚠️ WARNING: JWT_SECRET is not set. Using insecure default for development only.');
  }
}
const SECRET = JWT_SECRET || 'dev-only-insecure-key-replace-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    piUserId: string;
    username: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET) as any;
    req.user = {
      id: decoded.id,
      piUserId: decoded.piUserId,
      username: decoded.username
    };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuthenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET) as any;
    req.user = {
      id: decoded.id,
      piUserId: decoded.piUserId,
      username: decoded.username
    };
    next();
  } catch (error) {
    // If token is invalid, just proceed as guest (unauthenticated)
    next();
  }
};

export const generateTokens = (user: { id: string; piUserId: string; username: string }) => {
  const accessToken = jwt.sign(
    { id: user.id, piUserId: user.piUserId, username: user.username },
    SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
