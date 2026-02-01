import { IStakingRequest } from '../types';
import { ValidationError, NotFoundError } from '../types';
import User from '../models/User.model';
import Staking from '../models/Staking.model';
import Transaction from '../models/Transaction.model';

/**
 * ============================================================================
 * STAKING SERVICE
 * ============================================================================
 */

/**
 * Create new staking position
 * CRITICAL: Server-side validation prevents client manipulation
 */
export const createStake = async (
    userId: string,
    stakingRequest: IStakingRequest
): Promise<any> => {
    const { amount, period } = stakingRequest;
    
    // Validate amount
    if (amount <= 0) {
        throw new ValidationError('Staking amount must be positive', 'INVALID_AMOUNT');
    }
    
    if (amount < 1) {
        throw new ValidationError(
            'Minimum staking amount is 1 Pi',
            'AMOUNT_TOO_LOW'
        );
    }
    
    // Validate period
    const validPeriods = [30, 90, 180, 365];
    if (!validPeriods.includes(period)) {
        throw new ValidationError(
            `Invalid staking period. Must be one of: ${validPeriods.join(', ')} days`,
            'INVALID_PERIOD'
        );
    }
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }
    
    // Check if user has sufficient balance
    if (user.piBalance < amount) {
        throw new ValidationError(
            `Insufficient balance. Available: ${user.piBalance} Pi`,
            'INSUFFICIENT_BALANCE'
        );
    }
    
    // Deduct amount from user balance
    await user.deductPiBalance(amount);
    
    // Get APY for period
    const apy = Staking.getApyForPeriod(period);
    
    // Create staking record
    const staking = new Staking({
        userId: user._id.toString(),
        amount,
        period,
        apy,
        status: 'active',
    });
    
    await staking.save();
    
    // Update user's staking balance
    user.stakingBalance += amount;
    await user.save();
    
    // Create transaction record
    await Transaction.createTransaction({
        userId: user._id.toString(),
        type: 'purchase',
        amount: -amount,
        description: `Staked ${amount} Pi for ${period} days at ${apy}% APY`,
        metadata: {
            stakingId: staking._id.toString(),
            period,
            apy,
        },
        status: 'completed',
    });
    
    console.log(`✅ Stake created: ${amount} Pi for ${period} days (User: ${user.username})`);
    
    return {
        staking: staking.toJSON(),
        currentReward: staking.calculateReward(),
        user: {
            piBalance: user.piBalance,
            stakingBalance: user.stakingBalance,
        },
    };
};

/**
 * Get user's active stakes
 */
export const getUserStakes = async (userId: string): Promise<any[]> => {
    const stakes = await Staking.getActiveStakes(userId);
    
    return stakes.map((stake) => ({
        ...stake.toJSON(),
        currentReward: stake.calculateReward(),
        isMatured: stake.isMatured(),
    }));
};

/**
 * Get total staked amount for user
 */
export const getTotalStaked = async (userId: string): Promise<number> => {
    return await Staking.getTotalStaked(userId);
};

/**
 * Complete matured staking
 */
export const completeStake = async (userId: string, stakingId: string): Promise<any> => {
    const staking = await Staking.findById(stakingId);
    
    if (!staking) {
        throw new NotFoundError('Staking not found', 'STAKING_NOT_FOUND');
    }
    
    // Verify ownership
    if (staking.userId !== userId) {
        throw new ValidationError('Unauthorized access to staking', 'UNAUTHORIZED');
    }
    
    // Check if matured
    if (!staking.isMatured()) {
        throw new ValidationError(
            'Staking period not yet complete',
            'NOT_MATURED'
        );
    }
    
    // Complete staking
    const totalReturn = await staking.complete();
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }
    
    // Return principal + reward to user
    await user.addPiBalance(totalReturn);
    
    // Update staking balance
    user.stakingBalance -= staking.amount;
    await user.save();
    
    // Create transaction record
    await Transaction.createTransaction({
        userId: user._id.toString(),
        type: 'staking_reward',
        amount: totalReturn,
        description: `Staking completed: ${staking.amount} Pi + ${staking.rewardEarned} Pi reward`,
        metadata: {
            stakingId: staking._id.toString(),
            principal: staking.amount,
            reward: staking.rewardEarned,
        },
        status: 'completed',
    });
    
    console.log(
        `✅ Stake completed: ${staking.amount} Pi + ${staking.rewardEarned} Pi reward (User: ${user.username})`
    );
    
    return {
        principal: staking.amount,
        reward: staking.rewardEarned,
        total: totalReturn,
        user: {
            piBalance: user.piBalance,
            stakingBalance: user.stakingBalance,
        },
    };
};

/**
 * Cancel active staking (with penalty)
 */
export const cancelStake = async (userId: string, stakingId: string): Promise<any> => {
    const staking = await Staking.findById(stakingId);
    
    if (!staking) {
        throw new NotFoundError('Staking not found', 'STAKING_NOT_FOUND');
    }
    
    // Verify ownership
    if (staking.userId !== userId) {
        throw new ValidationError('Unauthorized access to staking', 'UNAUTHORIZED');
    }
    
    // Cancel with 10% penalty
    const penaltyRate = 0.1;
    const returnAmount = await staking.cancel(penaltyRate);
    const penalty = staking.amount * penaltyRate;
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }
    
    // Return amount minus penalty
    await user.addPiBalance(returnAmount);
    
    // Update staking balance
    user.stakingBalance -= staking.amount;
    await user.save();
    
    // Create transaction record
    await Transaction.createTransaction({
        userId: user._id.toString(),
        type: 'purchase',
        amount: returnAmount,
        description: `Staking cancelled: ${returnAmount} Pi returned (${penalty} Pi penalty)`,
        metadata: {
            stakingId: staking._id.toString(),
            principal: staking.amount,
            penalty,
        },
        status: 'completed',
    });
    
    console.log(
        `⚠️  Stake cancelled: ${returnAmount} Pi returned with ${penalty} Pi penalty (User: ${user.username})`
    );
    
    return {
        principal: staking.amount,
        penalty,
        returned: returnAmount,
        user: {
            piBalance: user.piBalance,
            stakingBalance: user.stakingBalance,
        },
    };
};

/**
 * Get staking statistics
 */
export const getStakingStats = async (userId: string): Promise<any> => {
    const activeStakes = await Staking.getActiveStakes(userId);
    const totalStaked = await Staking.getTotalStaked(userId);
    
    let totalCurrentReward = 0;
    activeStakes.forEach((stake) => {
        totalCurrentReward += stake.calculateReward();
    });
    
    return {
        totalStaked,
        totalCurrentReward,
        activeStakesCount: activeStakes.length,
        stakes: activeStakes.map((stake) => ({
            id: stake._id,
            amount: stake.amount,
            period: stake.period,
            apy: stake.apy,
            currentReward: stake.calculateReward(),
            isMatured: stake.isMatured(),
            startDate: stake.startDate,
            endDate: stake.endDate,
        })),
    };
};

/**
 * ============================================================================
 * EXPORT STAKING SERVICE
 * ============================================================================
 */

export default {
    createStake,
    getUserStakes,
    getTotalStaked,
    completeStake,
    cancelStake,
    getStakingStats,
};
