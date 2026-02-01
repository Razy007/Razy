const mongoose = require('mongoose');

/**
 * Schéma Staking - Gestion du staking de PI
 */
const stakingSchema = new mongoose.Schema({
    // === RÉFÉRENCE ===
    userId: {
        type: String,
        required: true,
        index: true,
        ref: 'User'
    },
    
    // === MONTANT & PÉRIODE ===
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    period: {
        type: Number,
        required: true,
        enum: [30, 60, 90], // jours
        index: true
    },
    
    // === APR (Annual Percentage Rate) ===
    apr: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    
    // === DATES ===
    startDate: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    },
    endDate: Date,
    maturityDate: {
        type: Date,
        required: true
    },
    
    // === STATUT ===
    active: {
        type: Boolean,
        default: true,
        index: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'withdrawn_early', 'cancelled'],
        default: 'active',
        index: true
    },
    
    // === RÉCOMPENSES ===
    accruedRewards: {
        type: Number,
        default: 0,
        min: 0
    },
    paidRewards: {
        type: Number,
        default: 0,
        min: 0
    },
    lastRewardCalculation: {
        type: Date,
        default: Date.now
    },
    
    // === PÉNALITÉS ===
    earlyWithdrawal: {
        type: Boolean,
        default: false
    },
    penaltyAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    
    // === MÉTADATA ===
    autoRenew: {
        type: Boolean,
        default: false
    },
    compoundRewards: {
        type: Boolean,
        default: false
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'staking'
});

// === INDEXES COMPOSÉS ===
stakingSchema.index({ userId: 1, active: 1 });
stakingSchema.index({ status: 1, maturityDate: 1 });

// === VIRTUALS ===

stakingSchema.virtual('daysElapsed').get(function() {
    const now = new Date();
    const elapsed = now - this.startDate;
    return Math.floor(elapsed / (1000 * 60 * 60 * 24));
});

stakingSchema.virtual('daysRemaining').get(function() {
    const now = new Date();
    const remaining = this.maturityDate - now;
    return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
});

stakingSchema.virtual('isMatured').get(function() {
    return new Date() >= this.maturityDate;
});

stakingSchema.virtual('progressPercent').get(function() {
    return Math.min(100, (this.daysElapsed / this.period) * 100);
});

// === MÉTHODES D'INSTANCE ===

/**
 * Calculer les récompenses actuelles
 */
stakingSchema.methods.calculateCurrentRewards = function() {
    if (!this.active) return this.accruedRewards;
    
    const now = new Date();
    const elapsed = now - this.startDate;
    const daysElapsed = elapsed / (1000 * 60 * 60 * 24);
    
    // Récompenses = (Montant * APR * Jours) / 365
    const rewards = (this.amount * this.apr * daysElapsed) / 365;
    
    return Math.max(0, rewards);
};

/**
 * Mettre à jour les récompenses accumulées
 */
stakingSchema.methods.updateRewards = async function() {
    this.accruedRewards = this.calculateCurrentRewards();
    this.lastRewardCalculation = new Date();
    await this.save();
    return this.accruedRewards;
};

/**
 * Terminer le staking (retrait)
 */
stakingSchema.methods.withdraw = async function() {
    const now = new Date();
    const finalRewards = this.calculateCurrentRewards();
    let penalty = 0;
    
    // Pénalité si retrait avant maturité (20%)
    if (!this.isMatured) {
        this.earlyWithdrawal = true;
        penalty = finalRewards * 0.2;
        this.penaltyAmount = penalty;
    }
    
    this.active = false;
    this.status = this.earlyWithdrawal ? 'withdrawn_early' : 'completed';
    this.endDate = now;
    this.accruedRewards = finalRewards - penalty;
    this.paidRewards = this.accruedRewards;
    
    await this.save();
    
    return {
        principal: this.amount,
        rewards: this.accruedRewards,
        penalty,
        total: this.amount + this.accruedRewards
    };
};

// === MÉTHODES STATIQUES ===

/**
 * Obtenir APR selon période
 */
stakingSchema.statics.getAPR = function(period) {
    const rates = {
        30: 0.05,  // 5% APR
        60: 0.08,  // 8% APR
        90: 0.12   // 12% APR
    };
    return rates[period] || 0.05;
};

/**
 * Créer un nouveau staking
 */
stakingSchema.statics.createStaking = async function(userId, amount, period) {
    const apr = this.getAPR(period);
    const startDate = new Date();
    const maturityDate = new Date(startDate);
    maturityDate.setDate(maturityDate.getDate() + period);
    
    return this.create({
        userId,
        amount,
        period,
        apr,
        startDate,
        maturityDate,
        active: true,
        status: 'active'
    });
};

/**
 * Obtenir staking actif d'un utilisateur
 */
stakingSchema.statics.getActiveStaking = function(userId) {
    return this.findOne({ userId, active: true });
};

/**
 * Obtenir tous les stakings d'un utilisateur
 */
stakingSchema.statics.getUserStakings = function(userId) {
    return this.find({ userId })
        .sort({ createdAt: -1 })
        .lean();
};

/**
 * Traiter les stakings matures (job automatique)
 */
stakingSchema.statics.processMaturedStakings = async function() {
    const matured = await this.find({
        active: true,
        status: 'active',
        maturityDate: { $lte: new Date() }
    });
    
    const results = [];
    for (const staking of matured) {
        await staking.updateRewards();
        results.push({
            userId: staking.userId,
            stakingId: staking._id,
            rewards: staking.accruedRewards
        });
    }
    
    return results;
};

// === MIDDLEWARE ===

stakingSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Activer virtuals
stakingSchema.set('toJSON', { virtuals: true });
stakingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Staking', stakingSchema);
