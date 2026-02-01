import { Pool } from 'pg';
import { Staking, StakingStatus } from '../../domain/entities/Staking';

export class StakingRepository {
  constructor(private db: Pool) {}

  async save(staking: Staking): Promise<Staking> {
    const query = `
      INSERT INTO stakes (
        id, user_id, amount, lock_period_days, reward_rate, start_date, unlock_date, 
        status, exit_fee_percent, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        status = $8,
        updated_at = NOW()
      RETURNING *
    `;

    // Note: reward_earned is not in the DB schema yet based on migration
    // We map apy -> reward_rate
    const values = [
      staking.id, staking.userId, staking.amount, staking.period, staking.apy,
      staking.startDate, staking.endDate, staking.status, 5.0, // Default exit fee
      staking.createdAt, staking.updatedAt
    ];

    const result = await this.db.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  async findActiveByUserId(userId: string): Promise<Staking[]> {
    const query = 'SELECT * FROM stakes WHERE user_id = $1 AND status = $2 ORDER BY start_date DESC';
    const result = await this.db.query(query, [userId, StakingStatus.ACTIVE]);
    return result.rows.map(row => this.mapToEntity(row));
  }

  async findById(id: string): Promise<Staking | null> {
    const result = await this.db.query('SELECT * FROM stakes WHERE id = $1', [id]);
    return result.rows[0] ? this.mapToEntity(result.rows[0]) : null;
  }

  private mapToEntity(row: any): Staking {
    // Map DB fields back to Entity fields
    return new Staking(
      row.id,
      row.user_id?.toString(), // Ensure string if integer in DB
      parseFloat(row.amount),
      parseInt(row.lock_period_days),
      parseFloat(row.reward_rate || '0'),
      new Date(row.start_date),
      new Date(row.unlock_date),
      row.status as StakingStatus,
      0, 
      parseFloat(row.exit_fee_percent || '5.0'), // Map fee
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
}
