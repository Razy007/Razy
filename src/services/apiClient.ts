/**
 * API Client Service
 * Centralized service for all backend API calls
 * Handles authentication, error handling, and request formatting
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

class ApiClient {
    private accessToken: string | null = null;

    /**
     * Set authentication token
     */
    setToken(token: string) {
        this.accessToken = token;
        localStorage.setItem('pi_academy_token', token);
    }

    /**
     * Get authentication token
     */
    getToken(): string | null {
        if (!this.accessToken) {
            this.accessToken = localStorage.getItem('pi_academy_token');
        }
        return this.accessToken;
    }

    /**
     * Clear authentication token
     */
    clearToken() {
        this.accessToken = null;
        localStorage.removeItem('pi_academy_token');
    }

    /**
     * Make authenticated request
     */
    private async request<T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const token = this.getToken();
        
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || `HTTP ${response.status}: ${response.statusText}`,
                };
            }

            return data;
        } catch (error: any) {
            console.error('API Request Error:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        }
    }

    /**
     * GET request
     */
    async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * PUT request
     */
    async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * DELETE request
     */
    async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    // ============================================================================
    // Authentication Endpoints
    // ============================================================================

    /**
     * Authenticate with Pi Network
     */
    async authenticatePi(piAuthData: any): Promise<ApiResponse<{ user: any; token: string }>> {
        const response = await this.post('/api/auth/pi', piAuthData);
        
        if (response.success && response.data?.token) {
            this.setToken(response.data.token);
        }
        
        return response;
    }

    /**
     * Guest login
     */
    async loginGuest(): Promise<ApiResponse<{ user: any; token: string }>> {
        const response = await this.post('/api/auth/guest');
        
        if (response.success && response.data?.token) {
            this.setToken(response.data.token);
        }
        
        return response;
    }

    /**
     * Logout
     */
    async logout(): Promise<ApiResponse> {
        const response = await this.post('/api/auth/logout');
        this.clearToken();
        return response;
    }

    /**
     * Verify KYC status
     */
    async verifyKYC(userId: string): Promise<ApiResponse<{ kycStatus: string }>> {
        return this.get(`/api/auth/kyc/${userId}`);
    }

    // ============================================================================
    // User Endpoints
    // ============================================================================

    /**
     * Get user profile
     */
    async getUserProfile(userId: string): Promise<ApiResponse<any>> {
        return this.get(`/api/users/${userId}`);
    }

    /**
     * Get user progress
     */
    async getUserProgress(userId: string): Promise<ApiResponse<any>> {
        return this.get(`/api/users/${userId}/progress`);
    }

    /**
     * Update user progress
     */
    async updateUserProgress(userId: string, progress: any): Promise<ApiResponse<any>> {
        return this.put(`/api/users/${userId}/progress`, progress);
    }

    // ============================================================================
    // Staking Endpoints
    // ============================================================================

    /**
     * Start staking
     */
    async startStaking(userId: string, amount: number, period: number): Promise<ApiResponse<any>> {
        return this.post('/api/staking/start', { userId, amount, period });
    }

    /**
     * Unstake
     */
    async unstake(userId: string): Promise<ApiResponse<any>> {
        return this.post('/api/staking/unstake', { userId });
    }

    /**
     * Get staking info
     */
    async getStakingInfo(userId: string): Promise<ApiResponse<any>> {
        return this.get(`/api/staking/${userId}`);
    }

    // ============================================================================
    // Shop Endpoints
    // ============================================================================

    /**
     * Purchase energy
     */
    async purchaseEnergy(userId: string, productId: string, cost: number): Promise<ApiResponse<any>> {
        return this.post('/api/shop/purchase', { userId, productId, cost });
    }

    /**
     * Purchase premium
     */
    async purchasePremium(userId: string): Promise<ApiResponse<any>> {
        return this.post('/api/shop/premium', { userId });
    }

    // ============================================================================
    // Transaction Endpoints
    // ============================================================================

    /**
     * Withdraw Pi
     */
    async withdrawPi(userId: string, amount: number, address: string): Promise<ApiResponse<any>> {
        return this.post('/api/transactions/withdraw', { userId, amount, address });
    }

    /**
     * Deposit Pi
     */
    async depositPi(userId: string, amount: number): Promise<ApiResponse<any>> {
        return this.post('/api/transactions/deposit', { userId, amount });
    }

    // ============================================================================
    // Course Endpoints
    // ============================================================================

    /**
     * Complete course
     */
    async completeCourse(userId: string, courseId: number, score: number): Promise<ApiResponse<any>> {
        return this.post('/api/courses/complete', { userId, courseId, score });
    }

    /**
     * Get courses
     */
    async getCourses(): Promise<ApiResponse<any[]>> {
        return this.get('/api/courses');
    }

    // ============================================================================
    // Social Endpoints
    // ============================================================================

    /**
     * Create post
     */
    async createPost(userId: string, content: string): Promise<ApiResponse<any>> {
        return this.post('/api/social/post', { userId, content });
    }

    /**
     * Get social feed
     */
    async getSocialFeed(limit: number = 50): Promise<ApiResponse<any[]>> {
        return this.get(`/api/social/feed?limit=${limit}`);
    }

    /**
     * Add comment
     */
    async addComment(postId: string, userId: string, content: string): Promise<ApiResponse<any>> {
        return this.post('/api/social/comment', { postId, userId, content });
    }

    // ============================================================================
    // Leaderboard Endpoints
    // ============================================================================

    /**
     * Get leaderboard
     */
    async getLeaderboard(limit: number = 10): Promise<ApiResponse<any[]>> {
        return this.get(`/api/leaderboard/top?limit=${limit}`);
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
