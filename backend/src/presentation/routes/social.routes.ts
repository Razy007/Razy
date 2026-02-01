import { Router } from 'express';
import { SocialController } from '../controllers/SocialController';
import { SocialRepository } from '../../infrastructure/repositories/SocialRepository';
import Database from '../../config/database';

const db = Database.getInstance();
const socialRepository = new SocialRepository(db.pool);
const controller = new SocialController(socialRepository);

import { authenticateToken, optionalAuthenticateToken } from '../middlewares/authentication';
import { 
  validate, 
  validateCreatePost, 
  validateAddComment, 
  validatePostId, 
  validateCommentId 
} from '../middlewares/inputValidation';

const router = Router();

// Routes
//@ts-ignore
router.get('/', optionalAuthenticateToken, controller.getPosts);
//@ts-ignore
router.get('/user/:userId', optionalAuthenticateToken, controller.getUserPosts);
//@ts-ignore
router.post('/', authenticateToken, validate(validateCreatePost), controller.createPost);
//@ts-ignore
router.post('/:postId/comment', authenticateToken, validate(validateAddComment), controller.addComment);
//@ts-ignore
router.post('/:postId/like', authenticateToken, validate(validatePostId), controller.toggleLikePost);
//@ts-ignore
router.post('/comments/:commentId/like', authenticateToken, validate(validateCommentId), controller.toggleLikeComment);

export default router;
