import type { PiAuthResult, User } from '../types';

// Check if Pi SDK is available
const isPiSDKAvailable = (): boolean => {
    return typeof window !== 'undefined' && 'Pi' in window;
};

// Get configuration from environment
const getConfig = () => ({
    useMockAuth: import.meta.env.VITE_USE_MOCK_AUTH === 'true' || !isPiSDKAvailable(),
    sandbox: import.meta.env.VITE_PI_SANDBOX === 'true',
    apiKey: import.meta.env.VITE_PI_API_KEY || '',
});

/**
 * Initialize Pi SDK
 * Falls back to mock mode if SDK is not available or VITE_USE_MOCK_AUTH is true
 */
export const initPiSDK = async (): Promise<void> => {
    const config = getConfig();

    if (config.useMockAuth) {
        console.log('🔧 Running in MOCK mode (Pi SDK not initialized)');
        return;
    }

    if (!isPiSDKAvailable()) {
        console.warn('⚠️ Pi SDK not available. Falling back to mock mode.');
        return;
    }

    try {
        // Pi SDK init
        await window.Pi.init({
            version: '2.0',
            sandbox: config.sandbox,
        });
        console.log('✅ Pi SDK initialized successfully');
    } catch (error) {
        console.error('❌ Pi SDK initialization failed:', error);
        throw error;
    }
};

/**
 * Authenticate user with Pi Network
 * Falls back to mock authentication if SDK is not available
 */
export const authenticateUser = async (): Promise<User> => {
    const config = getConfig();

    // Mock authentication for development
    if (config.useMockAuth || !isPiSDKAvailable()) {
        return mockAuthenticate();
    }

    try {
        // Pi SDK authenticate
        const authResult: PiAuthResult = await window.Pi.authenticate(
            ['username', 'payments'],
            onIncompletePaymentFound
        );

        return {
            uid: authResult.user.uid,
            username: authResult.user.username,
            avatar: '🎓',
            joinDate: new Date().toISOString().split('T')[0],
        };
    } catch (error) {
        console.error('❌ Pi authentication failed:', error);
        // Fallback to mock on error
        return mockAuthenticate();
    }
};

/**
 * Mock authentication for development/testing
 */
const mockAuthenticate = (): User => {
    const uid = 'PIA' + Math.random().toString(36).substring(2, 11).toUpperCase();
    return {
        uid: uid,
        username: 'Pioneer' + Math.floor(Math.random() * 10000),
        avatar: '🎓',
        joinDate: '2024-11-01',
    };
};

import { handleIncompletePayment } from './piPayments';

/**
 * Handle incomplete payments
 * Called by Pi SDK when there are pending payments
 */
const onIncompletePaymentFound = (payment: unknown) => {
    console.log('⚠️ Incomplete payment found:', payment);
    handleIncompletePayment(payment);
};

/**
 * Check if running in mock mode
 */
export const isMockMode = (): boolean => {
    return getConfig().useMockAuth || !isPiSDKAvailable();
};

/**
 * Get current Pi SDK configuration
 */
/**
 * Check if the user is currently authenticated with Pi
 */
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('pi_user');
};

/**
 * Reset authentication to force re-login and scope update
 * Useful for fixing missing 'payments' scope issues
 */
export const resetAuthentication = async (): Promise<void> => {
    console.log('🔄 Resetting Pi Authentication...');
    // Clear local storage
    localStorage.removeItem('pi_user');
    localStorage.removeItem('pi_auth_token'); 
    
    // Force re-init and re-auth
    await initPiSDK();
    await authenticateUser();
    
    // Reload to reflect changes
    window.location.reload();
};

export const getPiConfig = () => getConfig();
