/**
 * Referral API Service for Pi Academy
 * Handles all referral-related API calls
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ReferralCodeResponse {
  success: boolean;
  data: {
    referralCode: string;
    shareLink: string;
    stats: {
      totalReferrals: number;
      activeReferrals: number;
      totalEarnings: {
        xp: number;
        pi: number;
      };
    };
  };
}

interface ReferralStatsResponse {
  success: boolean;
  data: {
    stats: any;
    referrals: any[];
    pendingRewards: {
      xp: number;
      pi: number;
      badges: string[];
    };
    milestones: any;
  };
}

interface ClaimRewardsResponse {
  success: boolean;
  message: string;
  data: {
    claimed: {
      xp: number;
      pi: number;
      badges: string[];
    };
    newBalance: {
      xp: number;
      pi: number;
      level: number;
    };
  };
}

export class ReferralAPI {
  /**
   * Obtenir le code de parrainage de l'utilisateur
   */
  static async getMyReferralCode(token: string): Promise<ReferralCodeResponse> {
    try {
      const response = await fetch(`${API_BASE}/api/referral/code`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting referral code:', error);
      throw error;
    }
  }

  /**
   * Valider un code de parrainage
   */
  static async validateCode(code: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/api/referral/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ referralCode: code })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error validating code:', error);
      throw error;
    }
  }

  /**
   * Tracker un nouveau filleul (appelé lors de l'inscription)
   */
  static async trackReferral(code: string, userId: string, metadata: any = {}): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/api/referral/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          referralCode: code,
          newUserId: userId,
          metadata
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error tracking referral:', error);
      throw error;
    }
  }

  /**
   * Notifier un milestone atteint
   */
  static async recordMilestone(token: string, userId: string, milestone: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/api/referral/milestone`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, milestone })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error recording milestone:', error);
      throw error;
    }
  }

  /**
   * Obtenir les statistiques de parrainage
   */
  static async getStats(token: string): Promise<ReferralStatsResponse> {
    try {
      const response = await fetch(`${API_BASE}/api/referral/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }

  /**
   * Réclamer les récompenses en attente
   */
  static async claimRewards(token: string): Promise<ClaimRewardsResponse> {
    try {
      const response = await fetch(`${API_BASE}/api/referral/claim-rewards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error claiming rewards:', error);
      throw error;
    }
  }

  /**
   * Obtenir le leaderboard des parrains
   */
  static async getLeaderboard(limit: number = 10): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/api/referral/leaderboard?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  /**
   * Signaler une fraude
   */
  static async reportFraud(token: string, referralCode: string, reason: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/api/referral/report-fraud`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ referralCode, reason })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error reporting fraud:', error);
      throw error;
    }
  }

  /**
   * Copier le lien de parrainage dans le presse-papier
   */
  static copyToClipboard(link: string): boolean {
    try {
      navigator.clipboard.writeText(link);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }

  /**
   * Obtenir le code de parrainage depuis l'URL
   */
  static getReferralCodeFromURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref');
  }

  /**
   * Générer le device fingerprint (basique)
   */
  static async getDeviceFingerprint(): Promise<string> {
    const nav = navigator as any;
    const screen = window.screen;
    
    const components = [
      nav.userAgent,
      nav.language,
      screen.colorDepth,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage
    ];
    
    const fingerprint = components.join('|');
    
    // Simple hash
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Obtenir l'IP du client (via service externe)
   */
  static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch (error) {
      console.error('Error getting IP:', error);
      return 'unknown';
    }
  }

  /**
   * Lier le Pi Wallet pour activer les récompenses écosystème
   */
  static async linkPiWallet(token: string, userId: string, walletAddress: string, username?: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/api/referral/link-pi-wallet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId, 
          piWalletAddress: walletAddress,
          piUsername: username || 'Pioneer' // Default if not provided
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error linking Pi Wallet:', error);
      throw error;
    }
  }
}

export default ReferralAPI;
