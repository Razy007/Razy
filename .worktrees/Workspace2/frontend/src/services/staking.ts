import { apiClient } from './apiClient';

export interface Stake {
    id: string;
    amount: number;
    period: number; // lock_period_days
    apy: number; // reward_rate
    startDate: string;
    endDate: string; // unlock_date
    currentReward: number;
    status: 'active' | 'completed' | 'cancelled';
}

export interface StakingResponse {
    success: boolean;
    activeStakes: Stake[];
}

export const stakingService = {
    /**
     * Create a new stake
     */
    createStake: async (amount: number, period: number) => {
        const response = await apiClient.post('/staking', { amount, period });
        return response.data;
    },

    /**
     * Get all active stakes for the current user
     */
    getMyStakes: async (): Promise<Stake[]> => {
        const response = await apiClient.get('/staking/my');
        // Backend returns { success: true, stakes: [...] }
        return response.data.stakes || [];
    },

    /**
     * Claim/Withdraw a finished stake
     */
    claimStake: async (stakingId: string) => {
        const response = await apiClient.post(`/staking/claim/${stakingId}`);
        return response.data;
    }
};
