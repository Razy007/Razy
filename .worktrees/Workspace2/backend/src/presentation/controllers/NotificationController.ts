import { Request, Response } from 'express';
import { NotificationRepository } from '../../infrastructure/repositories/NotificationRepository';

export class NotificationController {
  constructor(private notificationRepository: NotificationRepository) {}

  getMyNotifications = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const notifications = await this.notificationRepository.findForUser(userId);
      
      res.json({
        success: true,
        notifications
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ error: 'Failed to retrieve notifications' });
    }
  };

  markRead = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      await this.notificationRepository.markAsRead(id, userId);
      
      res.json({ success: true });
    } catch (error) {
       // Silent error if trying to mark global notification as read (not supported in simple MVP DB schema)
       // Or if notification doesn't exist.
       res.json({ success: false }); 
    }
  };
}
