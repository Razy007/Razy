import { Request, Response } from 'express';
import { StakingService } from '../../infrastructure/services/StakingService';
import { StakingRepository } from '../../infrastructure/repositories/StakingRepository';

export class StakingController {
  constructor(
    private stakingService: StakingService,
    private stakingRepository: StakingRepository
  ) {}

  createStake = async (req: Request, res: Response) => {
    try {
      const { amount, period } = req.body;
      const userId = (req as any).user.id;

      if (!amount || !period) {
        return res.status(400).json({ error: 'Amount and period are required' });
      }

      const stake = await this.stakingService.createStake(userId, parseFloat(amount), parseInt(period));
      res.status(201).json({ success: true, stake });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getMyStakes = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const stakes = await this.stakingRepository.findActiveByUserId(userId);
      
      res.json({
        success: true,
        stakes: stakes.map(s => ({
          id: s.id,
          amount: s.amount,
          period: s.period,
          apy: s.apy,
          startDate: s.startDate,
          endDate: s.endDate,
          currentReward: s.calculateReward(),
          status: s.status
        }))
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve stakes' });
    }
  };

  claimStake = async (req: Request, res: Response) => {
    try {
      const { stakingId } = req.params;
      const totalReturn = await this.stakingService.claimStake(stakingId);
      res.json({ success: true, totalReturn });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
