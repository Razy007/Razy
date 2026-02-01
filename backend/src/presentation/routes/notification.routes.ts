import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { NotificationRepository } from '../../infrastructure/repositories/NotificationRepository';
import Database from '../../config/database';
import { authenticateToken } from '../middlewares/authentication';

const router = Router();
const db = Database.getInstance();
const repository = new NotificationRepository(db.pool);
const controller = new NotificationController(repository);

//@ts-ignore
router.get('/', authenticateToken, controller.getMyNotifications);
//@ts-ignore
router.post('/:id/read', authenticateToken, controller.markRead);

export default router;
