import { Request, Response } from 'express';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { EnergyService } from '../../infrastructure/services/EnergyService';

export class UserController {
  constructor(
    private userRepository: UserRepository,
    private energyService: EnergyService
  ) {}

  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const user = await this.energyService.refreshUserEnergy(userId);
      
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          piBalance: user.piBalance,
          energyBalance: user.energyBalance,
          stakingBalance: user.stakingBalance,
          totalEarned: user.totalEarned,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          kycStatus: user.kycStatus,
          role: user.role,
          completedLayers: user.completedLayers,
          avatar: user.avatarUrl,
          inventory: user.inventory,
          transferableBalance: user.transferableBalance || 0,
          quizAttempts: user.quizAttempts || {}
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve profile' });
    }
  };

  getLeaderboard = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await this.userRepository.getLeaderboard(limit);
      
      res.json({
        success: true,
        leaderboard: leaderboard.map(u => ({
          username: u.username,
          level: u.level,
          xp: u.xp,
          totalEarned: u.totalEarned,
          avatar: u.avatarUrl
        }))
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve leaderboard' });
    }
  };

  consumeEnergy = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid amount' });
        return;
      }

      const success = await this.energyService.consumeEnergy(userId, Number(amount));
      
      if (!success) {
        res.status(402).json({ success: false, error: 'Not enough energy' });
        return;
      }
      
      res.json({ success: true, energyConsumed: amount });
    } catch (error) {
      res.status(500).json({ error: 'Failed to consume energy' });
    }
  };

  uploadAvatar = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { avatar } = req.body;
      
      if (!avatar) {
         return res.status(400).json({ error: 'No avatar data' });
      }

      const user = await this.userRepository.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      user.avatarUrl = avatar;
      await this.userRepository.save(user);
      
      res.json({ success: true, avatar: user.avatarUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload avatar' });
    }
  };

  getPublicProfile = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          level: user.level,
          xp: user.xp,
          avatar: user.avatarUrl,
          role: user.role,
          streak: user.streak,
          totalEarned: user.totalEarned,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
       console.error('Get Public Profile Error', error);
       res.status(500).json({ error: 'Failed to retrieve public profile' });
    }
  };
}
