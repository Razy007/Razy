const mongoose = require('mongoose');

/**
 * Schéma Transaction - Toutes les transactions financières
 */
const transactionSchema = new mongoose.Schema({
    // === RÉFÉRENCE ===
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        default: () => `TXN_${Date.now()}_${Math.random().toString(36).substring(7)}`
    },
    userId: {
        type: String,
        required: true,
        index: true,
        ref: 'User'
    },
    
    // === TYPE & DÉTAILS ===
    type: {
        type: String,
        required: true,
        enum: [
            'quiz_reward',
            'course_completion',
            'daily_bonus',
            'streak_bonus',
            'achievement',
            'staking_start',
            'staking_end',
            'staking_reward',
            'shop_purchase',
            'withdrawal',
            'deposit',
            'transfer',
            'refund',
            'penalty'
        ],
        index: true
    },
    
    // === MONTANT ===
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'PI',
        enum: ['PI', 'USD']
    },
    
    // === STATUT ===
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
        default: 'completed',
        index: true
    },
    
    // === CONTEXTE ===
    description: String,
    metadata: {
        courseId: String,
        quizId: String,
        itemId: String,
        stakingPeriod: Number,
        principal: Number,
        rewards: Number,
        referenceId: String
    },
    
    // === SOLDES (SNAPSHOT) ===
    balanceBefore: {
        type: Number,
        required: true
    },
    balanceAfter: {
        type: Number,
        required: true
    },
    
    // === PI NETWORK ===
    piPaymentId: String,
    piUserId: String,
    
    // === SÉCURITÉ ===
    ipAddress: String,
    userAgent: String,
    verified: {
        type: Boolean,
        default: true
    },
    
    // === TIMESTAMPS ===
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    processedAt: Date,
    completedAt: Date
}, {
    timestamps: true,
    collection: 'transactions'
});

// === INDEXES COMPOSÉS ===
transactionSchema.index({ userId: 1, timestamp: -1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ timestamp: -1, amount: -1 });

// === MÉTHODES STATIQUES ===

/**
 * Créer une transaction de récompense quiz
 */
transactionSchema.statics.createQuizReward = async function(userId, amount, quizId, balanceBefore) {
    return this.create({
        userId,
        type: 'quiz_reward',
        amount,
        balanceBefore,
        balanceAfter: balanceBefore + amount,
        status: 'completed',
        metadata: { quizId },
        description: `Récompense quiz: +${amount} PI`,
        completedAt: new Date()
    });
};

/**
 * Créer transaction de staking
 */
transactionSchema.statics.createStakingTransaction = async function(userId, type, data) {
    const { amount, period, principal, rewards, balanceBefore } = data;
    
    return this.create({
        userId,
        type,
        amount,
        balanceBefore,
        balanceAfter: type === 'staking_start' 
            ? balanceBefore - amount 
            : balanceBefore + amount,
        status: 'completed',
        metadata: { stakingPeriod: period, principal, rewards },
        description: type === 'staking_start'
            ? `Staking démarré: ${amount} PI pour ${period} jours`
            : `Staking terminé: ${principal} PI + ${rewards} PI de récompenses`,
        completedAt: new Date()
    });
};

/**
 * Obtenir l'historique d'un utilisateur
 */
transactionSchema.statics.getUserHistory = function(userId, limit = 50) {
    return this.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
};

/**
 * Statistiques de transactions
 */
transactionSchema.statics.getUserStats = async function(userId) {
    const stats = await this.aggregate([
        { $match: { userId, status: 'completed' } },
        {
            $group: {
                _id: null,
                totalTransactions: { $sum: 1 },
                totalEarned: {
                    $sum: {
                        $cond: [{ $gt: ['$amount', 0] }, '$amount', 0]
                    }
                },
                totalSpent: {
                    $sum: {
                        $cond: [{ $lt: ['$amount', 0] }, { $abs: '$amount' }, 0]
                    }
                },
                avgTransaction: { $avg: '$amount' }
            }
        }
    ]);
    
    return stats[0] || {
        totalTransactions: 0,
        totalEarned: 0,
        totalSpent: 0,
        avgTransaction: 0
    };
};

module.exports = mongoose.model('Transaction', transactionSchema);
