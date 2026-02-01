const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { findUserByUid, getUserProgress, updateUserProgress } = require('../database/db');

/**
 * GET /api/users/:userId
 * Get user profile
 */
router.get('/:userId',
    authenticateToken,
    async (req, res) => {
        try {
            const { userId } = req.params;

            const user = await findUserByUid(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Utilisateur non trouvé',
                    code: 'USER_NOT_FOUND'
                });
            }

            // Remove sensitive data
            const { _id, ...userData } = user;

            res.json({
                success: true,
                data: userData
            });

        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération de l\'utilisateur',
                code: 'GET_USER_ERROR'
            });
        }
    }
);

/**
 * GET /api/users/:userId/progress
 * Get user progress
 */
router.get('/:userId/progress',
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
                data: progress
            });

        } catch (error) {
            console.error('Get progress error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération de la progression',
                code: 'GET_PROGRESS_ERROR'
            });
        }
    }
);

/**
 * PUT /api/users/:userId/progress
 * Update user progress
 */
router.put('/:userId/progress',
    authenticateToken,
    async (req, res) => {
        try {
            const { userId } = req.params;
            const progressData = req.body;

            // Verify user can only update their own data
            if (userId !== req.user.uid) {
                return res.status(403).json({
                    success: false,
                    error: 'Accès refusé',
                    code: 'ACCESS_DENIED'
                });
            }

            await updateUserProgress(userId, progressData);

            const updatedProgress = await getUserProgress(userId);

            res.json({
                success: true,
                message: 'Progression mise à jour',
                data: updatedProgress
            });

        } catch (error) {
            console.error('Update progress error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la mise à jour de la progression',
                code: 'UPDATE_PROGRESS_ERROR'
            });
        }
    }
);



/**
 * POST /api/users/:userId/link-pi-wallet
 * Link Pi Wallet address and trigger ecosystem rewards
 */
const User = require('../database/models/User');
const ReferralService = require('../services/ReferralService');

router.post('/:userId/link-pi-wallet',
    authenticateToken,
    async (req, res) => {
        try {
            const { userId } = req.params;
            const { walletAddress } = req.body;

            // Verify user can only update their own data
            if (userId !== req.user.uid) {
                return res.status(403).json({
                    success: false,
                    error: 'Accès refusé',
                    code: 'ACCESS_DENIED'
                });
            }

            if (!walletAddress || walletAddress.length < 20) {
                return res.status(400).json({
                    success: false,
                    error: 'Adresse de wallet invalide',
                    code: 'INVALID_WALLET'
                });
            }

            // Update user
            const user = await User.findOne({ uid: userId });
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            // Check if already linked
            if (user.piWalletAddress) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Wallet déjà lié',
                    code: 'WALLET_ALREADY_LINKED' 
                });
            }

            user.piWalletAddress = walletAddress;
            await user.save();

            // Trigger Referral/Ecosystem Reward
            const rewardResult = await ReferralService.onPiWalletLinked(user._id);

            res.json({
                success: true,
                message: 'Pi Wallet lié avec succès !',
                data: {
                    walletAddress: user.piWalletAddress,
                    rewards: rewardResult ? rewardResult.rewards : null
                }
            });

        } catch (error) {
            console.error('Link wallet error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la liaison du wallet',
                code: 'LINK_WALLET_ERROR'
            });
        }
    }
);

module.exports = router;
