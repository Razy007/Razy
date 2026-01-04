const express = require('express');
const router = express.Router();
const { generateToken } = require('../middleware/auth');
const { findUserByUid, upsertUser, getUserProgress, updateUserProgress } = require('../database/db');
const { verifyPiToken } = require('../services/piNetworkService');

/**
 * POST /api/auth/pi
 * Authenticate with Pi Network
 */
router.post('/pi', async (req, res) => {
    try {
        const { uid, username, accessToken } = req.body;

        if (!accessToken) {
             return res.status(400).json({
                success: false,
                error: 'AccessToken requis',
                code: 'MISSING_TOKEN'
            });
        }

        // Verify Pi Network access token
        let validatedUser;
        try {
            validatedUser = await verifyPiToken(accessToken);
        } catch (authError) {
             return res.status(401).json({
                success: false,
                error: 'Token Pi invalide ou expiré',
                code: 'INVALID_TOKEN'
            });
        }

        // Security check: Ensure the UID claimed matches the one from Pi Network
        // Note: In a pure flow, we should rely solely on validatedUser.uid
        if (uid && validatedUser.uid !== uid) {
             console.warn(`⚠️ Security Warning: Frontend claimed UID ${uid} but Pi Token belongs to ${validatedUser.uid}`);
             // We can strictly enforce it, or just use the validated one. Let's enforce strictly to detect anomalies.
             return res.status(403).json({
                success: false,
                error: 'Usurpation d\'identité détectée',
                code: 'IDENTITY_MISMATCH'
            });
        }

        const reliableUid = validatedUser.uid;
        const reliableUsername = validatedUser.username || username; // Backend might not return username sometimes? default to claim if verified.

        // Check if user exists
        let user = await findUserByUid(reliableUid);
        const isNewUser = !user;

        // Create or update user
        const userData = {
            uid: reliableUid,
            username: reliableUsername,
            authStatus: 'pioneer',
            kycStatus: 'none', // Will be updated after KYC verification
            kycVerified: false,
            avatar: user?.avatar || '👤',
            joinDate: user?.joinDate || new Date().toISOString().split('T')[0],
            lastLogin: new Date(),
            isPremium: user?.isPremium || false
        };

        await upsertUser(userData);

        // Initialize progress for new users
        if (isNewUser) {
            await updateUserProgress(reliableUid, {
                userId: reliableUid,
                level: 1,
                xp: 0,
                xpToNext: 100,
                streak: 0,
                piBalance: 0,
                completedCourses: [],
                completedLayers: {},
                layerMastery: {},
                questionHistory: {},
                energy: {
                    current: 100,
                    max: 100,
                    lastRecharge: new Date()
                },
                reputation: { total: 100, constancy: 0, progression: 0, precision: 0 },
                totalPoints: 0,
                referralCode: 'PIA' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                stakingBalance: 0,
                stakingRewards: 0,
                stakingStartDate: null,
                stakingPeriod: null
            });
        }

        // Generate JWT token
        const token = generateToken({
            uid: userData.uid,
            username: userData.username,
            authStatus: userData.authStatus,
            kycVerified: userData.kycVerified
        });

        res.json({
            success: true,
            data: {
                user: userData,
                token
            },
            message: isNewUser ? 'Compte créé avec succès' : 'Connexion réussie'
        });

    } catch (error) {
        console.error('Pi auth error:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur d\'authentification interne',
            code: 'AUTH_ERROR'
        });
    }
});

/**
 * POST /api/auth/guest
 * Guest login
 */
router.post('/guest', async (req, res) => {
    try {
        const uid = 'GUEST_' + Math.floor(Math.random() * 100000);
        const username = 'Guest_Pioneer_' + Math.floor(Math.random() * 1000);

        const userData = {
            uid,
            username,
            authStatus: 'guest',
            kycStatus: 'none',
            kycVerified: false,
            avatar: '🕵️',
            joinDate: new Date().toISOString().split('T')[0],
            lastLogin: new Date(),
            isPremium: false
        };

        await upsertUser(userData);

        // Initialize minimal progress for guests
        await updateUserProgress(uid, {
            userId: uid,
            level: 1,
            xp: 0,
            xpToNext: 100,
            streak: 0,
            piBalance: 0,
            completedCourses: [],
            energy: {
                current: 50,
                max: 50,
                lastRecharge: new Date()
            },
            totalPoints: 0
        });

        // Generate JWT token
        const token = generateToken({
            uid: userData.uid,
            username: userData.username,
            authStatus: 'guest',
            kycVerified: false
        });

        res.json({
            success: true,
            data: {
                user: userData,
                token
            },
            message: 'Mode invité activé'
        });

    } catch (error) {
        console.error('Guest auth error:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur de connexion invité',
            code: 'GUEST_AUTH_ERROR'
        });
    }
});

/**
 * POST /api/auth/logout
 * Logout (token invalidation would be handled client-side)
 */
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Déconnexion réussie'
    });
});

/**
 * GET /api/auth/kyc/:userId
 * Verify KYC status
 */
router.get('/kyc/:userId', async (req, res) => {
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

        // TODO: Verify KYC with Pi Network API
        // For now, return stored status

        res.json({
            success: true,
            data: {
                kycStatus: user.kycStatus,
                kycVerified: user.kycVerified
            }
        });

    } catch (error) {
        console.error('KYC verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur de vérification KYC',
            code: 'KYC_ERROR'
        });
    }
});

/**
 * POST /api/auth/kyc/update
 * Update KYC status (for testing/simulation)
 */
router.post('/kyc/update', async (req, res) => {
    try {
        const { uid, kycStatus, kycVerified } = req.body;

        if (!uid) {
            return res.status(400).json({
                success: false,
                error: 'UID requis',
                code: 'MISSING_UID'
            });
        }

        const user = await findUserByUid(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Utilisateur non trouvé',
                code: 'USER_NOT_FOUND'
            });
        }

        await upsertUser({
            ...user,
            kycStatus: kycStatus || user.kycStatus,
            kycVerified: kycVerified !== undefined ? kycVerified : user.kycVerified
        });

        res.json({
            success: true,
            message: 'Statut KYC mis à jour',
            data: {
                kycStatus: kycStatus || user.kycStatus,
                kycVerified: kycVerified !== undefined ? kycVerified : user.kycVerified
            }
        });

    } catch (error) {
        console.error('KYC update error:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur de mise à jour KYC',
            code: 'KYC_UPDATE_ERROR'
        });
    }
});

module.exports = router;
