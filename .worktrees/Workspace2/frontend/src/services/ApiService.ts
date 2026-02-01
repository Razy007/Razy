import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('pi_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const ApiService = {
  // User
  getUserProfile: () => api.get('/users/profile'),
  getLeaderboard: () => api.get('/users/leaderboard'),
  consumeEnergy: (amount: number) => api.post('/users/energy/consume', { amount }),
  updateAvatar: (avatar: string) => api.post('/users/avatar', { avatar }),
  getPublicUserProfile: (userId: string) => api.get(`/users/${userId}/public`),

  // Education
  getCourses: () => api.get('/courses'),
  submitQuiz: (score: number, totalQuestions: number) => 
    api.post('/education/quiz/submit', { score, totalQuestions }),
  
  updateProgress: (layerId: string, score: number, courseId?: string | null) =>
    api.post('/education/progress', { layerId, score, courseId }),

  // Staking
  createStake: (amount: number, period: number) => 
    api.post('/staking', { amount, period }),
  getMyStakes: () => api.get('/staking/my'),
  claimStake: (stakingId: string) => api.post(`/staking/claim/${stakingId}`),

  // Payments
  approvePayment: (paymentId: string) => api.post('/payments/approve', { paymentId }),
  completePayment: (paymentId: string, txid: string) => api.post('/payments/complete', { paymentId, txid }),
  getHistory: () => api.get('/payments/history'),

  // Social
  getSocialPosts: () => api.get('/social'),
  createSocialPost: (content: string) => api.post('/social', { content }),
  addComment: (postId: number, content: string, parentId?: number) => api.post(`/social/${postId}/comment`, { content, parentId }),
  toggleLikePost: (postId: number) => api.post(`/social/${postId}/like`),
  toggleLikeComment: (commentId: number) => api.post(`/social/comments/${commentId}/like`),
  getSocialUserPosts: (userId: string) => api.get(`/social/user/${userId}`),

  // Notifications
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id: string) => api.post(`/notifications/${id}/read`),

  // Referral
  getReferralCode: () => api.get('/referral/code'),
  getReferralStats: () => api.get('/referral/stats'),
  claimReferralRewards: () => api.post('/referral/claim-rewards'),
  trackReferral: (referralCode: string) => api.post('/referral/track', { referralCode }),

  // Economy
  purchaseItem: (itemId: string, cost: number, credibilityScore: number) => 
    api.post('/economy/purchase', { itemId, cost, credibilityScore }),
  requestWithdrawal: (amount: number, walletAddress: string) =>
    api.post('/economy/withdraw', { amount, walletAddress }),
  getWithdrawals: () => api.get('/economy/withdrawals'),
};

