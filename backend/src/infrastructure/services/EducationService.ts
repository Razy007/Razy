import { UserRepository } from '../repositories/UserRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { ReferralRepository } from '../repositories/ReferralRepository';
import { Transaction, TransactionType, TransactionStatus } from '../../domain/entities/Transaction';
import { EnergyService } from './EnergyService';

interface LayerProgressData {
  layerId: string;
  courseId: string;
  xpReward: number;
  energyCost: number;
  score?: number;
}

export class EducationService {
  constructor(
    private userRepository: UserRepository,
    private transactionRepository: TransactionRepository,
    private energyService: EnergyService,
    private referralRepository?: ReferralRepository // Optional to avoid breaking existing code
  ) {}

  async completeLayer(userId: string, data: LayerProgressData): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const { layerId, courseId, xpReward, energyCost, score } = data;

    if (user.isLayerCompleted(courseId, layerId) && !layerId.includes('lab') && !layerId.includes('exam')) {
      // Allow re-playing but with 90% penalty on XP and 100% on Pi
      // For now, let's just keep it blocked as per previous logic but prepare for degressive XP
      return {
        success: false,
        error: 'ALREADY_COMPLETED',
        message: 'This layer has already been completed'
      };
    }

    // Check for Quiz Cooldown (Industry Farming Prevention)
    const quizState = user.quizAttempts[layerId] || { attempts: 0, cooldownUntil: 0 };
    if (quizState.cooldownUntil > Date.now()) {
      const remainingSeconds = Math.ceil((quizState.cooldownUntil - Date.now()) / 1000);
      return {
        success: false,
        error: 'COOLDOWN_ACTIVE',
        message: 'Too many incorrect attempts. Please wait before retrying.',
        remainingSeconds
      };
    }

    if (energyCost > 0) {
      const energyConsumed = await this.energyService.consumeEnergy(userId, energyCost);
      if (!energyConsumed) {
        return {
          success: false,
          error: 'INSUFFICIENT_ENERGY',
          message: 'Not enough energy to complete this layer',
          required: energyCost,
          available: user.energyBalance
        };
      }
    }

    // Handle Cooldown Logic based on score - HARDCORE MODE: 90% required
    const actualScore = score || 100;
    if (actualScore < 90) { // Failed attempt (was 80)
      quizState.attempts = (quizState.attempts || 0) + 1;
      quizState.lastAttempt = Date.now();
      
      if (quizState.attempts >= 3) {
        quizState.cooldownUntil = Date.now() + (20 * 60 * 1000); // 20 minutes (was 10)
      }
      user.quizAttempts[layerId] = quizState;
      await this.userRepository.save(user);
      
      return {
        success: false,
        error: 'SCORE_TOO_LOW',
        message: 'Score below 90%. In Web3, precision is everything.',
        score: actualScore,
        attempts: quizState.attempts,
        cooldownActive: quizState.attempts >= 3
      };
    }

    // Success -> Clear attempts
    delete user.quizAttempts[layerId];

    const layerCompleted = user.completeLayer(courseId, layerId);
    if (!layerCompleted) {
      // If already completed but we reached here, just return success without rewards
      return { success: true, alreadyCompleted: true };
    }

    user.addXp(xpReward);

    const piReward = this.calculatePiReward(xpReward, actualScore, user.level);
    user.piBalance += piReward;
    user.totalEarned += piReward;

    await this.userRepository.save(user);

    const transaction = Transaction.create({
      userId,
      type: TransactionType.QUIZ_REWARD,
      amount: piReward,
      energyAmount: energyCost,
      description: `Layer completed: ${layerId} (${courseId})`,
      status: TransactionStatus.COMPLETED,
      metadata: { layerId, courseId, xpReward, score: score || 100 }
    });
    await this.transactionRepository.save(transaction);

    // Referral Commission: 10% of rewards to referrer
    if (this.referralRepository) {
        try {
            const referrerId = await this.referralRepository.getReferrerIdForUser(userId);
            if (referrerId) {
                const commissionXP = Math.ceil(xpReward * 0.10);
                const commissionPi = parseFloat((piReward * 0.10).toFixed(8));
                await this.referralRepository.addReward(referrerId, userId, 'layer_commission', commissionXP, commissionPi);
                console.log(`[Referral] Commission added for ${referrerId}: ${commissionXP} XP, ${commissionPi} Pi`);
            }
        } catch (e) {
            console.warn('[Referral] Commission processing failed:', e);
        }
    }

    return {
      success: true,
      xpGained: xpReward,
      piGained: piReward,
      energyConsumed: energyCost,
      currentLevel: user.level,
      currentXp: user.xp,
      currentBalance: user.piBalance,
      completedLayers: user.completedLayers
    };
  }

  private calculatePiReward(xpReward: number, score: number, userLevel: number): number {
    // ULTRA-HARDCORE REDUCTION: ~0.000001 per layer (was 0.000025)
    // At GCV ($314,159), 0.000001 Pi = $0.31 per success.
    const baseReward = (xpReward / 100) * 0.000001; 
    const scoreMultiplier = score >= 90 ? (score / 100) : 0;
    const levelBonus = 1 + (userLevel * 0.02); // 2% bonus per level
    return parseFloat((baseReward * scoreMultiplier * levelBonus).toFixed(8));
  }

  async completeQuiz(userId: string, score: number, totalQuestions: number): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const energyConsumed = await this.energyService.consumeEnergy(userId, 10);
    if (!energyConsumed) {
      throw new Error('Not enough energy');
    }

    const xpReward = score * 10;
    const levelMultiplier = 1 + (user.level * 0.01);
    const piReward = (score / totalQuestions) * 0.0000001 * levelMultiplier;

    user.addXp(xpReward);
    user.piBalance += piReward;
    user.totalEarned += piReward;
    await this.userRepository.save(user);

    const transaction = Transaction.create({
      userId,
      type: TransactionType.QUIZ_REWARD,
      amount: piReward,
      description: `Quiz reward: ${score}/${totalQuestions} correct`,
      status: TransactionStatus.COMPLETED,
      metadata: { score, totalQuestions, xpReward }
    });
    await this.transactionRepository.save(transaction);

    return {
      success: true,
      xpGained: xpReward,
      piGained: piReward,
      currentLevel: user.level,
      currentBalance: user.piBalance
    };
  }

  async getAvailableQuizzes(): Promise<any[]> {
    return [
      { id: 'q1', title: 'Introduction au Web3', reward: 0.0000005, energyCost: 10, difficulty: 'Débutant' },
      { id: 'q2', title: 'Pi Network Fundamentals', reward: 0.0000010, energyCost: 15, difficulty: 'Intermédiaire' },
      { id: 'q3', title: 'Smart Contracts 101', reward: 0.0000015, energyCost: 20, difficulty: 'Avancé' },
    ];
  }
}
