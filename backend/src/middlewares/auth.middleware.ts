import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import config from '../config/env';
import { IAuthRequest, IJwtPayload } from '../types';
import { AuthenticationError, AuthorizationError } from '../types';

/**
 * ============================================================================
 * JWT UTILITIES
 * ============================================================================
 */

/**
 * Generate JWT token for authenticated user
 */
export const generateToken = (payload: IJwtPayload): string => {
    return jwt.sign(payload, config.security.jwtSecret, {
        expiresIn: config.security.jwtExpiresIn,
        issuer: 'pi-academy-backend',
        audience: 'pi-academy-app',
    } as jwt.SignOptions);
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): IJwtPayload => {
    try {
        const decoded = jwt.verify(token, config.security.jwtSecret, {
            issuer: 'pi-academy-backend',
            audience: 'pi-academy-app',
        }) as IJwtPayload;
        
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AuthenticationError('Token expired', 'TOKEN_EXPIRED');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AuthenticationError('Invalid token', 'INVALID_TOKEN');
        }
        throw new AuthenticationError('Authentication failed', 'AUTH_FAILED');
    }
};

/**
 * ============================================================================
 * AUTHENTICATION MIDDLEWARE
 * ============================================================================
 */

/**
 * Require authentication
 * Validates JWT token and attaches user info to request
 */
export const requireAuth = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError(
                'No authentication token provided',
                'NO_TOKEN'
            );
        }
        
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        // Verify token
        const payload = verifyToken(token);
        
        // Attach user info to request
        req.user = payload;
        
        next();
    } catch (error) {
        if (error instanceof AuthenticationError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message,
                code: error.code,
            });
        } else {
            res.status(401).json({
                success: false,
                error: 'Authentication failed',
                code: 'AUTH_FAILED',
            });
        }
    }
};

/**
 * ============================================================================
 * AUTHORIZATION MIDDLEWARES
 * ============================================================================
 */

/**
 * Require KYC verification
 * Must be used AFTER requireAuth
 */
export const requireKyc = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            throw new AuthenticationError('User not authenticated');
        }
        
        if (req.user.kycStatus !== 'verified') {
            throw new AuthorizationError(
                '🔒 KYC verification required. Please complete KYC to access this feature.',
                'KYC_REQUIRED'
            );
        }
        
        next();
    } catch (error) {
        if (error instanceof AuthorizationError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message,
                code: error.code,
            });
        } else {
            res.status(403).json({
                success: false,
                error: 'Access denied',
                code: 'ACCESS_DENIED',
            });
        }
    }
};

/**
 * Require Pioneer status (non-guest)
 * Must be used AFTER requireAuth
 */
export const requirePioneer = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            throw new AuthenticationError('User not authenticated');
        }
        
        if (req.user.role === 'guest') {
            throw new AuthorizationError(
                '🔒 Guest Mode Active. Please sign in with a Pi Network account to access this feature.',
                'GUEST_RESTRICTED'
            );
        }
        
        next();
    } catch (error) {
        if (error instanceof AuthorizationError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message,
                code: error.code,
            });
        } else {
            res.status(403).json({
                success: false,
                error: 'Access denied',
                code: 'ACCESS_DENIED',
            });
        }
    }
};

/**
 * Block guest users
 * Stricter version - blocks ALL guest access
 */
export const blockGuest = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            throw new AuthenticationError('User not authenticated');
        }
        
        if (req.user.role === 'guest') {
            throw new AuthorizationError(
                '⚠️ This feature is not available in Guest Mode. Please sign in with your Pi Network account.',
                'GUEST_BLOCKED'
            );
        }
        
        next();
    } catch (error) {
        if (error instanceof AuthorizationError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message,
                code: error.code,
            });
        } else {
            res.status(403).json({
                success: false,
                error: 'Access denied',
                code: 'ACCESS_DENIED',
            });
        }
    }
};

/**
 * Optional authentication
 * Attaches user if token is valid, but doesn't require it
 */
export const optionalAuth = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = verifyToken(token);
            req.user = payload;
        }
        
        next();
    } catch (error) {
        // Silently fail - authentication is optional
        next();
    }
};

/**
 * ============================================================================
 * EXPORT ALL MIDDLEWARES
 * ============================================================================
 */

export default {
    generateToken,
    verifyToken,
    requireAuth,
    requireKyc,
    requirePioneer,
    blockGuest,
    optionalAuth,
};
