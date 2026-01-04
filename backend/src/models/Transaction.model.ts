import mongoose, { Schema, Model, Document } from 'mongoose';
import { ITransaction, TransactionType, TransactionStatus } from '../types';

/**
 * Interface for Transaction instance methods
 */
interface ITransactionMethods {
    markCompleted(): Promise<void>;
    markFailed(reason?: string): Promise<void>;
    cancel(reason?: string): Promise<void>;
}

/**
 * Interface for Transaction static methods
 */
interface ITransactionModel extends Model<ITransaction, {}, ITransactionMethods> {
    getUserTransactions(userId: string, limit?: number, skip?: number): Promise<(Document<unknown, {}, ITransaction> & ITransaction & ITransactionMethods)[]>;
    getTotalEarnings(userId: string): Promise<number>;
    getTotalSpending(userId: string): Promise<number>;
    createTransaction(data: {
        userId: string;
        type: TransactionType;
        amount: number;
        energyAmount?: number;
        description: string;
        metadata?: Record<string, any>;
        status?: TransactionStatus;
    }): Promise<ITransaction>;
}

/**
 * Transaction Schema
 * Records all financial transactions in the system
 */
const transactionSchema = new Schema<ITransaction, ITransactionModel, ITransactionMethods>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: [
                'quiz_reward',
                'staking_reward',
                'purchase',
                'withdrawal',
                'energy_purchase',
                'referral_bonus',
            ],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        energyAmount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'cancelled'],
            default: 'pending',
            required: true,
        },
        description: {
            type: String,
            required: true,
            maxlength: 500,
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
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
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ status: 1, createdAt: -1 });

/**
 * Instance Methods
 */

// Mark transaction as completed
transactionSchema.methods.markCompleted = async function (): Promise<void> {
    this.status = 'completed';
    await this.save();
};

// Mark transaction as failed
transactionSchema.methods.markFailed = async function (reason?: string): Promise<void> {
    this.status = 'failed';
    if (reason) {
        this.metadata = { ...this.metadata, failureReason: reason };
    }
    await this.save();
};

// Cancel transaction
transactionSchema.methods.cancel = async function (reason?: string): Promise<void> {
    if (this.status === 'completed') {
        throw new Error('Cannot cancel completed transaction');
    }
    
    this.status = 'cancelled';
    if (reason) {
        this.metadata = { ...this.metadata, cancellationReason: reason };
    }
    await this.save();
};

/**
 * Static Methods
 */

// Get user's transaction history
transactionSchema.statics.getUserTransactions = function (
    userId: string,
    limit: number = 50,
    skip: number = 0
) {
    return this.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
};

// Get user's total earnings
transactionSchema.statics.getTotalEarnings = async function (userId: string): Promise<number> {
    const result = await this.aggregate([
        {
            $match: {
                userId,
                status: 'completed',
                amount: { $gt: 0 },
                type: { $in: ['quiz_reward', 'staking_reward', 'referral_bonus'] },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' },
            },
        },
    ]);
    
    return result.length > 0 ? result[0].total : 0;
};

// Get user's total spending
transactionSchema.statics.getTotalSpending = async function (userId: string): Promise<number> {
    const result = await this.aggregate([
        {
            $match: {
                userId,
                status: 'completed',
                type: { $in: ['purchase', 'withdrawal', 'energy_purchase'] },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: { $abs: '$amount' } },
            },
        },
    ]);
    
    return result.length > 0 ? result[0].total : 0;
};

// Create transaction record
transactionSchema.statics.createTransaction = async function (data: {
    userId: string;
    type: TransactionType;
    amount: number;
    energyAmount?: number;
    description: string;
    metadata?: Record<string, any>;
    status?: TransactionStatus;
}): Promise<ITransaction> {
    const transaction = new this({
        userId: data.userId,
        type: data.type,
        amount: data.amount,
        energyAmount: data.energyAmount || 0,
        description: data.description,
        metadata: data.metadata || {},
        status: data.status || 'pending',
    });
    
    await transaction.save();
    return transaction;
};

/**
 * Export Transaction Model
 */
export const Transaction = mongoose.model<ITransaction, ITransactionModel>(
    'Transaction',
    transactionSchema
);

export default Transaction;
