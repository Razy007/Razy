import { Request, Response } from 'express';
import { ReferralRepository } from '../../infrastructure/repositories/ReferralRepository';
import { ReferralService } from '../../infrastructure/services/ReferralService';

export class ReferralController {
  constructor(
    private referralRepository: ReferralRepository,
    private referralService: ReferralService
  ) {}

  getCode = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const code = await this.referralService.getOrCreateReferralCode(user.id);
      const stats = await this.referralRepository.getStats(user.id);
      
      res.json({
        success: true,
        data: {
            referralCode: code,
            shareLink: `https://pioneeracademy.academy/signup?ref=${code}`,
            stats
        }
      });
    } catch (error) {
      console.error('Get Referral Code Error', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getStats = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const stats = await this.referralRepository.getStats(user.id);
      const referrals = await this.referralRepository.getReferralsWithDetails(user.id);
      
      // Formatting to match Frontend expectations in ReferralDashboard.tsx
      const formattedReferrals = referrals.map(r => ({
          username: r.username,
          avatar: r.avatar,
          level: r.level || 1,
          status: r.status,
          signupDate: r.createdAt, // Frontend expects string ISO
          rewardsEarned: {
              totalXP: r.earnedXP,
              totalPi: r.earnedPi
          },
          milestones: {} // TODO: Implement milestones detail
      }));

      res.json({
        success: true,
        data: {
          stats,
          referrals: formattedReferrals,
          pendingRewards: stats.pendingRewards,
          milestones: {} // TODO
        }
      });
    } catch (error) {
      console.error('Get Referral Stats Error', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  claimRewards = async (req: Request, res: Response) => {
      try {
          const user = (req as any).user;
          const claimed = await this.referralRepository.claimRewards(user.id);
          
          // Should fetch new balance
          // For now, return what was claimed
          res.json({
              success: true,
              data: {
                  claimed,
                  newBalance: { xp: 0, pi: 0 } // Frontend should rely on profile refresh or we fetch user again
              }
          });
      } catch (error) {
          console.error('Claim Rewards Error', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  };

  // Track a referral after user signup (called by frontend after auth)
  trackReferral = async (req: Request, res: Response) => {
      try {
          const user = (req as any).user;
          const { referralCode } = req.body;
          
          if (!referralCode) {
              return res.status(400).json({ error: 'Referral code required' });
          }
          
          const success = await this.referralService.processSignupReferral(user.id, referralCode);
          
          res.json({
              success,
              message: success ? 'Referral tracked!' : 'Invalid or self-referral code'
          });
      } catch (error) {
          console.error('Track Referral Error', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  };

  // Called during signup flow (or manual entry)
  validateCode = async (req: Request, res: Response) => {
      // Just check if valid
      // return { valid: true/false }
      res.json({ valid: true }); // Placeholder
  };
}
