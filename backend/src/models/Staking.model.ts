import mongoose, { Schema, Model, Document } from 'mongoose';
import { IStaking, StakingStatus } from '../types';

/**
 * Interface for Staking instance methods
 */
interface IStakingMethods {
    calculateReward(): number;
    isMatured(): boolean;
    complete(): Promise<number>;
    cancel(penaltyRate?: number): Promise<number>;
}

/**
 * Interface for Staking static methods
 */
interface IStakingModel extends Model<IStaking, {}, IStakingMethods> {
    getActiveStakes(userId: string): Promise<(Document<unknown, {}, IStaking> & IStaking & IStakingMethods)[]>;
    getTotalStaked(userId: string): Promise<number>;
    findMaturedStakes(): Promise<(Document<unknown, {}, IStaking> & IStaking & IStakingMethods)[]>;
    getApyForPeriod(period: number): number;
}

/**
 * Staking Schema
 * Represents a user's staking position with rewards calculation
 */
const stakingSchema = new Schema<IStaking, IStakingModel, IStakingMethods>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
            min: [1, 'Staking amount must be at least 1 Pi'],
        },
        period: {
            type: Number,
            required: true,
            enum: [30, 90, 180, 365], // Allowed staking periods in days
        },
        apy: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'cancelled'],
            default: 'active',
            required: true,
        },
        rewardEarned: {
            type: Number,
            default: 0,
            min: 0,
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
 * Indexes
 */
stakingSchema.index({ userId: 1, status: 1 });
stakingSchema.index({ endDate: 1, status: 1 }); // For finding matured stakes

/**
 * Instance Methods
 */

// Calculate current reward
stakingSchema.methods.calculateReward = function (): number {
    const now = new Date();
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    
    // If not yet started or already completed
    if (now < start || this.status !== 'active') {
        return this.rewardEarned;
    }
    
    // Calculate elapsed time
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = Math.min(now.getTime() - start.getTime(), totalDuration);
    const elapsedRatio = elapsed / totalDuration;
    
    // Calculate reward: (amount * APY * period) / 365 days
    const totalReward = (this.amount * this.apy / 100 * this.period) / 365;
    const currentReward = totalReward * elapsedRatio;
    
    return Math.floor(currentReward * 100) / 100; // Round to 2 decimals
};

// Check if staking period is complete
stakingSchema.methods.isMatured = function (): boolean {
    return new Date() >= new Date(this.endDate);
};

// Complete staking and return total (principal + reward)
stakingSchema.methods.complete = async function (): Promise<number> {
    if (this.status !== 'active') {
        throw new Error('Staking is not active');
    }
    
    if (!this.isMatured()) {
        throw new Error('Staking period not yet complete');
    }
    
    this.rewardEarned = this.calculateReward();
    this.status = 'completed';
    await this.save();
    
    return this.amount + this.rewardEarned;
};

// Cancel staking (with penalty)
stakingSchema.methods.cancel = async function (penaltyRate: number = 0.1): Promise<number> {
    if (this.status !== 'active') {
        throw new Error('Staking is not active');
    }
    
    this.status = 'cancelled';
    this.rewardEarned = 0; // No reward on cancellation
    await this.save();
    
    // Return principal minus penalty
    const penalty = this.amount * penaltyRate;
    return this.amount - penalty;
};

/**
 * Static Methods
 */

// Get user's active stakes
stakingSchema.statics.getActiveStakes = function (userId: string) {
    return this.find({ userId, status: 'active' }).sort({ createdAt: -1 });
};

// Get user's total staked amount
stakingSchema.statics.getTotalStaked = async function (userId: string): Promise<number> {
    const result = await this.aggregate([
        { $match: { userId, status: 'active' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    return result.length > 0 ? result[0].total : 0;
};

// Find matured stakes
stakingSchema.statics.findMaturedStakes = function () {
    return this.find({
        status: 'active',
        endDate: { $lte: new Date() },
    });
};

// Get APY for period
stakingSchema.statics.getApyForPeriod = function (period: number): number {
    const apyMap: Record<number, number> = {
        30: 5,    // 5% APY for 30 days
        90: 8,    // 8% APY for 90 days
        180: 12,  // 12% APY for 180 days
        365: 15,  // 15% APY for 365 days
    };
    
    return apyMap[period] || 0;
};

/**
 * Pre-save hooks
 */
stakingSchema.pre('save', function (next) {
    // Auto-calculate end date if not set
    if (this.isNew && !this.endDate) {
        const start = new Date(this.startDate);
        this.endDate = new Date(start.getTime() + this.period * 24 * 60 * 60 * 1000);
    }
    
    // Auto-set APY based on period if not set
    if (this.isNew && !this.apy) {
        this.apy = (this.constructor as any).getApyForPeriod(this.period);
    }
    
    next();
});

/**
 * Export Staking Model
 */
export const Staking = mongoose.model<IStaking, IStakingModel>('Staking', stakingSchema);

export default Staking;
