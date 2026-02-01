const express = require('express');
const router = express.Router();
const { authenticateToken, requirePioneer, requireAccess } = require('../middleware/auth');
const { getUserProgress, updateUserProgress, createTransaction } = require('../database/db');

/**
 * POST /api/transactions/withdraw
 * Withdraw Pi
 */
router.post('/withdraw',
    authenticateToken,
    requirePioneer,
    requireAccess('earnings', 'canWithdraw'),
    async (req, res) => {
        try {
            const { amount, address } = req.body;
            const userId = req.user.uid;

            if (!amount || amount <= 0 || !address) {
                return res.status(400).json({
                    success: false,
                    error: 'Données invalides',
                    code: 'INVALID_DATA'
                });
            }

            // Check withdrawal limits
            const { withdrawLimit } = req.accessLimits;
            
            if (withdrawLimit !== null && amount > withdrawLimit) {
                return res.status(403).json({
                    success: false,
                    error: `Limite de retrait: ${withdrawLimit}π par jour. Complétez votre KYC pour des retraits illimités.`,
                    code: 'WITHDRAW_LIMIT_EXCEEDED',
                    limit: withdrawLimit,
                    requiredStatus: 'pioneer_kyc'
                });
            }

            const progress = await getUserProgress(userId);

            if (!progress || progress.piBalance < amount) {
                return res.status(400).json({
                    success: false,
                    error: 'Solde insuffisant',
                    code: 'INSUFFICIENT_BALANCE'
                });
            }

            // Calculate fees (0% for premium, 2% for others)
            const { findUserByUid } = require('../database/db');
            const user = await findUserByUid(userId);
            const fee = user.isPremium ? 0 : amount * 0.02;
            const net = amount - fee;

            // Update balance
            await updateUserProgress(userId, {
                piBalance: progress.piBalance - amount
            });

            // Record transaction
            await createTransaction({
                userId,
                type: 'withdrawal',
                amount,
                fee,
                net,
                address,
                status: 'pending'
            });

            res.json({
                success: true,
                message: 'Retrait en cours de traitement',
                data: {
                    amount,
                    fee,
                    net,
                    piBalance: progress.piBalance - amount,
                    estimatedTime: '24-48h'
                }
            });

        } catch (error) {
            console.error('Withdrawal error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors du retrait',
                code: 'WITHDRAWAL_ERROR'
            });
        }
    }
);

/**
 * POST /api/transactions/deposit
 * Deposit Pi (for testing)
 */
router.post('/deposit',
    authenticateToken,
    async (req, res) => {
        try {
            const { amount } = req.body;
            const userId = req.user.uid;

            if (!amount || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Montant invalide',
                    code: 'INVALID_AMOUNT'
                });
            }

            const progress = await getUserProgress(userId);

            await updateUserProgress(userId, {
                piBalance: (progress?.piBalance || 0) + amount
            });

            await createTransaction({
                userId,
                type: 'deposit',
                amount
            });

            res.json({
                success: true,
                message: 'Dépôt effectué avec succès',
                data: {
                    amount,
                    piBalance: (progress?.piBalance || 0) + amount
                }
            });

        } catch (error) {
            console.error('Deposit error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors du dépôt',
                code: 'DEPOSIT_ERROR'
            });
        }
    }
);

module.exports = router;
