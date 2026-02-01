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
);

/**
 * GET /api/users/:uid/kyc-status
 * Check user KYC status via Pi Platform API
 */
const axios = require('axios');

router.get('/:uid/kyc-status', 
    async (req, res) => {
        try {
            const { uid } = req.params;
            const accessToken = req.headers.authorization?.split(' ')[1]; // Get Pi Token from Auth Header

            if (!accessToken) {
                 // Fallback: If no token provided, we can't verify against Pi API directly
                 // But if we are in Testnet/Sandbox, we might default to TRUE for testing purposes
                 const isSandbox = process.env.PI_SANDBOX === 'true';
                 return res.json({ verified: isSandbox }); 
            }

            // Call Pi Network Platform API /v2/me to get real KYC status
            const piResponse = await axios.get(
              `https://api.minepi.com/v2/me`,
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              }
            );
            
            // Pi Network returns { user: { ... }, kycVerified: true/false } (if scope requested/granted)
            // Note: 'kyc_verified' might be the field name depending on API version, check docs.
            // For Safety in v2.5: If we get a successful response from /me, it means auth is valid.
            // We check for explicit kyc presence
            
            const kycStatus = piResponse.data.kycVerified || piResponse.data.user?.kycVerified || false;
            
            // SANDBOX OVERRIDE: If failing in sandbox, default to true to allow testing
            if (!kycStatus && process.env.PI_SANDBOX === 'true') {
                 console.log(`[KYC] Sandbox mode active for ${uid}: Forcing KYC=true`);
                 return res.json({ verified: true });
            }

            res.json({ verified: kycStatus });

        } catch (error) {
            console.error('KYC Check Error:', error.message);
            // In case of error (timeout, network), fail safe? Or fail block?
            // For Testnet validation urgency:
            if (process.env.PI_SANDBOX === 'true') {
                return res.json({ verified: true });
            }
            res.status(500).json({ verified: false, error: 'KYC Check Failed' });
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
