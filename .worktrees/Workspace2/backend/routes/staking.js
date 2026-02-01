const express = require('express');
const router = express.Router();
const { authenticateToken, requirePioneer, requireAccess } = require('../middleware/auth');
const { startStaking, unstake, getUserProgress } = require('../database/db');

/**
 * POST /api/staking/start
 * Start staking
 */
router.post('/start', 
    authenticateToken, 
    requirePioneer,
    requireAccess('staking', 'canStake'),
    async (req, res) => {
        try {
            const { amount, period } = req.body;
            const userId = req.user.uid;

            // Validation
            if (!amount || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Montant invalide',
                    code: 'INVALID_AMOUNT'
                });
            }

            if (![30, 60, 90].includes(period)) {
                return res.status(400).json({
                    success: false,
                    error: 'Période invalide (30, 60, ou 90 jours)',
                    code: 'INVALID_PERIOD'
                });
            }

            // Check staking limits based on user status
            const { maxStakeAmount } = req.accessLimits;
            
            if (maxStakeAmount !== null && amount > maxStakeAmount) {
                return res.status(403).json({
                    success: false,
                    error: `Limite de staking: ${maxStakeAmount}π. Complétez votre KYC pour staker sans limite.`,
                    code: 'STAKE_LIMIT_EXCEEDED',
                    limit: maxStakeAmount,
                    requiredStatus: 'pioneer_kyc'
                });
            }

            // Start staking (atomic transaction)
            await startStaking(userId, amount, period);

            // Get updated progress
            const progress = await getUserProgress(userId);

            res.json({
                success: true,
                message: 'Staking démarré avec succès',
                data: {
                    stakingBalance: progress.stakingBalance,
                    piBalance: progress.piBalance,
                    stakingPeriod: period,
                    stakingStartDate: progress.stakingStartDate
                }
            });

        } catch (error) {
            console.error('Staking start error:', error);
            
            if (error.message === 'Solde insuffisant') {
                return res.status(400).json({
                    success: false,
                    error: 'Solde insuffisant',
                    code: 'INSUFFICIENT_BALANCE'
                });
            }

            res.status(500).json({
                success: false,
                error: 'Erreur lors du démarrage du staking',
                code: 'STAKING_ERROR'
            });
        }
    }
);

/**
 * POST /api/staking/unstake
 * Unstake and claim rewards
 */
router.post('/unstake',
    authenticateToken,
    requirePioneer,
    async (req, res) => {
        try {
            const userId = req.user.uid;

            // Unstake (atomic transaction)
            const result = await unstake(userId);

            // Get updated progress
            const progress = await getUserProgress(userId);

            res.json({
                success: true,
                message: 'Unstake réussi',
                data: {
                    totalAmount: result.totalAmount,
                    stakingBalance: progress.stakingBalance,
                    piBalance: progress.piBalance
                }
            });

        } catch (error) {
            console.error('Unstake error:', error);

            if (error.message === 'Aucun staking actif') {
                return res.status(400).json({
                    success: false,
                    error: 'Aucun staking actif',
                    code: 'NO_ACTIVE_STAKING'
                });
            }

            res.status(500).json({
                success: false,
                error: 'Erreur lors de l\'unstake',
                code: 'UNSTAKE_ERROR'
            });
        }
    }
);

/**
 * GET /api/staking/:userId
 * Get staking information
 */
router.get('/:userId',
    authenticateToken,
    async (req, res) => {
        try {
            const { userId } = req.params;

            // Verify user can only access their own data
            if (userId !== req.user.uid) {
                return res.status(403).json({
                    success: false,
                    error: 'Accès refusé',
                    code: 'ACCESS_DENIED'
                });
            }

            const progress = await getUserProgress(userId);

            if (!progress) {
                return res.status(404).json({
                    success: false,
                    error: 'Progression non trouvée',
                    code: 'PROGRESS_NOT_FOUND'
                });
            }

            res.json({
                success: true,
                data: {
                    stakingBalance: progress.stakingBalance || 0,
                    stakingRewards: progress.stakingRewards || 0,
                    stakingStartDate: progress.stakingStartDate,
                    stakingPeriod: progress.stakingPeriod
                }
            });

        } catch (error) {
            console.error('Get staking info error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des informations',
                code: 'GET_STAKING_ERROR'
            });
        }
    }
);

module.exports = router;
