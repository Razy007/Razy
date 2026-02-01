import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { EnergyService } from '../../infrastructure/services/EnergyService';
import Database from '../../config/database';
import { authenticateToken } from '../middlewares/authentication';

const router = Router();
const db = Database.getInstance();
const userRepository = new UserRepository(db.pool);
const energyService = new EnergyService(userRepository);
const userController = new UserController(userRepository, energyService);

//@ts-ignore
router.get('/profile', authenticateToken, userController.getProfile);
//@ts-ignore
router.get('/leaderboard', userController.getLeaderboard);
//@ts-ignore
router.post('/energy/consume', authenticateToken, userController.consumeEnergy);
//@ts-ignore
router.post('/avatar', authenticateToken, userController.uploadAvatar);
//@ts-ignore
router.get('/:userId/public', authenticateToken, userController.getPublicProfile);

export default router;
