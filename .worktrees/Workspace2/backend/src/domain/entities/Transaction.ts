import crypto from 'crypto';

export enum TransactionType {
  QUIZ_REWARD = 'quiz_reward',
  STAKING_REWARD = 'staking_reward',
  PURCHASE = 'purchase',
  WITHDRAWAL = 'withdrawal',
  ENERGY_PURCHASE = 'energy_purchase',
  REFERRAL_BONUS = 'referral_bonus'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly energyAmount: number,
    public status: TransactionStatus,
    public readonly description: string,
    public readonly metadata: Record<string, any>,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    userId: string;
    type: TransactionType;
    amount: number;
    energyAmount?: number;
    description: string;
    metadata?: Record<string, any>;
    status?: TransactionStatus;
  }): Transaction {
    const now = new Date();
    return new Transaction(
      crypto.randomUUID(),
      data.userId,
      data.type,
      data.amount,
      data.energyAmount || 0,
      data.status || TransactionStatus.PENDING,
      data.description,
      data.metadata || {},
      now,
      now
    );
  }
}
