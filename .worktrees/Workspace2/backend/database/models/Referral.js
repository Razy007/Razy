const mongoose = require('mongoose');

/**
 * Referral Schema for Pi Academy
 * Tracks referral relationships and rewards
 */
const referralSchema = new mongoose.Schema({
    // Parrain (referrer)
    referrerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    
    // Code de parrainage unique du parrain
    referralCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        match: /^PIA[A-Z0-9]{6}$/,
        index: true
    },
    
    // Filleuls (referrals)
    referrals: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        
        // Date d'inscription via le lien de parrainage
        signupDate: {
            type: Date,
            default: Date.now
        },
        
        // Statut du filleul
        status: {
            type: String,
            enum: ['pending', 'active', 'inactive', 'banned'],
            default: 'pending'
        },
        
        // Progression du filleul
        milestones: {
            firstCourseCompleted: {
                completed: { type: Boolean, default: false },
                date: Date,
                rewardClaimed: { type: Boolean, default: false }
            },
            level5Reached: {
                completed: { type: Boolean, default: false },
                date: Date,
                rewardClaimed: { type: Boolean, default: false }
            },
            level10Reached: {
                completed: { type: Boolean, default: false },
                date: Date,
                rewardClaimed: { type: Boolean, default: false }
            },
            piWalletLinked: {
                completed: { type: Boolean, default: false },
                date: Date,
                rewardClaimed: { type: Boolean, default: false }
            }
        },
        
        // Récompenses gagnées grâce à ce filleul
        rewardsEarned: {
            totalXP: { type: Number, default: 0 },
            totalPi: { type: Number, default: 0 },
            breakdown: [{
                type: { 
                    type: String, 
                    enum: ['signup', 'first_course', 'level_5', 'level_10', 'pi_wallet_link', 'bonus'] 
                },
                amount: Number,
                currency: { type: String, enum: ['XP', 'PI'] },
                date: { type: Date, default: Date.now }
            }]
        },
        
        // Métadonnées pour anti-fraude
        metadata: {
            ipAddress: String,
            userAgent: String,
            deviceFingerprint: String,
            validatedKYC: { type: Boolean, default: false }
        },
        
        // Pi Network Integration - NOUVEAU
        piNetworkStatus: {
            hasPiWallet: { type: Boolean, default: false },
            walletLinkedDate: Date,
            piUsername: String,
            isActiveOnPi: { type: Boolean, default: false }
        }
    }],
    
    // Statistiques globales du parrain
    stats: {
        totalReferrals: { type: Number, default: 0 },
        activeReferrals: { type: Number, default: 0 },
        pendingReferrals: { type: Number, default: 0 },
        piNetworkReferrals: { type: Number, default: 0 }, // NOUVEAU: Filleuls avec Pi Wallet
        
        totalEarnings: {
            xp: { type: Number, default: 0 },
            pi: { type: Number, default: 0 },
            piEcosystemBonus: { type: Number, default: 0 } // NOUVEAU: Bonus Pi Ecosystem
        },
        
        // Paliers collectifs débloqués
        milestones: {
            tier5: { unlocked: { type: Boolean, default: false }, date: Date },
            tier10: { unlocked: { type: Boolean, default: false }, date: Date },
            tier25: { unlocked: { type: Boolean, default: false }, date: Date },
            tier50: { unlocked: { type: Boolean, default: false }, date: Date }
        }
    },
    
    // Récompenses en attente de réclamation
    pendingRewards: {
        xp: { type: Number, default: 0 },
        pi: { type: Number, default: 0 },
        badges: [String],
        piEcosystemBonus: { type: Number, default: 0 } // NOUVEAU: Bonus pour promouvoir Pi
    },
    
    // Pi Network Requirements - NOUVEAU
    piNetworkRequirements: {
        requiresWalletToRefer: { type: Boolean, default: true }, // Seuls les utilisateurs Pi peuvent parrainer
        minimumPiWalletReferrals: { type: Number, default: 5 }, // Min 5 filleuls avec wallet Pi pour tier 10+
        piEcosystemMultiplier: { type: Number, default: 2 } // 2x récompenses si filleul a Pi Wallet
    },
    
    // Anti-fraude
    fraudDetection: {
        suspicionLevel: { 
            type: String, 
            enum: ['none', 'low', 'medium', 'high', 'confirmed'],
            default: 'none'
        },
        flags: [{
            type: { type: String },
            reason: String,
            date: { type: Date, default: Date.now }
        }],
        lastReview: Date,
        reviewedBy: String
    },
    
    // Métadonnées
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes pour performance
referralSchema.index({ 'referrals.userId': 1 });
referralSchema.index({ 'stats.totalReferrals': -1 });
referralSchema.index({ createdAt: -1 });
referralSchema.index({ 'fraudDetection.suspicionLevel': 1 });

// Méthode: Ajouter un nouveau filleul
referralSchema.methods.addReferral = async function(userId, metadata = {}) {
    // Vérifier si le filleul existe déjà
    const existingReferral = this.referrals.find(r => r.userId.toString() === userId.toString());
    if (existingReferral) {
        throw new Error('Ce utilisateur est déjà parrainé par ce parrain');
    }
    
    // Ajouter le filleul
    this.referrals.push({
        userId,
        status: 'pending',
        metadata: {
            ipAddress: metadata.ipAddress,
            userAgent: metadata.userAgent,
            deviceFingerprint: metadata.deviceFingerprint,
            validatedKYC: false
        },
        rewardsEarned: {
            totalXP: 0,
            totalPi: 0,
            breakdown: []
        }
    });
    
    this.stats.totalReferrals += 1;
    this.stats.pendingReferrals += 1;
    
    await this.save();
    return this;
};

// Méthode: Attribuer une récompense de parrainage
referralSchema.methods.awardReferralReward = async function(userId, rewardType, amount, currency = 'XP') {
    const referral = this.referrals.find(r => r.userId.toString() === userId.toString());
    if (!referral) {
        throw new Error('Filleul non trouvé');
    }
    
    // 🔥 BONUS PI NETWORK - Multiplicateur 2x si le filleul a un Pi Wallet
    let finalAmount = amount;
    let appliedBonus = false;
    
    if (referral.piNetworkStatus && referral.piNetworkStatus.hasPiWallet) {
        const multiplier = this.piNetworkRequirements.piEcosystemMultiplier || 2;
        finalAmount = amount * multiplier;
        appliedBonus = true;
    }
    
    // Ajouter la récompense au breakdown
    referral.rewardsEarned.breakdown.push({
        type: rewardType,
        amount: finalAmount,
        currency,
        date: new Date(),
        piBonus: appliedBonus
    });
    
    // Mettre à jour les totaux
    if (currency === 'XP') {
        referral.rewardsEarned.totalXP += finalAmount;
        this.stats.totalEarnings.xp += finalAmount;
        this.pendingRewards.xp += finalAmount;
    } else if (currency === 'PI') {
        referral.rewardsEarned.totalPi += finalAmount;
        this.stats.totalEarnings.pi += finalAmount;
        this.pendingRewards.pi += finalAmount;
        
        // Tracker le bonus Pi Ecosystem si applicable
        if (appliedBonus) {
            const bonusAmount = finalAmount - amount; // Différence = bonus
            this.stats.totalEarnings.piEcosystemBonus += bonusAmount;
            this.pendingRewards.piEcosystemBonus += bonusAmount;
        }
    }
    
    await this.save();
    return { 
        success: true, 
        amount: finalAmount, 
        bonus: appliedBonus ? '2x Pi Network Bonus' : null 
    };
};

// Méthode: Marquer un milestone comme complété
referralSchema.methods.completeMilestone = async function(userId, milestone) {
    const referral = this.referrals.find(r => r.userId.toString() === userId.toString());
    if (!referral) {
        throw new Error('Filleul non trouvé');
    }
    
    if (referral.milestones[milestone]) {
        referral.milestones[milestone].completed = true;
        referral.milestones[milestone].date = new Date();
        await this.save();
    }
    
    return this;
};

// Méthode: Activer un filleul
referralSchema.methods.activateReferral = async function(userId) {
    const referral = this.referrals.find(r => r.userId.toString() === userId.toString());
    if (!referral) {
        throw new Error('Filleul non trouvé');
    }
    
    if (referral.status === 'pending') {
        referral.status = 'active';
        this.stats.pendingReferrals -= 1;
        this.stats.activeReferrals += 1;
        await this.save();
    }
    
    return this;
};

// 🆕 MÉTHODE SPÉCIALE PI NETWORK
// Méthode: Tracker la connexion d'un Pi Wallet par un filleul
referralSchema.methods.linkPiWallet = async function(userId, piWalletData) {
    const referral = this.referrals.find(r => r.userId.toString() === userId.toString());
    if (!referral) {
        throw new Error('Filleul non trouvé');
    }
    
    // Si le wallet est déjà lié, ne pas re-récompenser
    if (referral.piNetworkStatus.hasPiWallet) {
        return this;
    }
    
    // Mettre à jour le statut Pi Network
    referral.piNetworkStatus.hasPiWallet = true;
    referral.piNetworkStatus.walletLinkedDate = new Date();
    referral.piNetworkStatus.piUsername = piWalletData.piUsername;
    referral.piNetworkStatus.isActiveOnPi = true;
    
    // **BONUS PI ECOSYSTEM** - Récompense pour avoir rejoint Pi Network
    const piEcosystemBonus = 0.002; // 0.002π bonus (environ $1.10 USD)
    const xpBonus = 200; // 200 XP bonus
    
    // Ajouter le bonus au tracking
    referral.rewardsEarned.breakdown.push({
        type: 'pi_wallet_link',
        amount: piEcosystemBonus,
        currency: 'PI',
        date: new Date()
    });
    
    referral.rewardsEarned.breakdown.push({
        type: 'pi_wallet_link',
        amount: xpBonus,
        currency: 'XP',
        date: new Date()
    });
    
    // Mettre à jour les totaux
    referral.rewardsEarned.totalPi += piEcosystemBonus;
    referral.rewardsEarned.totalXP += xpBonus;
    
    // Mettre à jour les stats du parrain
    this.stats.totalEarnings.pi += piEcosystemBonus;
    this.stats.totalEarnings.xp += xpBonus;
    this.stats.totalEarnings.piEcosystemBonus += piEcosystemBonus;
    this.stats.piNetworkReferrals += 1;
    
    // Ajouter aux récompenses en attente
    this.pendingRewards.pi += piEcosystemBonus;
    this.pendingRewards.xp += xpBonus;
    this.pendingRewards.piEcosystemBonus += piEcosystemBonus;
    
    // Marquer le milestone piWalletLinked
    if (referral.milestones.piWalletLinked) {
        referral.milestones.piWalletLinked.completed = true;
        referral.milestones.piWalletLinked.date = new Date();
    }
    
    await this.save();
    
    return {
        success: true,
        message: '🎉 Bonus Pi Network débloqué !',
        rewards: {
            pi: piEcosystemBonus,
            xp: xpBonus
        }
    };
};

// Méthode: Réclamer les récompenses en attente
referralSchema.methods.claimPendingRewards = async function() {
    const rewards = {
        xp: this.pendingRewards.xp,
        pi: this.pendingRewards.pi,
        badges: [...this.pendingRewards.badges]
    };
    
    // Réinitialiser les récompenses en attente
    this.pendingRewards.xp = 0;
    this.pendingRewards.pi = 0;
    this.pendingRewards.badges = [];
    
    await this.save();
    return rewards;
};

// Méthode: Vérifier et débloquer les paliers collectifs
referralSchema.methods.checkAndUnlockTiers = async function() {
    const active = this.stats.activeReferrals;
    const unlockedTiers = [];
    
    // Tier 5
    if (active >= 5 && !this.stats.milestones.tier5.unlocked) {
        this.stats.milestones.tier5.unlocked = true;
        this.stats.milestones.tier5.date = new Date();
        this.pendingRewards.xp += 500;
        this.pendingRewards.pi += 0.001;
        unlockedTiers.push('tier5');
    }
    
    // Tier 10
    if (active >= 10 && !this.stats.milestones.tier10.unlocked) {
        this.stats.milestones.tier10.unlocked = true;
        this.stats.milestones.tier10.date = new Date();
        this.pendingRewards.xp += 1500;
        this.pendingRewards.pi += 0.005;
        this.pendingRewards.badges.push('referral_master');
        unlockedTiers.push('tier10');
    }
    
    // Tier 25
    if (active >= 25 && !this.stats.milestones.tier25.unlocked) {
        this.stats.milestones.tier25.unlocked = true;
        this.stats.milestones.tier25.date = new Date();
        this.pendingRewards.badges.push('premium_free_month');
        unlockedTiers.push('tier25');
    }
    
    // Tier 50
    if (active >= 50 && !this.stats.milestones.tier50.unlocked) {
        this.stats.milestones.tier50.unlocked = true;
        this.stats.milestones.tier50.date = new Date();
        this.pendingRewards.badges.push('referral_legend');
        unlockedTiers.push('tier50');
    }
    
    if (unlockedTiers.length > 0) {
        await this.save();
    }
    
    return unlockedTiers;
};

// Static: Générer un code de parrainage unique
referralSchema.statics.generateUniqueCode = async function() {
    let code;
    let exists = true;
    
    while (exists) {
        // Générer un code au format PIAA8F3D2
        code = 'PIA' + Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Vérifier si le code existe déjà
        const existing = await this.findOne({ referralCode: code });
        exists = !!existing;
    }
    
    return code;
};

// Static: Trouver par code de parrainage
referralSchema.statics.findByCode = function(code) {
    return this.findOne({ referralCode: code.toUpperCase() });
};

// Static: Top parrains (leaderboard)
referralSchema.statics.getTopReferrers = function(limit = 10) {
    return this.find({ 'fraudDetection.suspicionLevel': { $in: ['none', 'low'] } })
        .sort({ 'stats.activeReferrals': -1 })
        .limit(limit)
        .populate('referrerId', 'username avatar level');
};

module.exports = mongoose.model('Referral', referralSchema);
