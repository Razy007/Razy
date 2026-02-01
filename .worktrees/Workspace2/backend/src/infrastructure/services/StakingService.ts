import { StakingRepository } from '../repositories/StakingRepository';
import { UserRepository } from '../repositories/UserRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { Staking, StakingStatus } from '../../domain/entities/Staking';
import { Transaction, TransactionType, TransactionStatus } from '../../domain/entities/Transaction';

export class StakingService {
  constructor(
    private stakingRepository: StakingRepository,
    private userRepository: UserRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async createStake(userId: string, amount: number, period: number): Promise<Staking> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    if ((user.transferableBalance || 0) < amount) {
      throw new Error('Insufficient Transferable Balance (Real Pi)');
    }

    // Determine APY
    const apyMap: Record<number, number> = {
      7: 2,
      30: 8,
      90: 15,
      180: 20, // Adjusted for consistency
      365: 25, // Adjusted for consistency
    };
    const apy = apyMap[period] || 2;

    // Deduct balance from user (Real Pi)
    user.transferableBalance = (user.transferableBalance || 0) - amount;
    user.stakingBalance += amount;
    await this.userRepository.save(user);

    // Create staking record
    const staking = Staking.create({ userId, amount, period, apy });
    const savedStaking = await this.stakingRepository.save(staking);

    // Record transaction
    const transaction = Transaction.create({
      userId,
      type: TransactionType.PURCHASE, // Staking Lock
      amount: -amount,
      description: `Staking lock for ${period} days (Real Pi)`,
      status: TransactionStatus.COMPLETED
    });
    await this.transactionRepository.save(transaction);

    return savedStaking;
  }

  async claimStake(stakingId: string): Promise<number> {
    const staking = await this.stakingRepository.findById(stakingId);
    if (!staking || staking.status !== StakingStatus.ACTIVE) {
      throw new Error('Invalid or inactive stake');
    }

    if (new Date() < staking.endDate) {
      throw new Error('Staking period not yet completed');
    }

    const reward = staking.calculateReward();
    const grossReturn = staking.amount + reward;
    
    // Calculate Fee
    const feePercent = staking.exitFeePercent || 5.0;
    const feeAmount = (grossReturn * feePercent) / 100;
    const netReturn = grossReturn - feeAmount;

    const user = await this.userRepository.findById(staking.userId);
    if (!user) throw new Error('User not found');

    // Update user balance (Return to Real Pi)
    user.transferableBalance = (user.transferableBalance || 0) + netReturn;
    user.stakingBalance -= staking.amount;
    user.totalEarned += reward;
    await this.userRepository.save(user);

    // Update staking status
    staking.status = StakingStatus.COMPLETED;
    staking.rewardEarned = reward;
    await this.stakingRepository.save(staking);

    // Record transactions
    // 1. Principal Return
    await this.transactionRepository.save(Transaction.create({
        userId: user.id,
        type: TransactionType.STAKING_REWARD, // or generic deposit
        amount: staking.amount,
        description: `Staking Principal Return`,
        status: TransactionStatus.COMPLETED
    }));

    // 2. Reward
    if (reward > 0) {
        await this.transactionRepository.save(Transaction.create({
            userId: user.id,
            type: TransactionType.STAKING_REWARD,
            amount: reward,
            description: `Staking Yield (${staking.apy}% APY)`,
            status: TransactionStatus.COMPLETED
        }));
    }

    // 3. Fee
    if (feeAmount > 0) {
        await this.transactionRepository.save(Transaction.create({
            userId: user.id,
            type: TransactionType.PURCHASE, // Expense
            amount: -feeAmount,
            description: `Service Fee (${feePercent}%)`,
            status: TransactionStatus.COMPLETED
        }));
    }

    return netReturn;
  }
}
