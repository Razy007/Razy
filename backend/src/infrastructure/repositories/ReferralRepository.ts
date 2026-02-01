import { Pool } from 'pg';

export interface Referral {
  id: number;
  referrerId: string;
  refereeId: string;
  status: 'pending' | 'active' | 'inactive';
  createdAt: Date;
}

export interface ReferralReward {
  id: number;
  userId: string;
  sourceUserId: string;
  type: string;
  amountXp: number;
  amountPi: number;
  status: 'pending' | 'claimed';
  createdAt: Date;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: {
    xp: number;
    pi: number;
  };
   pendingRewards: {
    xp: number;
    pi: number;
  };
}

export class ReferralRepository {
  constructor(private db: Pool) {}

  async createReferral(referrerId: string, refereeId: string): Promise<Referral> {
    const query = `
      INSERT INTO referrals (referrer_id, referee_id, status)
      VALUES ($1, $2, 'pending')
      RETURNING *
    `;
    const res = await this.db.query(query, [referrerId, refereeId]);
    return this.mapReferral(res.rows[0]);
  }

  async getReferrerId(referralCode: string): Promise<string | null> {
    const query = 'SELECT id FROM users WHERE referral_code = $1';
    const res = await this.db.query(query, [referralCode]);
    return res.rows[0] ? res.rows[0].id : null;
  }

  async getReferralCode(userId: string): Promise<string | null> {
      const query = 'SELECT referral_code FROM users WHERE id = $1';
      const res = await this.db.query(query, [userId]);
      return res.rows[0]?.referral_code || null;
  }

  async setReferralCode(userId: string, code: string): Promise<void> {
      const query = 'UPDATE users SET referral_code = $1 WHERE id = $2';
      await this.db.query(query, [code, userId]);
  }
  
  async getReferralsForUser(userId: string): Promise<Referral[]> {
      const query = 'SELECT * FROM referrals WHERE referrer_id = $1 ORDER BY created_at DESC';
      const res = await this.db.query(query, [userId]);
      return res.rows.map(this.mapReferral);
  }

  async getReferrerIdForUser(refereeId: string): Promise<string | null> {
      const query = 'SELECT referrer_id FROM referrals WHERE referee_id = $1';
      const res = await this.db.query(query, [refereeId]);
      return res.rows[0]?.referrer_id || null;
  }

  async getReferralsWithDetails(userId: string): Promise<any[]> {
    const query = `
        SELECT r.*, u.username, u.avatar_url, u.level,
        (SELECT SUM(amount_xp) FROM referral_rewards rr WHERE rr.source_user_id = r.referee_id AND rr.user_id = $1) as earned_xp,
        (SELECT SUM(amount_pi) FROM referral_rewards rr WHERE rr.source_user_id = r.referee_id AND rr.user_id = $1) as earned_pi
        FROM referrals r
        JOIN users u ON r.referee_id = u.id
        WHERE r.referrer_id = $1
        ORDER BY r.created_at DESC
    `;
    const res = await this.db.query(query, [userId]);
    return res.rows.map(row => ({
        ...this.mapReferral(row),
        username: row.username,
        avatar: row.avatar_url || '👤',
        level: row.level,
        earnedXP: parseInt(row.earned_xp || '0'),
        earnedPi: parseFloat(row.earned_pi || '0')
    }));
  }

  async addReward(userId: string, sourceUserId: string, type: string, amountXp: number, amountPi: number): Promise<void> {
    const query = `
        INSERT INTO referral_rewards (user_id, source_user_id, type, amount_xp, amount_pi, status)
        VALUES ($1, $2, $3, $4, $5, 'pending')
    `;
    await this.db.query(query, [userId, sourceUserId, type, amountXp, amountPi]);
  }

  async getStats(userId: string): Promise<ReferralStats> {
    // Basic stats
    const statsQuery = `
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN status = 'active' THEN 1 END) as active
        FROM referrals
        WHERE referrer_id = $1
    `;
    const statsRes = await this.db.query(statsQuery, [userId]);

    // Earnings stats (claimed)
    const earningsQuery = `
        SELECT 
            SUM(amount_xp) as total_xp,
            SUM(amount_pi) as total_pi
        FROM referral_rewards
        WHERE user_id = $1 AND status = 'claimed'
    `;
    const earningsRes = await this.db.query(earningsQuery, [userId]);

     // Pending rewards
     const pendingQuery = `
        SELECT 
            SUM(amount_xp) as pending_xp,
            SUM(amount_pi) as pending_pi
        FROM referral_rewards
        WHERE user_id = $1 AND status = 'pending'
    `;
    const pendingRes = await this.db.query(pendingQuery, [userId]);

    return {
        totalReferrals: parseInt(statsRes.rows[0].total || '0'),
        activeReferrals: parseInt(statsRes.rows[0].active || '0'),
        totalEarnings: {
            xp: parseInt(earningsRes.rows[0].total_xp || '0'),
            pi: parseFloat(earningsRes.rows[0].total_pi || '0')
        },
        pendingRewards: {
            xp: parseInt(pendingRes.rows[0].pending_xp || '0'),
            pi: parseFloat(pendingRes.rows[0].pending_pi || '0')
        }
    };
  }

  async claimRewards(userId: string): Promise<{xp: number, pi: number}> {
      const client = await this.db.connect();
      try {
          await client.query('BEGIN');
          
          // Calculate totals
          const sumQuery = `
            SELECT SUM(amount_xp) as xp, SUM(amount_pi) as pi 
            FROM referral_rewards 
            WHERE user_id = $1 AND status = 'pending'
          `;
          const sumRes = await client.query(sumQuery, [userId]);
          const xp = parseInt(sumRes.rows[0].xp || '0');
          const pi = parseFloat(sumRes.rows[0].pi || '0');

          if (xp > 0 || pi > 0) {
              // Mark as claimed
              await client.query(
                  "UPDATE referral_rewards SET status = 'claimed', claimed_at = NOW() WHERE user_id = $1 AND status = 'pending'", 
                  [userId]
              );

              // Update User Balance
              const updateUserQuery = `
                UPDATE users 
                SET xp = xp + $1, pi_balance = pi_balance + $2, total_earned = total_earned + $2 
                WHERE id = $3
              `;
              await client.query(updateUserQuery, [xp, pi, userId]);
          }

          await client.query('COMMIT');
          return { xp, pi };

      } catch (e) {
          await client.query('ROLLBACK');
          throw e;
      } finally {
          client.release();
      }
  }

  private mapReferral(row: any): Referral {
      return {
          id: row.id,
          referrerId: row.referrer_id,
          refereeId: row.referee_id,
          status: row.status,
          createdAt: row.created_at
      };
  }
}
