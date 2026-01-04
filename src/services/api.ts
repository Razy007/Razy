import type { ApiResponse, ApiError, User, UserProgress, SocialPost } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error: ApiError = {
                message: `HTTP ${response.status}: ${response.statusText}`,
                status: response.status,
            };

            try {
                const errorData = await response.json();
                error.message = errorData.message || error.message;
                error.code = errorData.code;
            } catch {
                // Response is not JSON
            }

            throw error;
        }

        const data: ApiResponse<T> = await response.json();

        if (!data.success && data.error) {
            throw {
                message: data.error,
                code: 'API_ERROR',
            } as ApiError;
        }

        return data.data as T;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}

// ============================================================================
// User API
// ============================================================================

export const userApi = {
    /**
     * Get user profile
     */
    getProfile: async (userId: string): Promise<User> => {
        return apiRequest<User>(`/api/users/${userId}`);
    },

    /**
     * Update user profile
     */
    updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
        return apiRequest<User>(`/api/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Upload profile picture
     */
    uploadProfilePicture: async (userId: string, imageData: string): Promise<{ url: string }> => {
        return apiRequest<{ url: string }>(`/api/users/${userId}/picture`, {
            method: 'POST',
            body: JSON.stringify({ imageData }),
        });
    },

    /**
     * Get user progress
     */
    getProgress: async (userId: string): Promise<UserProgress> => {
        return apiRequest<UserProgress>(`/api/users/${userId}/progress`);
    },

    /**
     * Update user progress
     */
    updateProgress: async (userId: string, progress: Partial<UserProgress>): Promise<UserProgress> => {
        return apiRequest<UserProgress>(`/api/users/${userId}/progress`, {
            method: 'PUT',
            body: JSON.stringify(progress),
        });
    },
};

// ============================================================================
// Courses API
// ============================================================================

export const coursesApi = {
    /**
     * Get all courses
     */
    getAll: async () => {
        return apiRequest<any[]>('/api/courses');
    },

    /**
     * Complete a course
     */
    completeCourse: async (userId: string, courseId: number, score: number) => {
        return apiRequest('/api/courses/complete', {
            method: 'POST',
            body: JSON.stringify({ userId, courseId, score }),
        });
    },
};

// ============================================================================
// Social API
// ============================================================================

export const socialApi = {
    /**
     * Get social feed
     */
    getFeed: async (limit: number = 50): Promise<SocialPost[]> => {
        return apiRequest<SocialPost[]>(`/api/social/feed?limit=${limit}`);
    },

    /**
     * Create a post
     */
    createPost: async (userId: string, content: string): Promise<SocialPost> => {
        return apiRequest<SocialPost>('/api/social/post', {
            method: 'POST',
            body: JSON.stringify({ userId, content }),
        });
    },

    /**
     * Like a post
     */
    likePost: async (postId: string, userId: string): Promise<void> => {
        return apiRequest('/api/social/like', {
            method: 'POST',
            body: JSON.stringify({ postId, userId }),
        });
    },
};

// ============================================================================
// Payments API
// ============================================================================

export const paymentsApi = {
    /**
     * Approve a payment (backend)
     */
    approvePayment: async (paymentId: string) => {
        return apiRequest('/api/payments/approve', {
            method: 'POST',
            body: JSON.stringify({ paymentId }),
        });
    },

    /**
     * Complete a payment (backend)
     */
    completePayment: async (paymentId: string, txid: string) => {
        return apiRequest('/api/payments/complete', {
            method: 'POST',
            body: JSON.stringify({ paymentId, txid }),
        });
    },

    /**
     * Get payment status
     */
    getPaymentStatus: async (paymentId: string) => {
        return apiRequest(`/api/payments/${paymentId}`);
    },
};

// ============================================================================
// Leaderboard API
// ============================================================================

export const leaderboardApi = {
    /**
     * Get top users
     */
    getTop: async (limit: number = 10) => {
        return apiRequest(`/api/leaderboard/top?limit=${limit}`);
    },
};

// ============================================================================
// Shop API
// ============================================================================

export const shopApi = {
    /**
     * Purchase an item
     */
    purchase: async (productId: string, cost: number) => {
        return apiRequest('/api/shop/purchase', {
            method: 'POST',
            body: JSON.stringify({ productId, cost }),
        });
    },

    /**
     * Buy Premium
     */
    buyPremium: async () => {
        return apiRequest('/api/shop/premium', {
            method: 'POST',
        });
    },
};

// ============================================================================
// Staking API
// ============================================================================

export const stakingApi = {
    /**
     * Start staking
     */
    start: async (amount: number, period: 30 | 60 | 90) => {
        return apiRequest('/api/staking/start', {
            method: 'POST',
            body: JSON.stringify({ amount, period }),
        });
    },

    /**
     * Unstake
     */
    unstake: async () => {
        return apiRequest('/api/staking/unstake', {
            method: 'POST',
        });
    },

    /**
     * Get staking info
     */
    getInfo: async (userId: string) => {
        return apiRequest(`/api/staking/${userId}`);
    },
};

// ============================================================================
// Export all APIs
// ============================================================================

export const api = {
    user: userApi,
    courses: coursesApi,
    social: socialApi,
    payments: paymentsApi,
    leaderboard: leaderboardApi,
    shop: shopApi,
    staking: stakingApi,
};

export default api;
