import { UserStatus } from '../components/user/UserBadge';

export interface FeatureAccess {
    courses: {
        basic: boolean;
        advanced: boolean;
        premium: boolean;
    };
    social: {
        view: boolean;
        post: boolean;
        comment: boolean;
    };
    earnings: {
        canEarnPi: boolean;
        canWithdraw: boolean;
        withdrawLimit: number | null; // null = unlimited
    };
    shop: {
        canBuy: boolean;
        canBuyEnergy: boolean;
        canBuyPremium: boolean;
    };
    staking: {
        canStake: boolean;
        maxStakeAmount: number | null; // null = unlimited
    };
    leaderboard: {
        canView: boolean;
        canParticipate: boolean;
    };
}

const ACCESS_MATRIX: Record<UserStatus, FeatureAccess> = {
    guest: {
        courses: {
            basic: true,
            advanced: false,
            premium: false
        },
        social: {
            view: true,
            post: false,
            comment: false
        },
        earnings: {
            canEarnPi: false,
            canWithdraw: false,
            withdrawLimit: 0
        },
        shop: {
            canBuy: false,
            canBuyEnergy: false,
            canBuyPremium: false
        },
        staking: {
            canStake: false,
            maxStakeAmount: 0
        },
        leaderboard: {
            canView: true,
            canParticipate: false
        }
    },
    pioneer_non_kyc: {
        courses: {
            basic: true,
            advanced: true,
            premium: false
        },
        social: {
            view: true,
            post: true,
            comment: true
        },
        earnings: {
            canEarnPi: true,
            canWithdraw: true,
            withdrawLimit: 0.01 // 0.01 Pi max per day
        },
        shop: {
            canBuy: true,
            canBuyEnergy: true,
            canBuyPremium: true
        },
        staking: {
            canStake: true,
            maxStakeAmount: 0.05 // 0.05 Pi max
        },
        leaderboard: {
            canView: true,
            canParticipate: true
        }
    },
    pioneer_kyc: {
        courses: {
            basic: true,
            advanced: true,
            premium: true
        },
        social: {
            view: true,
            post: true,
            comment: true
        },
        earnings: {
            canEarnPi: true,
            canWithdraw: true,
            withdrawLimit: null // Unlimited
        },
        shop: {
            canBuy: true,
            canBuyEnergy: true,
            canBuyPremium: true
        },
        staking: {
            canStake: true,
            maxStakeAmount: null // Unlimited
        },
        leaderboard: {
            canView: true,
            canParticipate: true
        }
    }
};

export interface AccessCheckResult {
    allowed: boolean;
    reason?: string;
    requiredStatus?: UserStatus;
}

export const UserAccessControl = {
    /**
     * Get full access permissions for a user status
     */
    getAccess(status: UserStatus): FeatureAccess {
        return ACCESS_MATRIX[status];
    },

    /**
     * Check if user can access a specific course
     */
    canAccessCourse(status: UserStatus, courseType: 'basic' | 'advanced' | 'premium'): AccessCheckResult {
        const access = ACCESS_MATRIX[status];
        const allowed = access.courses[courseType];

        if (!allowed) {
            let requiredStatus: UserStatus = 'pioneer_non_kyc';
            if (courseType === 'premium') requiredStatus = 'pioneer_kyc';
            
            return {
                allowed: false,
                reason: `Ce cours nécessite le statut ${requiredStatus === 'pioneer_kyc' ? 'Pioneer KYC' : 'Pioneer'}`,
                requiredStatus
            };
        }

        return { allowed: true };
    },

    /**
     * Check if user can post on social feed
     */
    canPost(status: UserStatus): AccessCheckResult {
        const access = ACCESS_MATRIX[status];
        
        if (!access.social.post) {
            return {
                allowed: false,
                reason: 'Connectez-vous avec Pi Network pour publier',
                requiredStatus: 'pioneer_non_kyc'
            };
        }

        return { allowed: true };
    },

    /**
     * Check if user can withdraw Pi
     */
    canWithdraw(status: UserStatus, amount: number): AccessCheckResult {
        const access = ACCESS_MATRIX[status];

        if (!access.earnings.canWithdraw) {
            return {
                allowed: false,
                reason: 'Connectez-vous avec Pi Network pour retirer des Pi',
                requiredStatus: 'pioneer_non_kyc'
            };
        }

        if (access.earnings.withdrawLimit !== null && amount > access.earnings.withdrawLimit) {
            return {
                allowed: false,
                reason: `Limite de retrait: ${access.earnings.withdrawLimit}π par jour. Complétez votre KYC pour des retraits illimités.`,
                requiredStatus: 'pioneer_kyc'
            };
        }

        return { allowed: true };
    },

    /**
     * Check if user can stake Pi
     */
    canStake(status: UserStatus, amount: number): AccessCheckResult {
        const access = ACCESS_MATRIX[status];

        if (!access.staking.canStake) {
            return {
                allowed: false,
                reason: 'Connectez-vous avec Pi Network pour staker',
                requiredStatus: 'pioneer_non_kyc'
            };
        }

        if (access.staking.maxStakeAmount !== null && amount > access.staking.maxStakeAmount) {
            return {
                allowed: false,
                reason: `Limite de staking: ${access.staking.maxStakeAmount}π. Complétez votre KYC pour staker sans limite.`,
                requiredStatus: 'pioneer_kyc'
            };
        }

        return { allowed: true };
    },

    /**
     * Check if user can buy from shop
     */
    canBuyFromShop(status: UserStatus, productType: 'energy' | 'premium' | 'other'): AccessCheckResult {
        const access = ACCESS_MATRIX[status];

        if (!access.shop.canBuy) {
            return {
                allowed: false,
                reason: 'Connectez-vous avec Pi Network pour acheter',
                requiredStatus: 'pioneer_non_kyc'
            };
        }

        if (productType === 'energy' && !access.shop.canBuyEnergy) {
            return {
                allowed: false,
                reason: 'Connectez-vous pour acheter de l\'énergie',
                requiredStatus: 'pioneer_non_kyc'
            };
        }

        return { allowed: true };
    },

    /**
     * Get required status for a feature
     */
    getRequiredStatus(feature: string): UserStatus {
        // Premium courses require KYC
        if (feature.includes('premium') || feature.includes('kyc')) {
            return 'pioneer_kyc';
        }
        // Most features require at least Pioneer
        return 'pioneer_non_kyc';
    },

    /**
     * Get user status from auth and KYC state
     */
    getUserStatus(authStatus: string, kycStatus: string): UserStatus {
        if (authStatus === 'guest') return 'guest';
        if (authStatus === 'pioneer' && kycStatus === 'verified') return 'pioneer_kyc';
        if (authStatus === 'pioneer') return 'pioneer_non_kyc';
        return 'guest';
    }
};
