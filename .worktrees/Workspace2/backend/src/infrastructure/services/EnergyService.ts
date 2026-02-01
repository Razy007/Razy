import { User } from '../../domain/entities/User';
import { UserRepository } from '../repositories/UserRepository';

const MAX_ENERGY = 500;
const RECHARGE_RATE_PER_SECOND = 4 / 3600; // 4 points per hour (was 10)
const REST_BONUS_THRESHOLD_SECONDS = 24 * 3600; // 24 hours (was 12)

export class EnergyService {
  constructor(private userRepository: UserRepository) {}

  async refreshUserEnergy(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const now = new Date();
    const timeDiffSeconds = (now.getTime() - user.lastLoginDate.getTime()) / 1000;

    let bonus = 0;
    if (timeDiffSeconds >= REST_BONUS_THRESHOLD_SECONDS) {
      bonus = 20;
    }

    const energyRecovered = Math.floor(timeDiffSeconds * RECHARGE_RATE_PER_SECOND);
    
    if (energyRecovered > 0 || bonus > 0) {
      user.energyBalance = Math.min(MAX_ENERGY, user.energyBalance + energyRecovered + bonus);
      user.lastLoginDate = now;
      return await this.userRepository.save(user);
    }

    return user;
  }

  async consumeEnergy(userId: string, amount: number): Promise<boolean> {
    const user = await this.refreshUserEnergy(userId);
    
    if (user.energyBalance < amount) {
      return false;
    }

    user.energyBalance -= amount;
    await this.userRepository.save(user);
    return true;
  }
}
