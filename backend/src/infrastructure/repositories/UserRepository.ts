import { Pool } from 'pg';
import { User, UserRole, KycStatus } from '../../domain/entities/User';

export class UserRepository {
  constructor(private db: Pool) {}

  async save(user: User): Promise<User> {
    const query = `
      INSERT INTO users (
        id, pi_id, username, email, role, kyc_status, 
        pi_balance, energy_balance, staking_balance, total_earned,
        level, xp, streak, last_login_date, completed_layers, created_at, updated_at, avatar_url,
        inventory, transferable_balance, quiz_attempts
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (id) DO UPDATE SET
        username = $3,
        email = $4,
        role = $5,
        kyc_status = $6,
        pi_balance = $7,
        energy_balance = $8,
        staking_balance = $9,
        total_earned = $10,
        level = $11,
        xp = $12,
        streak = $13,
        last_login_date = $14,
        completed_layers = $15,
        avatar_url = $18,
        inventory = $19,
        transferable_balance = $20,
        quiz_attempts = $21,
        updated_at = NOW()
      RETURNING *
    `;

    const values = [
      user.id, user.piId, user.username, user.email, user.role, user.kycStatus,
      user.piBalance, user.energyBalance, user.stakingBalance, user.totalEarned,
      user.level, user.xp, user.streak, user.lastLoginDate, 
      JSON.stringify(user.completedLayers),
      user.createdAt, user.updatedAt,
      user.avatarUrl,
      JSON.stringify(user.inventory),
      user.transferableBalance,
      JSON.stringify(user.quizAttempts)
    ];

    const result = await this.db.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  async findByPiId(piId: string): Promise<User | null> {
    const result = await this.db.query('SELECT * FROM users WHERE pi_id = $1', [piId]);
    return result.rows[0] ? this.mapToEntity(result.rows[0]) : null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ? this.mapToEntity(result.rows[0]) : null;
  }

  async getLeaderboard(limit = 10): Promise<User[]> {
    const result = await this.db.query(
      'SELECT * FROM users ORDER BY level DESC, xp DESC LIMIT $1',
      [limit]
    );
    return result.rows.map(row => this.mapToEntity(row));
  }

  private mapToEntity(row: any): User {
    let completedLayers: Record<string, string[]> = {};
    
    if (row.completed_layers) {
      try {
        completedLayers = typeof row.completed_layers === 'string' 
          ? JSON.parse(row.completed_layers) 
          : row.completed_layers;
      } catch (e) {
        console.error('Failed to parse completed_layers:', e);
        completedLayers = {};
      }
    }
    
    let inventory: any[] = [];
    if (row.inventory) {
      try {
        inventory = typeof row.inventory === 'string' 
          ? JSON.parse(row.inventory) 
          : row.inventory;
      } catch (e) {
        console.error('Failed to parse inventory:', e);
      }
    }
    
    return new User(
      row.id,
      row.pi_id,
      row.username,
      row.email,
      row.role as UserRole,
      row.kyc_status as KycStatus,
      parseFloat(row.pi_balance),
      parseInt(row.energy_balance),
      parseFloat(row.staking_balance),
      parseFloat(row.total_earned),
      parseInt(row.level),
      parseInt(row.xp),
      parseInt(row.streak),
      new Date(row.last_login_date),
      completedLayers,
      new Date(row.created_at),
      new Date(row.updated_at),
      row.avatar_url,
      inventory,
      row.transferable_balance ? parseFloat(row.transferable_balance) : 0,
      row.quiz_attempts ? (typeof row.quiz_attempts === 'string' ? JSON.parse(row.quiz_attempts) : row.quiz_attempts) : {}
    );
  }
}
