import cron from 'node-cron';
import { Pool } from 'pg';
import { StakingRepository } from '../repositories/StakingRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { Staking, StakingStatus } from '../../domain/entities/Staking';

export class CronService {
  private stakingRepository: StakingRepository;
  private notificationRepository: NotificationRepository;

  constructor(private db: Pool) {
    this.stakingRepository = new StakingRepository(db);
    this.notificationRepository = new NotificationRepository(db);
  }

  public start() {
    console.log('⏳ Starting Cron Service...');

    // Run every hour
    cron.schedule('0 * * * *', async () => {
      console.log('⏰ Running Hourly Staking Check...');
      await this.checkExpiringStakes();
    });
  }

  private async checkExpiringStakes() {
    try {
      // Find active stakes that have passed unlock date and haven't been notified
      const query = `
        SELECT * FROM stakes 
        WHERE status = 'active' 
        AND unlock_date <= NOW()
        AND notification_sent = FALSE
      `;
      
      const result = await this.db.query(query);
      const expiredStakes = result.rows;

      if (expiredStakes.length > 0) {
        console.log(`Found ${expiredStakes.length} expired stakes to notify.`);

        for (const row of expiredStakes) {
            // 1. Send Notification
            await this.notificationRepository.create({
                userId: row.user_id?.toString(),
                type: 'success',
                title: 'Stake Unlocked! 🔓',
                message: `Your stake of ${parseFloat(row.amount).toFixed(2)} Pi is now ready to be withdrawn.`
            });

            // 2. Mark as Notified
            await this.db.query(
                `UPDATE stakes SET notification_sent = TRUE WHERE id = $1`,
                [row.id]
            );
        }
      }
    } catch (error) {
      console.error('Cron Job Failed:', error);
    }
  }
}
