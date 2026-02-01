const Referral = require('../database/models/Referral');
const User = require('../database/models/User');

/**
 * Referral Service for Pi Academy
 * Automatic reward attribution based on user events
 */

class ReferralService {
    /**
     * Appelé quand un utilisateur s'inscrit avec un code de parrainage
     */
    static async onUserSignup(userId, referralCode, metadata = {}) {
        try {
            if (!referralCode) return null;
            
            console.log(`[Referral] New signup: User ${userId} with code ${referralCode}`);
            
            const referralDoc = await Referral.findByCode(referralCode);
            if (!referralDoc) {
                console.warn(`[Referral] Invalid code: ${referralCode}`);
                return null;
            }
            
            // Vérifier auto-parrainage
            if (referralDoc.referrerId.toString() === userId.toString()) {
                console.warn(`[Referral] Self-referral attempt blocked: ${userId}`);
                return null;
            }
            
            // Anti-fraude: vérifier IP/device
            const suspiciousActivity = await this.detectFraud(referralDoc, metadata);
            if (suspiciousActivity) {
                console.warn(`[Referral] Suspicious activity detected for ${userId}`);
                referralDoc.fraudDetection.flags.push({
                    type: 'suspicious_signup',
                    reason: suspiciousActivity,
                    date: new Date()
                });
            }
            
            // Ajouter le filleul
            await referralDoc.addReferral(userId, metadata);
            
            // Attribuer récompenses d'inscription
            await referralDoc.awardReferralReward(userId, 'signup', 50, 'XP');
            await referralDoc.awardReferralReward(userId, 'signup', 0.0001, 'PI');
            
            // Mettre à jour l'utilisateur
            await User.findByIdAndUpdate(userId, {
                $set: {
                    'referral.referredBy': referralDoc.referrerId,
                    'referral.referralCode': referralCode,
                    'referral.signupDate': new Date()
                },
                $inc: {
                    xp: 50,
                    piBalance: 0.0001
                }
            });
            
            console.log(`[Referral] Signup rewards awarded: 50 XP + 0.0001π`);
            
            return {
                success: true,
                rewards: { xp: 50, pi: 0.0001 }
            };
        } catch (error) {
            console.error('[Referral] Error in onUserSignup:', error);
            return null;
        }
    }
    
    /**
     * Appelé quand un utilisateur complète son premier cours
     */
    static async onFirstCourseCompleted(userId) {
        try {
            console.log(`[Referral] First course completed: User ${userId}`);
            
            // Trouver le parrainage
            const referralDoc = await Referral.findOne({ 'referrals.userId': userId });
            if (!referralDoc) {
                console.log(`[Referral] No referrer found for ${userId}`);
                return null;
            }
            
            const referral = referralDoc.referrals.find(r => r.userId.toString() === userId.toString());
            if (!referral) return null;
            
            // Vérifier si déjà réclamé
            if (referral.milestones.firstCourseCompleted?.completed) {
                console.log(`[Referral] First course already claimed for ${userId}`);
                return null;
            }
            
            // Marquer le milestone
            await referralDoc.completeMilestone(userId, 'firstCourseCompleted');
            
            // Activer le filleul
            await referralDoc.activateReferral(userId);
            
            // Attribuer récompenses
            await referralDoc.awardReferralReward(userId, 'first_course', 25, 'XP');
            await referralDoc.awardReferralReward(userId, 'first_course', 0.0001, 'PI');
            
            // Vérifier les paliers collectifs
            const unlockedTiers = await referralDoc.checkAndUnlockTiers();
            
            console.log(`[Referral] First course rewards awarded: 25 XP + 0.0001π`);
            if (unlockedTiers.length > 0) {
                console.log(`[Referral] Tier(s) unlocked:`, unlockedTiers);
            }
            
            return {
                success: true,
                rewards: { xp: 25, pi: 0.0001 },
                unlockedTiers
            };
        } catch (error) {
            console.error('[Referral] Error in onFirstCourseCompleted:', error);
            return null;
        }
    }
    
    /**
     * Appelé quand un utilisateur atteint le niveau 5
     */
    static async onLevel5Reached(userId) {
        try {
            console.log(`[Referral] Level 5 reached: User ${userId}`);
            
            const referralDoc = await Referral.findOne({ 'referrals.userId': userId });
            if (!referralDoc) return null;
            
            const referral = referralDoc.referrals.find(r => r.userId.toString() === userId.toString());
            if (!referral) return null;
            
            // Vérifier si déjà réclamé
            if (referral.milestones.level5Reached?.completed) {
                console.log(`[Referral] Level 5 already claimed for ${userId}`);
                return null;
            }
            
            // Marquer le milestone
            await referralDoc.completeMilestone(userId, 'level5Reached');
            
            // Attribuer récompenses
            await referralDoc.awardReferralReward(userId, 'level_5', 100, 'XP');
            await referralDoc.awardReferralReward(userId, 'level_5', 0.0005, 'PI');
            
            // Vérifier les paliers collectifs
            const unlockedTiers = await referralDoc.checkAndUnlockTiers();
            
            console.log(`[Referral] Level 5 rewards awarded: 100 XP + 0.0005π`);
            if (unlockedTiers.length > 0) {
                console.log(`[Referral] Tier(s) unlocked:`, unlockedTiers);
            }
            
            return {
                success: true,
                rewards: { xp: 100, pi: 0.0005 },
                unlockedTiers
            };
        } catch (error) {
            console.error('[Referral] Error in onLevel5Reached:', error);
            return null;
        }
    }
    
    /**
     * Appelé quand un utilisateur atteint le niveau 10
     */
    static async onLevel10Reached(userId) {
        try {
            console.log(`[Referral] Level 10 reached: User ${userId}`);
            
            const referralDoc = await Referral.findOne({ 'referrals.userId': userId });
            if (!referralDoc) return null;
            
            const referral = referralDoc.referrals.find(r => r.userId.toString() === userId.toString());
            if (!referral) return null;
            
            // Vérifier si déjà réclamé
            if (referral.milestones.level10Reached?.completed) {
                console.log(`[Referral] Level 10 already claimed for ${userId}`);
                return null;
            }
            
            // Marquer le milestone
            await referralDoc.completeMilestone(userId, 'level10Reached');
            
            // Attribuer récompenses
            await referralDoc.awardReferralReward(userId, 'level_10', 200, 'XP');
            await referralDoc.awardReferralReward(userId, 'level_10', 0.001, 'PI');
            
            // Vérifier les paliers collectifs
            const unlockedTiers = await referralDoc.checkAndUnlockTiers();
            
            console.log(`[Referral] Level 10 rewards awarded: 200 XP + 0.001π`);
            if (unlockedTiers.length > 0) {
                console.log(`[Referral] Tier(s) unlocked:`, unlockedTiers);
            }
            
            return {
                success: true,
                rewards: { xp: 200, pi: 0.001 },
                unlockedTiers
            };
        } catch (error) {
            console.error('[Referral] Error in onLevel10Reached:', error);
            return null;
        }
    }

    /**
     * 🔥 MÉTHODE CLANG PI NETWORK
     * Appelé quand un utilisateur lie son wallet Pi (Action clé de l'écosystème)
     * Active le multiplicateur 2X pour le parrain automatiquement
     */
    static async onPiWalletLinked(userId, piWalletData) {
        try {
            console.log(`[Referral 🔥 Pi Network] Pi Wallet linked: User ${userId}`);
            
            // 1. Récompense directe pour l'utilisateur (incitation forte à rejoindre Pi Network)
            await User.findByIdAndUpdate(userId, {
                $inc: { 
                    xp: 100, 
                    piBalance: 0.0005 
                },
                $set: {
                    piWalletAddress: piWalletData?.piWalletAddress,
                    piUsername: piWalletData?.piUsername
                },
                $addToSet: { badges: 'pi_pioneer' }
            });

            // 2. Récompense pour le parrain + ACTIVATION MULTIPLICATEUR 2X
            const referralDoc = await Referral.findOne({ 'referrals.userId': userId });
            if (!referralDoc) {
                console.log('[Referral] No referrer found, but user rewarded for joining Pi Network');
                return { 
                    success: true, 
                    userRewarded: true, 
                    referrerRewarded: false,
                    message: '🎉 Bienvenue dans l\'écosystème Pi Network !'
                };
            }
            
            // 🔥 APPELER LA MÉTHODE linkPiWallet pour activer le bonus 2X
            const piBonus = await referralDoc.linkPiWallet(userId, {
                piWalletAddress: piWalletData?.piWalletAddress,
                piUsername: piWalletData?.piUsername
            });
            
            // Vérifier les paliers collectifs
            const unlockedTiers = await referralDoc.checkAndUnlockTiers();
            
            console.log(`[Referral 🔥 Pi Network] MULTIPLICATEUR 2X ACTIVÉ pour toutes les futures récompenses !`);
            console.log(`[Referral] Pi Wallet rewards: User +100XP, Referrer +${piBonus?.rewards?.xp || 200}XP + ${piBonus?.rewards?.pi || 0.002}π`);
            
            return {
                success: true,
                rewards: { 
                    user: { xp: 100, pi: 0.0005 },
                    referrer: piBonus?.rewards || { xp: 200, pi: 0.002 }
                },
                multiplier2xActivated: true,
                message: '🔥 Multiplicateur 2X Pi Network activé ! Votre parrain gagne maintenant 2X sur vos réussites !',
                unlockedTiers
            };
        } catch (error) {
            console.error('[Referral] Error in onPiWalletLinked:', error);
            return null;
        }
    }
    
    /**
     * Appelé quand un utilisateur valide son KYC
     */
    static async onKYCValidated(userId) {
        try {
            console.log(`[Referral] KYC validated: User ${userId}`);
            
            const referralDoc = await Referral.findOne({ 'referrals.userId': userId });
            if (!referralDoc) return null;
            
            const referral = referralDoc.referrals.find(r => r.userId.toString() === userId.toString());
            if (!referral) return null;
            
            // Marquer comme validé KYC
            referral.metadata.validatedKYC = true;
            await referralDoc.save();
            
            console.log(`[Referral] KYC validated for referral ${userId}`);
            
            return { success: true };
        } catch (error) {
            console.error('[Referral] Error in onKYCValidated:', error);
            return null;
        }
    }
    
    /**
     * Détection basique de fraude
     */
    static async detectFraud(referralDoc, metadata) {
        const issues = [];
        
        // Vérifier les IP dupliquées
        if (metadata.ipAddress) {
            const sameIPCount = referralDoc.referrals.filter(
                r => r.metadata.ipAddress === metadata.ipAddress
            ).length;
            
            if (sameIPCount >= 3) {
                issues.push(`Multiple referrals from same IP: ${sameIPCount} accounts`);
            }
        }
        
        // Vérifier les device fingerprints
        if (metadata.deviceFingerprint) {
            const sameDeviceCount = referralDoc.referrals.filter(
                r => r.metadata.deviceFingerprint === metadata.deviceFingerprint
            ).length;
            
            if (sameDeviceCount >= 2) {
                issues.push(`Multiple referrals from same device: ${sameDeviceCount} accounts`);
            }
        }
        
        // Vérifier la vélocité (nombre de parrainages en 24h)
        const last24h = Date.now() - (24 * 60 * 60 * 1000);
        const recentReferrals = referralDoc.referrals.filter(
            r => r.signupDate >= last24h
        ).length;
        
        if (recentReferrals > 10) {
            issues.push(`Suspicious velocity: ${recentReferrals} referrals in 24h`);
        }
        
        return issues.length > 0 ? issues.join('; ') : null;
    }
    
    /**
     * Tâche planifiée: Désactiver les filleuls inactifs
     */
    static async deactivateInactiveReferrals() {
        try {
            console.log('[Referral] Running inactive referrals cleanup...');
            
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            
            const referralDocs = await Referral.find({
                'referrals.status': 'pending',
                'referrals.signupDate': { $lt: thirtyDaysAgo }
            });
            
            let deactivatedCount = 0;
            
            for (const doc of referralDocs) {
                for (const referral of doc.referrals) {
                    if (referral.status === 'pending' && referral.signupDate < thirtyDaysAgo) {
                        // Vérifier l'activité de l'utilisateur
                        const user = await User.findById(referral.userId);
                        
                        if (!user || user.completedCourses?.length === 0) {
                            referral.status = 'inactive';
                            doc.stats.pendingReferrals -= 1;
                            deactivatedCount++;
                        }
                    }
                }
                
                await doc.save();
            }
            
            console.log(`[Referral] Deactivated ${deactivatedCount} inactive referrals`);
            
            return deactivatedCount;
        } catch (error) {
            console.error('[Referral] Error in deactivateInactiveReferrals:', error);
            return 0;
        }
    }
    
    /**
     * Obtenir les statistiques globales du système de parrainage
     */
    static async getGlobalStats() {
        try {
            const stats = await Referral.aggregate([
                {
                    $group: {
                        _id: null,
                        totalReferrals: { $sum: '$stats.totalReferrals' },
                        totalActiveReferrals: { $sum: '$stats.activeReferrals' },
                        totalXPAwarded: { $sum: '$stats.totalEarnings.xp' },
                        totalPiAwarded: { $sum: '$stats.totalEarnings.pi' }
                    }
                }
            ]);
            
            return stats[0] || {
                totalReferrals: 0,
                totalActiveReferrals: 0,
                totalXPAwarded: 0,
                totalPiAwarded: 0
            };
        } catch (error) {
            console.error('[Referral] Error getting global stats:', error);
            return null;
        }
    }
}

module.exports = ReferralService;
