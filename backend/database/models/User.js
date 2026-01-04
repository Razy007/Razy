const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schéma utilisateur avec validation et sécurité
 */
const userSchema = new mongoose.Schema({
    // === IDENTITÉ ===
    uid: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        index: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        sparse: true,
        index: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    
    // === PI MIGRATION & ECOSYSTEM ===
    piWalletAddress: {
        type: String,
        trim: true,
        sparse: true,
        index: true
    },
    piUsername: {
        type: String,
        trim: true,
        sparse: true,
        index: true
    },
    
    // === AUTHENTIFICATION ===
    authStatus: {
        type: String,
        enum: ['guest', 'authenticated', 'verified'],
        default: 'guest',
        index: true
    },
    kycStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none',
        index: true
    },
    kycSubmittedAt: Date,
    kycApprovedAt: Date,
    
    // === PROFIL ===
    avatar: {
        type: String,
        default: '🎓'
    },
    level: {
        type: Number,
        default: 1,
        min: 1,
        max: 100
    },
    xp: {
        type: Number,
        default: 0,
        min: 0
    },
    streak: {
        type: Number,
        default: 0,
        min: 0
    },
    lastLoginDate: Date,
    
    // === FINANCES ===
    piBalance: {
        type: Number,
        default: 0,
        min: 0
    },
    stakingBalance: {
        type: Number,
        default: 0,
        min: 0
    },
    totalEarned: {
        type: Number,
        default: 0,
        min: 0
    },
    
    // === PROGRESSION ===
    coursesCompleted: {
        type: Number,
        default: 0,
        min: 0
    },
    quizzesPassed: {
        type: Number,
        default: 0,
        min: 0
    },
    achievements: [{
        id: String,
        name: String,
        unlockedAt: Date
    }],
    
    // === RESTRICTIONS ===
    isGuest: {
        type: Boolean,
        default: true
    },
    restrictions: {
        canStake: {
            type: Boolean,
            default: false
        },
        canWithdraw: {
            type: Boolean,
            default: false
        },
        canTrade: {
            type: Boolean,
            default: false
        },
        maxQuizAttempts: {
            type: Number,
            default: 3
        }
    },
    
    // === SOCIAL ===
    followers: {
        type: Number,
        default: 0,
        min: 0
    },
    following: {
        type: Number,
        default: 0,
        min: 0
    },
    totalLikes: {
        type: Number,
        default: 0,
        min: 0
    },
    
    // === PARRAINAGE ===
    referral: {
        referredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
        },
        referralCode: {
            type: String,
            index: true
        },
        signupDate: Date
    },
    badges: {
        type: [String],
        default: []
    },
    
    // === SÉCURITÉ ===
    lastPasswordChange: Date,
    loginAttempts: {
        type: Number,
        default: 0,
        min: 0
    },
    lockedUntil: Date,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    
    // === METADATA ===
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'users'
});

// === INDEXES COMPOSÉS ===
userSchema.index({ authStatus: 1, kycStatus: 1 });
userSchema.index({ level: -1, xp: -1 });
userSchema.index({ createdAt: -1 });

// === MÉTHODES D'INSTANCE ===

/**
 * Vérifier si l'utilisateur peut effectuer une action
 */
userSchema.methods.canPerformAction = function(action) {
    if (this.isGuest) {
        const guestAllowedActions = ['viewCourse', 'takeQuiz', 'viewLeaderboard'];
        return guestAllowedActions.includes(action);
    }
    
    if (this.kycStatus !== 'approved') {
        const nonKycActions = ['viewCourse', 'takeQuiz', 'viewLeaderboard', 'viewShop'];
        return nonKycActions.includes(action);
    }
    
    return true;
};

/**
 * Calculer le niveau basé sur XP
 */
userSchema.methods.calculateLevel = function() {
    // 1000 XP par niveau
    return Math.floor(this.xp / 1000) + 1;
};

/**
 * Ajouter de l'XP et mettre à jour le niveau
 */
userSchema.methods.addXP = async function(amount) {
    this.xp += amount;
    const newLevel = this.calculateLevel();
    
    if (newLevel > this.level) {
        this.level = newLevel;
        // Récompense de niveau
        this.piBalance += newLevel * 10;
        return { levelUp: true, newLevel, reward: newLevel * 10 };
    }
    
    await this.save();
    return { levelUp: false };
};

/**
 * Mettre à jour le streak
 */
userSchema.methods.updateStreak = function() {
    const now = new Date();
    const lastLogin = this.lastLoginDate;
    
    if (!lastLogin) {
        this.streak = 1;
    } else {
        const diffDays = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            this.streak += 1;
        } else if (diffDays > 1) {
            this.streak = 1;
        }
    }
    
    this.lastLoginDate = now;
    this.lastActivity = now;
};

/**
 * Vérifier si le compte est verrouillé
 */
userSchema.methods.isLocked = function() {
    return !!(this.lockedUntil && this.lockedUntil > Date.now());
};

// === MÉTHODES STATIQUES ===

/**
 * Trouver par UID avec cache
 */
userSchema.statics.findByUid = function(uid) {
    return this.findOne({ uid });
};

/**
 * Créer utilisateur invité
 */
userSchema.statics.createGuest = async function(uid) {
    const user = new this({
        uid,
        username: `Guest_${uid.substring(0, 8)}`,
        authStatus: 'guest',
        isGuest: true,
        restrictions: {
            canStake: false,
            canWithdraw: false,
            canTrade: false,
            maxQuizAttempts: 3
        }
    });
    
    await user.save();
    return user;
};

/**
 * Promouvoir invité en utilisateur authentifié
 */
userSchema.statics.promoteGuest = async function(uid, userData) {
    return this.findOneAndUpdate(
        { uid },
        {
            $set: {
                username: userData.username,
                email: userData.email,
                authStatus: 'authenticated',
                isGuest: false,
                'restrictions.maxQuizAttempts': 10,
                updatedAt: new Date()
            }
        },
        { new: true }
    );
};

// === MIDDLEWARE ===

// Avant sauvegarde
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    
    // Mettre à jour le niveau automatiquement
    this.level = this.calculateLevel();
    
    next();
});

// Après recherche
userSchema.post('findOne', function(doc) {
    if (doc) {
        doc.lastActivity = new Date();
    }
});

// === VIRTUALS ===

userSchema.virtual('totalBalance').get(function() {
    return this.piBalance + this.stakingBalance;
});

userSchema.virtual('canStake').get(function() {
    return !this.isGuest && this.kycStatus === 'approved' && this.restrictions.canStake;
});

userSchema.virtual('canWithdraw').get(function() {
    return !this.isGuest && this.kycStatus === 'approved' && this.restrictions.canWithdraw;
});

// Activer virtuals dans JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
