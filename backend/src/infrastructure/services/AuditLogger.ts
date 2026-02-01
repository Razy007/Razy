import { Pool } from 'pg';

export enum AuditAction {
  // Authentication
  LOGIN = 'auth.login',
  LOGIN_FAILED = 'auth.login_failed',
  LOGOUT = 'auth.logout',
  TOKEN_REFRESH = 'auth.token_refresh',
  
  // User
  PROFILE_UPDATE = 'user.profile_update',
  AVATAR_CHANGE = 'user.avatar_change',
  
  // Payments
  PAYMENT_INITIATED = 'payment.initiated',
  PAYMENT_APPROVED = 'payment.approved',
  PAYMENT_COMPLETED = 'payment.completed',
  PAYMENT_FAILED = 'payment.failed',
  
  // Staking
  STAKE_CREATED = 'staking.created',
  STAKE_CLAIMED = 'staking.claimed',
  
  // Referrals
  REFERRAL_CODE_GENERATED = 'referral.code_generated',
  REFERRAL_TRACKED = 'referral.tracked',
  REFERRAL_REWARDS_CLAIMED = 'referral.rewards_claimed',
  
  // Education
  LAYER_COMPLETED = 'education.layer_completed',
  QUIZ_SUBMITTED = 'education.quiz_submitted',
  
  // Economy
  ITEM_PURCHASED = 'economy.item_purchased',
  ENERGY_CONSUMED = 'economy.energy_consumed',
  WITHDRAWAL_REQUESTED = 'economy.withdrawal_requested',
  
  // Security
  RATE_LIMIT_EXCEEDED = 'security.rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY = 'security.suspicious_activity',
  INVALID_TOKEN = 'security.invalid_token'
}

export interface AuditLogEntry {
  userId?: number | string;
  action: AuditAction | string;
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  status?: 'success' | 'failure' | 'blocked';
}

export interface SecurityEvent {
  eventType: string;
  userId?: number | string;
  ipAddress?: string;
  details?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class AuditLogger {
  private static instance: AuditLogger;
  private db: Pool;
  private queue: AuditLogEntry[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  private constructor(db: Pool) {
    this.db = db;
    // Flush queue every 5 seconds for performance
    this.flushInterval = setInterval(() => this.flush(), 5000);
  }

  static initialize(db: Pool): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger(db);
    }
    return AuditLogger.instance;
  }

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      throw new Error('AuditLogger not initialized. Call initialize() first.');
    }
    return AuditLogger.instance;
  }

  /**
   * Log an audit event (async, queued for batch insert)
   */
  log(entry: AuditLogEntry): void {
    this.queue.push({
      ...entry,
      status: entry.status || 'success'
    });

    // Immediate flush if queue is large
    if (this.queue.length >= 50) {
      this.flush();
    }
  }

  /**
   * Log an audit event immediately (sync, for critical operations)
   */
  async logImmediate(entry: AuditLogEntry): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, user_agent, metadata, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          entry.userId || null,
          entry.action,
          entry.resourceType || null,
          entry.resourceId || null,
          entry.ipAddress || null,
          entry.userAgent || null,
          JSON.stringify(entry.metadata || {}),
          entry.status || 'success'
        ]
      );
    } catch (error) {
      console.error('[AuditLogger] Failed to log immediate:', error);
    }
  }

  /**
   * Log a security event (always immediate)
   */
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO security_events (event_type, user_id, ip_address, details, severity)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          event.eventType,
          event.userId || null,
          event.ipAddress || null,
          JSON.stringify(event.details || {}),
          event.severity
        ]
      );

      // Alert on high/critical events
      if (event.severity === 'high' || event.severity === 'critical') {
        console.warn(`🚨 [SECURITY ${event.severity.toUpperCase()}] ${event.eventType}`, event.details);
      }
    } catch (error) {
      console.error('[AuditLogger] Failed to log security event:', error);
    }
  }

  /**
   * Flush queued logs to database
   */
  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];

    try {
      // Batch insert for performance
      const values: any[] = [];
      const placeholders: string[] = [];
      
      batch.forEach((entry, index) => {
        const offset = index * 8;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8})`);
        values.push(
          entry.userId || null,
          entry.action,
          entry.resourceType || null,
          entry.resourceId || null,
          entry.ipAddress || null,
          entry.userAgent || null,
          JSON.stringify(entry.metadata || {}),
          entry.status || 'success'
        );
      });

      await this.db.query(
        `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, user_agent, metadata, status)
         VALUES ${placeholders.join(', ')}`,
        values
      );

      console.log(`[AuditLogger] Flushed ${batch.length} entries`);
    } catch (error) {
      console.error('[AuditLogger] Flush failed:', error);
      // Re-queue failed entries
      this.queue = [...batch, ...this.queue];
    }
  }

  /**
   * Query audit logs
   */
  async query(filters: {
    userId?: number;
    action?: string;
    resourceType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<any[]> {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (filters.userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      values.push(filters.userId);
    }
    if (filters.action) {
      conditions.push(`action LIKE $${paramIndex++}`);
      values.push(`${filters.action}%`);
    }
    if (filters.resourceType) {
      conditions.push(`resource_type = $${paramIndex++}`);
      values.push(filters.resourceType);
    }
    if (filters.startDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      values.push(filters.startDate);
    }
    if (filters.endDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      values.push(filters.endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = filters.limit || 100;

    const result = await this.db.query(
      `SELECT * FROM audit_logs ${whereClause} ORDER BY created_at DESC LIMIT ${limit}`,
      values
    );

    return result.rows;
  }

  /**
   * Get security events summary
   */
  async getSecuritySummary(hours: number = 24): Promise<any> {
    const result = await this.db.query(
      `SELECT 
        event_type,
        severity,
        COUNT(*) as count,
        COUNT(DISTINCT ip_address) as unique_ips
       FROM security_events
       WHERE created_at >= NOW() - INTERVAL '${hours} hours'
       GROUP BY event_type, severity
       ORDER BY count DESC`
    );

    return result.rows;
  }

  /**
   * Cleanup old logs (call via cron job)
   */
  async cleanup(retentionDays: number = 90): Promise<number> {
    const result = await this.db.query(
      `DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '${retentionDays} days' RETURNING id`
    );
    
    console.log(`[AuditLogger] Cleaned up ${result.rowCount} old entries`);
    return result.rowCount || 0;
  }

  /**
   * Shutdown gracefully
   */
  async shutdown(): Promise<void> {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    await this.flush();
  }
}

// Helper function to extract request info
export function extractRequestInfo(req: any): { ipAddress: string; userAgent: string } {
  return {
    ipAddress: req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown'
  };
}
