const express = require('express');
const router = express.Router();
const { authenticateToken, requirePioneer, requireAccess } = require('../middleware/auth');
const { getUserProgress, updateUserProgress, createTransaction } = require('../database/db');

/**
 * POST /api/shop/purchase
 * Purchase energy
 */
router.post('/purchase',
    authenticateToken,
    requirePioneer,
    requireAccess('shop', 'canBuyEnergy'),
    async (req, res) => {
        try {
            const { productId, cost } = req.body;
            const userId = req.user.uid;

            if (!productId || !cost || cost <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Données invalides',
                    code: 'INVALID_DATA'
                });
            }

            const progress = await getUserProgress(userId);

            if (!progress || progress.piBalance < cost) {
                return res.status(400).json({
                    success: false,
                    error: 'Solde insuffisant',
                    code: 'INSUFFICIENT_BALANCE'
                });
            }

            // Determine energy gain based on product
            let energyGain = 0;
            if (productId.includes('small')) energyGain = 50;
            else if (productId.includes('medium')) energyGain = 150;
            else if (productId.includes('large')) energyGain = 300;
            else if (productId.includes('unlimited')) energyGain = 999999;

            // Update progress
            await updateUserProgress(userId, {
                piBalance: progress.piBalance - cost,
                energy: {
                    ...progress.energy,
                    current: Math.min(progress.energy.current + energyGain, progress.energy.max + energyGain),
                    max: productId.includes('unlimited') ? 999999 : progress.energy.max
                }
            });

            // Record transaction
            await createTransaction({
                userId,
                type: 'shop_purchase',
                productId,
                amount: cost,
                energyGain
            });

            res.json({
                success: true,
                message: 'Achat effectué avec succès',
                data: {
                    piBalance: progress.piBalance - cost,
                    energyGain
                }
            });

        } catch (error) {
            console.error('Shop purchase error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de l\'achat',
                code: 'PURCHASE_ERROR'
            });
        }
    }
);

/**
 * POST /api/shop/premium
 * Purchase premium subscription
 */
router.post('/premium',
    authenticateToken,
    requirePioneer,
    async (req, res) => {
        try {
            const userId = req.user.uid;
            const PREMIUM_COST = 0.01;

            const progress = await getUserProgress(userId);

            if (!progress || progress.piBalance < PREMIUM_COST) {
                return res.status(400).json({
                    success: false,
                    error: 'Solde insuffisant',
                    code: 'INSUFFICIENT_BALANCE'
                });
            }

            // Update progress and set premium
            await updateUserProgress(userId, {
                piBalance: progress.piBalance - PREMIUM_COST
            });

            // Update user premium status
            const { upsertUser } = require('../database/db');
            await upsertUser({
                uid: userId,
                isPremium: true
            });

            // Record transaction
            await createTransaction({
                userId,
                type: 'premium_purchase',
                amount: PREMIUM_COST
            });

            res.json({
                success: true,
                message: 'Premium activé avec succès',
                data: {
                    isPremium: true,
                    piBalance: progress.piBalance - PREMIUM_COST
                }
            });

        } catch (error) {
            console.error('Premium purchase error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de l\'achat Premium',
                code: 'PREMIUM_ERROR'
            });
        }
    }
);

module.exports = router;
