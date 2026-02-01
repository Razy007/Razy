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
        // @ts-ignore - Pi SDK types
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
        // @ts-ignore - Pi SDK types
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
const onIncompletePaymentFound = (payment: any) => {
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
export const getPiConfig = () => getConfig();
