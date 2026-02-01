import { Router, Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/auth.service';
import { requireAuth } from '../middlewares/auth.middleware';
import { IAuthRequest } from '../types';

const router = Router();

/**
 * ============================================================================
 * VALIDATION SCHEMAS
 * ============================================================================
 */

const piAuthSchema = z.object({
    uid: z.string().min(1),
    username: z.string().min(3).max(30),
    accessToken: z.string().min(1),
});

/**
 * ============================================================================
 * ROUTES
 * ============================================================================
 */

/**
 * POST /api/auth/pi
 * Authenticate with Pi Network
 */
router.post('/pi', async (req: Request, res: Response) => {
    try {
        // Validate request body
        const validatedData = piAuthSchema.parse(req.body);
        
        // Authenticate
        const result = await authService.authenticateWithPi(validatedData);
        
        res.json({
            success: true,
            data: {
                user: result.user,
                token: result.token,
                isNewUser: result.isNewUser,
            },
            message: result.isNewUser
                ? 'Welcome to Pioneer Academy! 🎉'
                : 'Welcome back! 👋',
        });
    } catch (error: any) {
        console.error('Pi authentication error:', error);
        
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Invalid request data',
                code: 'VALIDATION_ERROR',
                details: error.errors,
            });
        }
        
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Authentication failed',
            code: error.code || 'AUTH_FAILED',
        });
    }
});

/**
 * POST /api/auth/guest
 * Authenticate as guest (demo mode)
 */
router.post('/guest', async (req: Request, res: Response) => {
    try {
        const result = await authService.authenticateAsGuest();
        
        res.json({
            success: true,
            data: {
                user: result.user,
                token: result.token,
            },
            message: '🎮 Guest Mode Activated - Explore Pioneer Academy!',
        });
    } catch (error: any) {
        console.error('Guest authentication error:', error);
        
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Failed to create guest session',
            code: error.code || 'GUEST_AUTH_FAILED',
        });
    }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', requireAuth, async (req: IAuthRequest, res: Response) => {
    try {
        const User = (await import('../models/User.model')).default;
        
        const user = await User.findById(req.user!.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                code: 'USER_NOT_FOUND',
            });
        }
        
        res.json({
            success: true,
            data: user.toJSON(),
        });
    } catch (error: any) {
        console.error('Get user error:', error);
        
        res.status(500).json({
            success: false,
            error: 'Failed to get user info',
            code: 'GET_USER_FAILED',
        });
    }
});

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 */
router.post('/refresh', requireAuth, async (req: IAuthRequest, res: Response) => {
    try {
        const newToken = await authService.refreshUserToken(req.user!.userId);
        
        res.json({
            success: true,
            data: {
                token: newToken,
            },
            message: 'Token refreshed successfully',
        });
    } catch (error: any) {
        console.error('Token refresh error:', error);
        
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Failed to refresh token',
            code: error.code || 'REFRESH_FAILED',
        });
    }
});

/**
 * POST /api/auth/logout
 * Logout (client-side token removal, server just confirms)
 */
router.post('/logout', requireAuth, async (req: IAuthRequest, res: Response) => {
    try {
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error: any) {
        console.error('Logout error:', error);
        
        res.status(500).json({
            success: false,
            error: 'Logout failed',
            code: 'LOGOUT_FAILED',
        });
    }
});

/**
 * ============================================================================
 * EXPORT ROUTER
 * ============================================================================
 */

export default router;
