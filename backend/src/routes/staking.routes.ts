import { Router, Response } from 'express';
import { z } from 'zod';
import stakingService from '../services/staking.service';
import { requireAuth, requireKyc, blockGuest } from '../middlewares/auth.middleware';
import { IAuthRequest } from '../types';

const router = Router();

/**
 * ============================================================================
 * VALIDATION SCHEMAS
 * ============================================================================
 */

const createStakeSchema = z.object({
    amount: z.number().positive().min(1, 'Minimum staking amount is 1 Pi'),
    period: z.union([z.literal(30), z.literal(90), z.literal(180), z.literal(365)]),
});

/**
 * ============================================================================
 * ROUTES
 * ============================================================================
 * 
 * 🔒 CRITICAL SECURITY:
 * All staking routes require:
 * 1. Authentication (requireAuth)
 * 2. KYC verification (requireKyc)
 * 3. Non-guest status (blockGuest)
 * 
 * This prevents ANY client-side manipulation of staking operations.
 */

/**
 * POST /api/staking
 * Create new staking position
 * 🔒 Requires: Auth + KYC + Non-Guest
 */
router.post(
    '/',
    requireAuth,
    requireKyc,
    blockGuest,
    async (req: IAuthRequest, res: Response) => {
        try {
            // Validate request
            const validatedData = createStakeSchema.parse(req.body);
            
            // Create stake (server-side validation)
            const result = await stakingService.createStake(
                req.user!.userId,
                validatedData
            );
            
            res.json({
                success: true,
                data: result,
                message: `✅ Successfully staked ${validatedData.amount} Pi for ${validatedData.period} days!`,
            });
        } catch (error: any) {
            console.error('Create stake error:', error);
            
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid staking parameters',
                    code: 'VALIDATION_ERROR',
                    details: error.errors,
                });
            }
            
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message || 'Failed to create stake',
                code: error.code || 'STAKE_FAILED',
            });
        }
    }
);

/**
 * GET /api/staking
 * Get user's active stakes
 * 🔒 Requires: Auth
 */
router.get('/', requireAuth, async (req: IAuthRequest, res: Response) => {
    try {
        const stakes = await stakingService.getUserStakes(req.user!.userId);
        
        res.json({
            success: true,
            data: stakes,
        });
    } catch (error: any) {
        console.error('Get stakes error:', error);
        
        res.status(500).json({
            success: false,
            error: 'Failed to get stakes',
            code: 'GET_STAKES_FAILED',
        });
    }
});

/**
 * GET /api/staking/stats
 * Get staking statistics
 * 🔒 Requires: Auth
 */
router.get('/stats', requireAuth, async (req: IAuthRequest, res: Response) => {
    try {
        const stats = await stakingService.getStakingStats(req.user!.userId);
        
        res.json({
            success: true,
            data: stats,
        });
    } catch (error: any) {
        console.error('Get staking stats error:', error);
        
        res.status(500).json({
            success: false,
            error: 'Failed to get staking statistics',
            code: 'GET_STATS_FAILED',
        });
    }
});

/**
 * POST /api/staking/:stakingId/complete
 * Complete matured staking
 * 🔒 Requires: Auth + KYC + Non-Guest
 */
router.post(
    '/:stakingId/complete',
    requireAuth,
    requireKyc,
    blockGuest,
    async (req: IAuthRequest, res: Response) => {
        try {
            const { stakingId } = req.params;
            
            const result = await stakingService.completeStake(
                req.user!.userId,
                stakingId
            );
            
            res.json({
                success: true,
                data: result,
                message: `🎉 Staking completed! You earned ${result.reward} Pi in rewards!`,
            });
        } catch (error: any) {
            console.error('Complete stake error:', error);
            
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message || 'Failed to complete stake',
                code: error.code || 'COMPLETE_FAILED',
            });
        }
    }
);

/**
 * POST /api/staking/:stakingId/cancel
 * Cancel active staking (with penalty)
 * 🔒 Requires: Auth + KYC + Non-Guest
 */
router.post(
    '/:stakingId/cancel',
    requireAuth,
    requireKyc,
    blockGuest,
    async (req: IAuthRequest, res: Response) => {
        try {
            const { stakingId } = req.params;
            
            const result = await stakingService.cancelStake(
                req.user!.userId,
                stakingId
            );
            
            res.json({
                success: true,
                data: result,
                message: `⚠️ Staking cancelled. ${result.returned} Pi returned (${result.penalty} Pi penalty applied).`,
            });
        } catch (error: any) {
            console.error('Cancel stake error:', error);
            
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message || 'Failed to cancel stake',
                code: error.code || 'CANCEL_FAILED',
            });
        }
    }
);

/**
 * ============================================================================
 * EXPORT ROUTER
 * ============================================================================
 */

export default router;
