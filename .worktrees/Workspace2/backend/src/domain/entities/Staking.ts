import crypto from 'crypto';

export enum StakingStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class Staking {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly period: number,
    public readonly apy: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public status: StakingStatus,
    public rewardEarned: number,
    public readonly exitFeePercent: number, // Added field
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    userId: string;
    amount: number;
    period: number;
    apy: number;
  }): Staking {
    const start = new Date();
    const end = new Date(start.getTime() + data.period * 24 * 60 * 60 * 1000);
    return new Staking(
      crypto.randomUUID(),
      data.userId,
      data.amount,
      data.period,
      data.apy,
      start,
      end,
      StakingStatus.ACTIVE,
      0,
      5.0, // Default 5% fee on creation
      start,
      start
    );
  }

  calculateReward(): number {
    const now = new Date();
    if (now < this.startDate || this.status !== StakingStatus.ACTIVE) {
      return this.rewardEarned;
    }
    const totalDuration = this.endDate.getTime() - this.startDate.getTime();
    const elapsed = Math.min(now.getTime() - this.startDate.getTime(), totalDuration);
    const elapsedRatio = elapsed / totalDuration;
    const totalReward = (this.amount * this.apy / 100 * this.period) / 365;
    return Math.floor(totalReward * elapsedRatio * 100) / 100;
  }
}
