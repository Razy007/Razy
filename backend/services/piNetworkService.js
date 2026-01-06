import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PI_API_URL = 'https://api.minepi.com/v2';

/**
 * Verify Pi Network Access Token
 * @param {string} accessToken 
 * @returns {Promise<Object>} User data from Pi Network
 */
export const verifyPiToken = async (accessToken) => {
    if (!accessToken) {
        throw new Error('Access token is required');
    }

    // Bypass verification if in simulation/sandbox mode AND a specific flag is set
    // BUT for security, we default to ALWAYS verifying unless explicitly running a mock environment variable that is NOT present in production.
    if (process.env.VITE_USE_MOCK_AUTH === 'true' && process.env.NODE_ENV === 'development') {
        console.log('⚠️ Skipping Pi Token Verification (Mock Mode)');
        return {
            uid: 'PIA' + Math.random().toString(36).substring(2, 11).toUpperCase(),
            username: 'Mock_Pioneer',
            roles: ['miner']
        };
    }

    try {
        const response = await axios.get(`${PI_API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Pi API Verification Failed:', error.response?.data || error.message);
        // Throw specific error for auth handling
        if (error.response && error.response.status === 401) {
             throw new Error('Token expired or invalid');
        }
        throw new Error('Failed to verify Pi token');
    }
};

/**
 * Get Payment Details from Pi Network
 * @param {string} paymentId 
 */
export const getPayment = async (paymentId) => {
    try {
        const response = await axios.get(`${PI_API_URL}/payments/${paymentId}`, {
            headers: {
                'Authorization': `Key ${process.env.PI_API_KEY}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Get Payment Failed:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Approve a payment (Server-side)
 * @param {string} paymentId 
 */
export const approvePayment = async (paymentId) => {
    try {
        const response = await axios.post(`${PI_API_URL}/payments/${paymentId}/approve`, {}, {
            headers: {
                'Authorization': `Key ${process.env.PI_API_KEY}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Approve Payment Failed:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Complete a payment (Server-side)
 * @param {string} paymentId 
 * @param {string} txid 
 */
export const completePayment = async (paymentId, txid) => {
    try {
        const response = await axios.post(`${PI_API_URL}/payments/${paymentId}/complete`, { txid }, {
            headers: {
                'Authorization': `Key ${process.env.PI_API_KEY}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Complete Payment Failed:', error.response?.data || error.message);
        throw error;
    }
};
