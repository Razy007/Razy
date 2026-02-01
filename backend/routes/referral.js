const express = require('express');
const router = express.Router();
const Referral = require('../database/models/Referral');
const User = require('../database/models/User');

/**
 * Referral Routes for Pi Academy
 * Handles all referral system operations
 */

// Middleware pour vérifier l'authentification (à adapter selon votre système)
const authenticateUser = (req, res, next) => {
    // TODO: Implémenter votre logique d'authentification
    // Pour l'instant, on suppose que req.user est défini
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, error: 'Non authentifié' });
    }
    next();
};

/**
 * GET /api/referral/code
 * Obtenir le code de parrainage de l'utilisateur
 */
router.get('/code', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Chercher ou créer le code de parrainage
        let referralDoc = await Referral.findOne({ referrerId: userId });
        
        if (!referralDoc) {
            // Créer un nouveau code de parrainage
            const code = await Referral.generateUniqueCode();
            
            referralDoc = new Referral({
                referrerId: userId,
                referralCode: code
            });
            
            await referralDoc.save();
        }
        
        res.json({
            success: true,
            data: {
                referralCode: referralDoc.referralCode,
                shareLink: `${process.env.FRONTEND_URL || 'https://piacademy.com'}/ref/${referralDoc.referralCode}`,
                stats: referralDoc.stats
            }
        });
    } catch (error) {
        console.error('Error getting referral code:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur lors de la récupération du code de parrainage' 
        });
    }
});

/**
 * POST /api/referral/validate
 * Valider un code de parrainage lors de l'inscription
 */
router.post('/validate', async (req, res) => {
    try {
        const { referralCode } = req.body;
        
        if (!referralCode) {
            return res.status(400).json({ 
                success: false, 
                error: 'Code de parrainage requis' 
            });
        }
        
        // Trouver le parrain
        const referralDoc = await Referral.findByCode(referralCode);
        
        if (!referralDoc) {
            return res.status(404).json({ 
                success: false, 
                error: 'Code de parrainage invalide' 
            });
        }
        
        // Vérifier le niveau de fraude
        if (referralDoc.fraudDetection.suspicionLevel === 'confirmed') {
            return res.status(403).json({ 
                success: false, 
                error: 'Ce code de parrainage n\'est plus valide' 
            });
        }
        
        // Récupérer les infos du parrain
        const referrer = await User.findById(referralDoc.referrerId);
        
        res.json({
            success: true,
            data: {
                valid: true,
                referralCode: referralDoc.referralCode,
                referrerUsername: referrer?.username || 'Pioneer',
                bonuses: {
                    signupXP: 50,
                    signupPi: 0.0001
                }
            }
        });
    } catch (error) {
        console.error('Error validating referral code:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur lors de la validation du code' 
        });
    }
});

/**
 * POST /api/referral/track
 * Tracker un nouveau filleul (appelé lors de l'inscription)
 */
router.post('/track', async (req, res) => {
    try {
        const { referralCode, newUserId, metadata } = req.body;
        
        if (!referralCode || !newUserId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Code de parrainage et ID utilisateur requis' 
            });
        }
        
        // Trouver le parrain
        const referralDoc = await Referral.findByCode(referralCode);
        
        if (!referralDoc) {
            return res.status(404).json({ 
                success: false, 
                error: 'Code de parrainage invalide' 
            });
        }
        
        // Vérifier que l'utilisateur ne se parraine pas lui-même
        if (referralDoc.referrerId.toString() === newUserId.toString()) {
            return res.status(400).json({ 
                success: false, 
                error: 'Vous ne pouvez pas vous parrainer vous-même' 
            });
        }
        
        // Ajouter le filleul
        await referralDoc.addReferral(newUserId, metadata || {});
        
        // Attribuer récompense d'inscription
        await referralDoc.awardReferralReward(newUserId, 'signup', 50, 'XP');
        await referralDoc.awardReferralReward(newUserId, 'signup', 0.0001, 'PI');
        
        // Mettre à jour l'utilisateur parrainé
        await User.findByIdAndUpdate(newUserId, {
            $set: { 
                'referral.referredBy': referralDoc.referrerId,
                'referral.referralCode': referralCode,
                'referral.signupDate': new Date()
            }
        });
        
        // Notifier le parrain (TODO: implémenter système de notifications)
        
        res.json({
            success: true,
            message: 'Parrainage enregistré avec succès',
            data: {
                bonusAwarded: {
                    xp: 50,
                    pi: 0.0001
                }
            }
        });
    } catch (error) {
        console.error('Error tracking referral:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Erreur lors de l\'enregistrement du parrainage' 
        });
    }
});

/**
 * POST /api/referral/milestone
 * Notifier qu'un filleul a atteint un milestone
 */
router.post('/milestone', authenticateUser, async (req, res) => {
    try {
        const { userId, milestone } = req.body;
        
        if (!userId || !milestone) {
            return res.status(400).json({ 
                success: false, 
                error: 'userId et milestone requis' 
            });
        }
        
        // Trouver le parrainage où cet utilisateur est un filleul
        const referralDoc = await Referral.findOne({ 'referrals.userId': userId });
        
        if (!referralDoc) {
            // Pas de parrain, ignorer
            return res.json({ success: true, message: 'Aucun parrain trouvé' });
        }
        
        // Marquer le milestone
        await referralDoc.completeMilestone(userId, milestone);
        
        // Activer le filleul s'il complète son premier cours
        if (milestone === 'firstCourseCompleted') {
            await referralDoc.activateReferral(userId);
            
            // Attribuer récompense
            await referralDoc.awardReferralReward(userId, 'first_course', 25, 'XP');
            await referralDoc.awardReferralReward(userId, 'first_course', 0.0001, 'PI');
        }
        
        // Attribuer récompenses pour niveau 5
        if (milestone === 'level5Reached') {
            await referralDoc.awardReferralReward(userId, 'level_5', 100, 'XP');
            await referralDoc.awardReferralReward(userId, 'level_5', 0.0005, 'PI');
        }
        
        // Attribuer récompenses pour niveau 10
        if (milestone === 'level10Reached') {
            await referralDoc.awardReferralReward(userId, 'level_10', 200, 'XP');
            await referralDoc.awardReferralReward(userId, 'level_10', 0.001, 'PI');
        }
        
        // Vérifier les paliers collectifs
        const unlockedTiers = await referralDoc.checkAndUnlockTiers();
        
        res.json({
            success: true,
            message: 'Milestone enregistré',
            data: {
                milestone,
                unlockedTiers
            }
        });
    } catch (error) {
        console.error('Error recording milestone:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur lors de l\'enregistrement du milestone' 
        });
    }
});

/**
 * GET /api/referral/stats
 * Obtenir les statistiques de parrainage de l'utilisateur
 */
router.get('/stats', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const referralDoc = await Referral.findOne({ referrerId: userId })
            .populate('referrals.userId', 'username avatar level');
        
        if (!referralDoc) {
            return res.json({
                success: true,
                data: {
                    stats: {
                        totalReferrals: 0,
                        activeReferrals: 0,
                        pendingReferrals: 0,
                        totalEarnings: { xp: 0, pi: 0 }
                    },
                    referrals: [],
                    pendingRewards: { xp: 0, pi: 0, badges: [] }
                }
            });
        }
        
        res.json({
            success: true,
            data: {
                stats: referralDoc.stats,
                referrals: referralDoc.referrals.map(r => ({
                    username: r.userId?.username || 'Unknown',
                    avatar: r.userId?.avatar || '👤',
                    level: r.userId?.level || 1,
                    status: r.status,
                    signupDate: r.signupDate,
                    milestones: r.milestones,
                    rewardsEarned: {
                        totalXP: r.rewardsEarned.totalXP,
                        totalPi: r.rewardsEarned.totalPi
                    }
                })),
                pendingRewards: referralDoc.pendingRewards,
                milestones: referralDoc.stats.milestones
            }
        });
    } catch (error) {
        console.error('Error getting referral stats:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur lors de la récupération des statistiques' 
        });
    }
});

/**
 * POST /api/referral/claim-rewards
 * Réclamer les récompenses de parrainage en attente
 */
router.post('/claim-rewards', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const referralDoc = await Referral.findOne({ referrerId: userId });
        
        if (!referralDoc) {
            return res.status(404).json({ 
                success: false, 
                error: 'Aucun parrainage trouvé' 
            });
        }
        
        // Vérifier qu'il y a des récompenses à réclamer
        if (referralDoc.pendingRewards.xp === 0 && referralDoc.pendingRewards.pi === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Aucune récompense en attente' 
            });
        }
        
        // Réclamer les récompenses
        const rewards = await referralDoc.claimPendingRewards();
        
        // Mettre à jour le solde de l'utilisateur
        const user = await User.findById(userId);
        if (user) {
            user.xp = (user.xp || 0) + rewards.xp;
            user.piBalance = (user.piBalance || 0) + rewards.pi;
            
            // Calculer nouveau niveau
            const newLevel = Math.floor(user.xp / 100) + 1;
            if (newLevel > user.level) {
                user.level = newLevel;
            }
            
            // Ajouter badges
            if (rewards.badges.length > 0) {
                user.badges = user.badges || [];
                user.badges.push(...rewards.badges);
            }
            
            await user.save();
        }
        
        res.json({
            success: true,
            message: 'Récompenses réclamées avec succès',
            data: {
                claimed: rewards,
                newBalance: {
                    xp: user.xp,
                    pi: user.piBalance,
                    level: user.level
                }
            }
        });
    } catch (error) {
        console.error('Error claiming rewards:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur lors de la réclamation des récompenses' 
        });
    }
});

/**
 * GET /api/referral/leaderboard
 * Obtenir le classement des meilleurs parrains
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        const topReferrers = await Referral.getTopReferrers(limit);
        
        const leaderboard = topReferrers.map((doc, index) => ({
            rank: index + 1,
            username: doc.referrerId?.username || 'Pioneer',
            avatar: doc.referrerId?.avatar || '🎓',
            level: doc.referrerId?.level || 1,
            activeReferrals: doc.stats.activeReferrals,
            totalEarnings: doc.stats.totalEarnings
        }));
        
        res.json({
            success: true,
            data: {
                leaderboard
            }
        });
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur lors de la récupération du classement' 
        });
    }
});

/**
 * POST /api/referral/report-fraud
 * Signaler une suspicion de fraude
 */
router.post('/report-fraud', authenticateUser, async (req, res) => {
    try {
        const { referralCode, reason } = req.body;
        
        if (!referralCode || !reason) {
            return res.status(400).json({ 
                success: false, 
                error: 'Code de parrainage et raison requis' 
            });
        }
        
        const referralDoc = await Referral.findByCode(referralCode);
        
        if (!referralDoc) {
            return res.status(404).json({ 
                success: false, 
                error: 'Code de parrainage invalide' 
            });
        }
        
        // Ajouter un flag de fraude
        referralDoc.fraudDetection.flags.push({
            type: 'user_report',
            reason,
            date: new Date()
        });
        
        // Augmenter le niveau de suspicion si plusieurs signalements
        const reportCount = referralDoc.fraudDetection.flags.filter(f => f.type === 'user_report').length;
        if (reportCount >= 3 && referralDoc.fraudDetection.suspicionLevel === 'none') {
            referralDoc.fraudDetection.suspicionLevel = 'low';
        } else if (reportCount >= 5 && referralDoc.fraudDetection.suspicionLevel === 'low') {
            referralDoc.fraudDetection.suspicionLevel = 'medium';
        }
        
        await referralDoc.save();
        
        res.json({
            success: true,
            message: 'Signalement enregistré, merci pour votre vigilance'
        });
    } catch (error) {
        console.error('Error reporting fraud:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur lors du signalement' 
        });
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔥 PI NETWORK EXCLUSIVE ENDPOINTS 🔥
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * POST /api/referral/link-pi-wallet
 * Tracker quand un filleul connecte son Pi Wallet et accorder le bonus
 * 🎯 CET ENDPOINT ENCOURAGE L'ADOPTION DE PI NETWORK
 */
router.post('/link-pi-wallet', authenticateUser, async (req, res) => {
    try {
        const { userId, piWalletAddress, piUsername } = req.body;
        
        if (!userId || !piWalletAddress) {
            return res.status(400).json({ 
                success: false, 
                error: 'UserId et Pi Wallet address requis' 
            });
        }
        
        // Trouver le parrainage où cet utilisateur est un filleul
        const referralDoc = await Referral.findOne({ 'referrals.userId': userId });
        
        if (!referralDoc) {
            // Pas de parrain, mais on track quand même pour inciter Pi Network
            return res.json({ 
                success: true, 
                message: 'Pi Wallet lié (aucun parrain)', 
                piBonus: false
            });
        }
        
        // Appeler la méthode linkPiWallet pour accorder le bonus 2x
        const result = await referralDoc.linkPiWallet(userId, {
            piWalletAddress,
            piUsername
        });
        
        // Mettre à jour l'utilisateur
        await User.findByIdAndUpdate(userId, {
            $set: {
                piWalletAddress,
                piUsername
            }
        });
        
        // Vérifier les paliers collectifs (peut débloquer de nouveaux bonus)
        const unlockedTiers = await referralDoc.checkAndUnlockTiers();
        
        res.json({
            success: true,
            message: result.message || '🎉 Pi Wallet lié avec succès !',
            data: {
                piBonus: result.rewards,
                message: '🔥 Votre parrain gagne maintenant 2X toutes les récompenses grâce à votre Pi Wallet !',
                multiplierActive: true,
                unlockedTiers
            }
        });
    } catch (error) {
        console.error('Error linking Pi Wallet:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur lors de la liaison du Pi Wallet' 
        });
    }
});

/**
 * GET /api/referral/pi-network-stats
 * Obtenir les statistiques d'adoption de Pi Network dans le système de parrainage
 * 🎯 MONTRE L'ENGAGEMENT GLOBAL DANS L'ÉCOSYSTÈME PI NETWORK
 */
router.get('/pi-network-stats', async (req, res) => {
    try {
        // Calculer les stats globales
        const allReferrals = await Referral.find({});
        
        let totalReferrals = 0;
        let piNetworkUsers = 0;
        let totalPiEcosystemBonus = 0;
        let topPiAdvocates = [];
        
        allReferrals.forEach(doc => {
            totalReferrals += doc.stats.totalReferrals;
            piNetworkUsers += doc.stats.piNetworkReferrals || 0;
            totalPiEcosystemBonus += doc.stats.totalEarnings.piEcosystemBonus || 0;
        });
        
        // Trouver les meilleurs ambassadeurs Pi Network
        const topAdvocates = await Referral.find({})
            .sort({ 'stats.piNetworkReferrals': -1 })
            .limit(5)
            .populate('referrerId', 'username avatar level');
        
        topPiAdvocates = topAdvocates.map((doc, index) => ({
            rank: index + 1,
            username: doc.referrerId?.username || 'Pioneer',
            avatar: doc.referrerId?.avatar || '🎓',
            piNetworkReferrals: doc.stats.piNetworkReferrals || 0,
            piEcosystemBonus: doc.stats.totalEarnings.piEcosystemBonus || 0
        }));
        
        // Calculer le taux d'adoption Pi Network
        const piAdoptionRate = totalReferrals > 0 
            ? ((piNetworkUsers / totalReferrals) * 100).toFixed(2) 
            : 0;
        
        res.json({
            success: true,
            data: {
                globalStats: {
                    totalReferrals,
                    piNetworkUsers,
                    nonPiUsers: totalReferrals - piNetworkUsers,
                    piAdoptionRate: `${piAdoptionRate}%`,
                    totalPiEcosystemBonus: `${totalPiEcosystemBonus.toFixed(4)}π`
                },
                topPiAdvocates,
                incentives: {
                    piWalletBonus: '0.002π + 200 XP',
                    multiplier: '2x sur toutes les récompenses',
                    message: '💎 Connectez votre Pi Wallet pour débloquer 2X TOUTES les récompenses !'
                }
            }
        });
    } catch (error) {
        console.error('Error getting Pi Network stats:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur lors de la récupération des stats Pi Network' 
        });
    }
});

module.exports = router;
