import axios from 'axios';
import config from '../config/env';
import { IPiAuthPayload, IJwtPayload } from '../types';
import { AuthenticationError } from '../types';
import User from '../models/User.model';
import { generateToken } from '../middlewares/auth.middleware';

/**
 * ============================================================================
 * PI NETWORK AUTHENTICATION SERVICE
 * ============================================================================
 */

interface IPiUserInfo {
    uid: string;
    username: string;
}

/**
 * Verify Pi Network access token with Pi servers
 */
export const verifyPiToken = async (accessToken: string): Promise<IPiUserInfo> => {
    try {
        const apiUrl = config.piNetwork.sandbox
            ? 'https://api.minepi.com/v2/me'
            : 'https://api.minepi.com/v2/me';
        
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        
        if (!response.data || !response.data.uid) {
            throw new AuthenticationError('Invalid Pi Network token', 'INVALID_PI_TOKEN');
        }
        
        return {
            uid: response.data.uid,
            username: response.data.username,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new AuthenticationError(
                    'Invalid or expired Pi Network token',
                    'INVALID_PI_TOKEN'
                );
            }
        }
        
        throw new AuthenticationError(
            'Failed to verify Pi Network token',
            'PI_VERIFICATION_FAILED'
        );
    }
};

/**
 * Authenticate user with Pi Network
 * Creates or updates user in database and returns JWT token
 */
export const authenticateWithPi = async (
    piAuthPayload: IPiAuthPayload
): Promise<{ user: any; token: string; isNewUser: boolean }> => {
    try {
        // Verify Pi Network token
        const piUserInfo = await verifyPiToken(piAuthPayload.accessToken);
        
        // Find or create user
        let user = await User.findByPiId(piUserInfo.uid);
        let isNewUser = false;
        
        if (!user) {
            // Create new user
            user = new User({
                piId: piUserInfo.uid,
                username: piAuthPayload.username || piUserInfo.username,
                role: 'pioneer_non_kyc',
                kycStatus: 'none',
                piBalance: 0,
                energyBalance: 100,
                level: 1,
                xp: 0,
                streak: 0,
            });
            
            await user.save();
            isNewUser = true;
            
            console.log(`✅ New user created: ${user.username} (${user.piId})`);
        } else {
            // Update existing user
            await user.updateStreak();
            
            console.log(`✅ User logged in: ${user.username} (${user.piId})`);
        }
        
        // Generate JWT token
        const jwtPayload: IJwtPayload = {
            userId: user._id.toString(),
            piId: user.piId,
            role: user.role,
            kycStatus: user.kycStatus,
        };
        
        const token = generateToken(jwtPayload);
        
        return {
            user: user.toJSON(),
            token,
            isNewUser,
        };
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error;
        }
        
        console.error('Authentication error:', error);
        throw new AuthenticationError(
            'Authentication failed',
            'AUTH_FAILED'
        );
    }
};

/**
 * Authenticate as guest (demo mode)
 */
export const authenticateAsGuest = async (): Promise<{ user: any; token: string }> => {
    try {
        // Generate unique guest ID
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create guest user
        const user = new User({
            piId: guestId,
            username: `Guest_${Math.random().toString(36).substr(2, 6)}`,
            role: 'guest',
            kycStatus: 'none',
            piBalance: 10, // Give guests some demo Pi
            energyBalance: 100,
            level: 1,
            xp: 0,
            streak: 0,
        });
        
        await user.save();
        
        // Generate JWT token
        const jwtPayload: IJwtPayload = {
            userId: user._id.toString(),
            piId: user.piId,
            role: user.role,
            kycStatus: user.kycStatus,
        };
        
        const token = generateToken(jwtPayload);
        
        console.log(`✅ Guest user created: ${user.username}`);
        
        return {
            user: user.toJSON(),
            token,
        };
    } catch (error) {
        console.error('Guest authentication error:', error);
        throw new AuthenticationError(
            'Failed to create guest session',
            'GUEST_AUTH_FAILED'
        );
    }
};

/**
 * Update user KYC status
 * Should be called when Pi Network KYC status changes
 */
export const updateKycStatus = async (
    userId: string,
    kycStatus: 'verified' | 'pending' | 'rejected'
): Promise<void> => {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        user.kycStatus = kycStatus;
        
        // Auto-update role based on KYC status (handled by pre-save hook)
        await user.save();
        
        console.log(`✅ KYC status updated for ${user.username}: ${kycStatus}`);
    } catch (error) {
        console.error('Failed to update KYC status:', error);
        throw error;
    }
};

/**
 * Refresh user token (generate new JWT with updated info)
 */
export const refreshUserToken = async (userId: string): Promise<string> => {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new AuthenticationError('User not found', 'USER_NOT_FOUND');
        }
        
        const jwtPayload: IJwtPayload = {
            userId: user._id.toString(),
            piId: user.piId,
            role: user.role,
            kycStatus: user.kycStatus,
        };
        
        return generateToken(jwtPayload);
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error;
        }
        
        throw new AuthenticationError('Failed to refresh token', 'REFRESH_FAILED');
    }
};

/**
 * ============================================================================
 * EXPORT AUTH SERVICE
 * ============================================================================
 */

export default {
    verifyPiToken,
    authenticateWithPi,
    authenticateAsGuest,
    updateKycStatus,
    refreshUserToken,
};
