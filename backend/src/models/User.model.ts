import mongoose, { Schema, Model, Document } from 'mongoose';
import { IUser, UserRole, KycStatus } from '../types';

/**
 * Interface for User instance methods
 */
interface IUserMethods {
    isKycVerified(): boolean;
    isGuest(): boolean;
    addPiBalance(amount: number): Promise<void>;
    deductPiBalance(amount: number): Promise<void>;
    addEnergy(amount: number): Promise<void>;
    deductEnergy(amount: number): Promise<void>;
    addXp(amount: number): Promise<void>;
    updateStreak(): Promise<void>;
}

/**
 * Interface for User static methods
 */
interface IUserModel extends Model<IUser, {}, IUserMethods> {
    findByPiId(piId: string): Promise<(Document<unknown, {}, IUser> & IUser & IUserMethods) | null>;
    getLeaderboard(limit?: number): Promise<any[]>;
}

/**
 * User Schema
 * Represents a Pioneer Academy user with authentication and progress tracking
 */
const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
    {
        piId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true, // Allows null values but enforces uniqueness when present
        },
        role: {
            type: String,
            enum: ['guest', 'pioneer_non_kyc', 'pioneer_kyc'],
            default: 'guest',
            required: true,
        },
        kycStatus: {
            type: String,
            enum: ['none', 'pending', 'verified', 'rejected'],
            default: 'none',
            required: true,
        },
        piBalance: {
            type: Number,
            default: 0,
            min: 0,
        },
        energyBalance: {
            type: Number,
            default: 100,
            min: 0,
            max: 1000,
        },
        stakingBalance: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalEarned: {
            type: Number,
            default: 0,
            min: 0,
        },
        level: {
            type: Number,
            default: 1,
            min: 1,
        },
        xp: {
            type: Number,
            default: 0,
            min: 0,
        },
        streak: {
            type: Number,
            default: 0,
            min: 0,
        },
        lastLoginDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc: any, ret: any) => {
                ret.id = ret._id;
                return ret;
            },
        },
    }
);

/**
 * Indexes for performance
 */
userSchema.index({ piId: 1 });
userSchema.index({ role: 1, kycStatus: 1 });
userSchema.index({ level: -1, xp: -1 }); // For leaderboard

/**
 * Instance Methods
 */

// Check if user can perform KYC-required actions
userSchema.methods.isKycVerified = function (): boolean {
    return this.kycStatus === 'verified';
};

// Check if user is a guest
userSchema.methods.isGuest = function (): boolean {
    return this.role === 'guest';
};

// Add Pi balance
userSchema.methods.addPiBalance = async function (amount: number): Promise<void> {
    if (amount <= 0) {
        throw new Error('Amount must be positive');
    }
    this.piBalance += amount;
    this.totalEarned += amount;
    await this.save();
};

// Deduct Pi balance
userSchema.methods.deductPiBalance = async function (amount: number): Promise<void> {
    if (amount <= 0) {
        throw new Error('Amount must be positive');
    }
    if (this.piBalance < amount) {
        throw new Error('Insufficient balance');
    }
    this.piBalance -= amount;
    await this.save();
};

// Add energy
userSchema.methods.addEnergy = async function (amount: number): Promise<void> {
    if (amount <= 0) {
        throw new Error('Amount must be positive');
    }
    this.energyBalance = Math.min(this.energyBalance + amount, 1000);
    await this.save();
};

// Deduct energy
userSchema.methods.deductEnergy = async function (amount: number): Promise<void> {
    if (amount <= 0) {
        throw new Error('Amount must be positive');
    }
    if (this.energyBalance < amount) {
        throw new Error('Insufficient energy');
    }
    this.energyBalance -= amount;
    await this.save();
};

// Add XP and level up if needed
userSchema.methods.addXp = async function (amount: number): Promise<void> {
    if (amount <= 0) {
        throw new Error('Amount must be positive');
    }
    
    this.xp += amount;
    
    // Level up logic (100 XP per level)
    const xpPerLevel = 100;
    const newLevel = Math.floor(this.xp / xpPerLevel) + 1;
    
    if (newLevel > this.level) {
        this.level = newLevel;
        // Bonus: Restore energy on level up
        this.energyBalance = Math.min(this.energyBalance + 50, 1000);
    }
    
    await this.save();
};

// Update streak
userSchema.methods.updateStreak = async function (): Promise<void> {
    const now = new Date();
    const lastLogin = new Date(this.lastLoginDate);
    
    // Calculate days difference
    const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
        // Consecutive day - increment streak
        this.streak += 1;
    } else if (daysDiff > 1) {
        // Streak broken - reset
        this.streak = 1;
    }
    // If daysDiff === 0, same day - no change
    
    this.lastLoginDate = now;
    await this.save();
};

/**
 * Static Methods
 */

// Find user by Pi ID
userSchema.statics.findByPiId = function (piId: string) {
    return this.findOne({ piId });
};

// Get leaderboard
userSchema.statics.getLeaderboard = function (limit: number = 10) {
    return this.find()
        .sort({ level: -1, xp: -1 })
        .limit(limit)
        .select('username level xp totalEarned piId');
};

/**
 * Pre-save hooks
 */
userSchema.pre('save', function (next) {
    // Auto-update role based on KYC status
    if (this.kycStatus === 'verified') {
        this.role = 'pioneer_kyc';
    } else if (this.kycStatus === 'pending' || this.kycStatus === 'rejected') {
        this.role = 'pioneer_non_kyc';
    }
    
    next();
});

/**
 * Export User Model
 */
export const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
