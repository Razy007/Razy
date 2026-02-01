import { Router } from 'express';
import { ReferralController } from '../controllers/ReferralController';
import { ReferralRepository } from '../../infrastructure/repositories/ReferralRepository';
import { ReferralService } from '../../infrastructure/services/ReferralService';
import Database from '../../config/database';
import { authenticateToken } from '../middlewares/authentication';
import { validate, validateReferralCode } from '../middlewares/inputValidation';

const db = Database.getInstance().pool;
const referralRepository = new ReferralRepository(db);
const referralService = new ReferralService(referralRepository);
const controller = new ReferralController(referralRepository, referralService);

const router = Router();

//@ts-ignore
router.get('/code', authenticateToken, controller.getCode);
//@ts-ignore
router.get('/stats', authenticateToken, controller.getStats);
//@ts-ignore
router.post('/claim-rewards', authenticateToken, controller.claimRewards);
//@ts-ignore
router.post('/track', authenticateToken, validate(validateReferralCode), controller.trackReferral);
//@ts-ignore
router.post('/validate', validate(validateReferralCode), controller.validateCode);

export default router;
