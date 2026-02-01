import { Router } from 'express';
import { StakingController } from '../controllers/StakingController';
import { StakingRepository } from '../../infrastructure/repositories/StakingRepository';
import { StakingService } from '../../infrastructure/services/StakingService';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { TransactionRepository } from '../../infrastructure/repositories/TransactionRepository';
import Database from '../../config/database';
import { authenticateToken } from '../middlewares/authentication';

const router = Router();
const db = Database.getInstance();
const stakingRepository = new StakingRepository(db.pool);
const userRepository = new UserRepository(db.pool);
const transactionRepository = new TransactionRepository(db.pool);
const stakingService = new StakingService(stakingRepository, userRepository, transactionRepository);
const stakingController = new StakingController(stakingService, stakingRepository);

//@ts-ignore
router.post('/', authenticateToken, stakingController.createStake);
//@ts-ignore
router.get('/my', authenticateToken, stakingController.getMyStakes);
//@ts-ignore
router.post('/claim/:stakingId', authenticateToken, stakingController.claimStake);

export default router;
