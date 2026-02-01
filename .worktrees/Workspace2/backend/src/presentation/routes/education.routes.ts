import { Router } from 'express';
import { EducationController } from '../controllers/EducationController';
import { EducationService } from '../../infrastructure/services/EducationService';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { TransactionRepository } from '../../infrastructure/repositories/TransactionRepository';
import { ReferralRepository } from '../../infrastructure/repositories/ReferralRepository';
import { EnergyService } from '../../infrastructure/services/EnergyService';
import Database from '../../config/database';
import { authenticateToken } from '../middlewares/authentication';
import { validate, validateUpdateProgress, validateSubmitQuiz } from '../middlewares/inputValidation';

const router = Router();
const db = Database.getInstance();
const userRepository = new UserRepository(db.pool);
const transactionRepository = new TransactionRepository(db.pool);
const referralRepository = new ReferralRepository(db.pool);
const energyService = new EnergyService(userRepository);
const educationService = new EducationService(userRepository, transactionRepository, energyService, referralRepository);
const educationController = new EducationController(educationService);

//@ts-ignore
router.post('/progress', authenticateToken, validate(validateUpdateProgress), educationController.updateProgress);
//@ts-ignore
router.get('/quizzes', authenticateToken, educationController.getQuizzes);
//@ts-ignore
router.post('/quiz/submit', authenticateToken, validate(validateSubmitQuiz), educationController.submitQuiz);

export default router;
