export const SECURITY_CONFIG = {
    // Authentication
    MAX_LOGIN_ATTEMPTS: 5,
    SESSION_TIMEOUT_MS: 15 * 60 * 1000, // 15 minutes
    TOKEN_REFRESH_INTERVAL_MS: 5 * 60 * 1000, // 5 minutes
    
    // API Security
    API_TIMEOUT_MS: 10000,
    API_RATE_LIMIT_PER_MIN: 100,
    
    // Data Protection
    ENABLE_CLIENT_ENCRYPTION: true,
    SENSITIVE_DATA_KEYS: ['email', 'walletParams', 'pi_access_token'],
    
    // Pi Network
    PI_SDK_VERSION: '2.0',
    REQUIRE_PI_VERIFICATION: true,
    MIN_TRANSACTION_AMOUNT: 0.1,
    
    // Feature Flags
    ENABLE_DEBUG_LOGS: import.meta.env.DEV,
    MOCK_MODE: import.meta.env.VITE_USE_MOCK_AUTH === 'true'
};

export const API_ENDPOINTS = {
    AUTH: '/auth',
    USER: '/user',
    PAYMENTS: '/payments',
    COURSES: '/courses',
    ANALYTICS: '/analytics'
};
