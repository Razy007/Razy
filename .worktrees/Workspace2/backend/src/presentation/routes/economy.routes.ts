import { Router } from 'express';
import { EconomyController } from '../controllers/EconomyController';
import { authenticateToken } from '../middlewares/authentication';

const router = Router();

router.use(authenticateToken); // Secure all routes

// Withdrawals
router.post('/withdraw', EconomyController.requestWithdrawal);
router.get('/withdrawals', EconomyController.getWithdrawalHistory);

// Shop purchases
router.post('/purchase', EconomyController.purchaseItem);

export default router;
