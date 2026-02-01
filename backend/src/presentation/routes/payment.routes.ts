import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { PaymentRepository } from '../../infrastructure/repositories/PaymentRepository';
import { PiNetworkService } from '../../infrastructure/services/PiNetworkService';
import { UserRepository } from '../../infrastructure/repositories/UserRepository'; // Added
import Database from '../../config/database';
import { authenticateToken } from '../middlewares/authentication';
import { validatePaymentApproval, validatePaymentCompletion } from '../middlewares/validation';
import { paymentLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Dependency Injection
const db = Database.getInstance();
const paymentRepository = new PaymentRepository(db.pool);
const piNetworkService = new PiNetworkService();
const userRepository = new UserRepository(db.pool); // Added
const paymentController = new PaymentController(paymentRepository, piNetworkService, userRepository); // Updated

// Routes
//@ts-ignore
router.post('/approve', authenticateToken, paymentLimiter, validatePaymentApproval, paymentController.approvePayment);
//@ts-ignore
router.post('/complete', authenticateToken, paymentLimiter, validatePaymentCompletion, paymentController.completePayment);
//@ts-ignore
router.get('/history', authenticateToken, paymentController.getPaymentHistory);

export default router;
