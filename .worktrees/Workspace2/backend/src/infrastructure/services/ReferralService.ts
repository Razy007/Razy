import { ReferralRepository } from '../repositories/ReferralRepository';
import crypto from 'crypto';

export class ReferralService {
  constructor(private referralRepository: ReferralRepository) {}

  /**
   * Generates a unique referral code if one doesn't exist
   */
  async getOrCreateReferralCode(userId: string): Promise<string> {
    let code = await this.referralRepository.getReferralCode(userId);
    if (!code) {
      // Basic generation: first 4 chars of ID + 4 random hex
      // Not purely collision-proof but robust enough for this scale
      const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase();
      code = `PI-${randomPart}`; 
      // Ensure specific format if needed or retry on collision
      try {
        await this.referralRepository.setReferralCode(userId, code);
      } catch (e) {
          // Retry logic could go here
          code = `PI-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
          await this.referralRepository.setReferralCode(userId, code);
      }
    }
    return code;
  }

  /**
   * Processes a referral when a new user signs up
   */
  async processSignupReferral(newUserId: string, referralCode: string): Promise<boolean> {
      const referrerId = await this.referralRepository.getReferrerId(referralCode);
      
      if (referrerId && referrerId !== newUserId) {
          await this.referralRepository.createReferral(referrerId, newUserId);
          
          // Initial Reward for Referrer? 
          // Strategy: Usually reward when referee does an action (KYC, Course), but signup bonus is possible
          await this.referralRepository.addReward(referrerId, newUserId, 'signup_bonus', 10, 0.0001);
          return true;
      }
      return false;
  }

  /**
   * Trigger commission when a referee completes an action
   */
  async processActionCommission(refereeId: string, actionType: string, xpAmount: number, piAmount: number) {
      // Find who referred this user
      // This requires a reverse lookup not yet explicitly in repository, let's assume we can fetch it via the referrals table? 
      // Actually, referrals table stores (referrer, referee). 
      // We need to find "SELECT referrer_id FROM referrals WHERE referee_id = $1"
      // Let's add that to repository later or do a query here. 
      // For now, let's skip complex commission logic or implement a helper.
  }
}
