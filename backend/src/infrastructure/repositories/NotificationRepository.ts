import { Pool } from 'pg';

export interface Notification {
  id: string;
  userId: string | null;
  type: 'info' | 'warning' | 'success' | 'ban' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export class NotificationRepository {
  constructor(private db: Pool) {}

  async findForUser(userId: string): Promise<Notification[]> {
    // Get Global Notifications (userId IS NULL) AND Personal Notifications (user_id = userId)
    const query = `
      SELECT * FROM notifications 
      WHERE user_id IS NULL OR user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `;
    const result = await this.db.query(query, [userId]);
    return result.rows.map(this.mapToEntity);
  }

  async create(data: {
    userId: string | null;
    type: string;
    title: string;
    message: string;
  }): Promise<Notification> {
    const query = `
      INSERT INTO notifications (user_id, type, title, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await this.db.query(query, [
      data.userId, data.type, data.title, data.message
    ]);
    return this.mapToEntity(result.rows[0]);
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    // Note: For global notifications, marking as read is trickier without a junction table.
    // For MVP, we will only mark personal notifications as read in DB.
    // Frontend will handle local "read" state for global ones using localStorage.
    const query = `
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE id = $1 AND user_id = $2
    `;
    await this.db.query(query, [notificationId, userId]);
  }

  private mapToEntity(row: any): Notification {
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      title: row.title,
      message: row.message,
      isRead: row.is_read,
      createdAt: new Date(row.created_at)
    };
  }
}
