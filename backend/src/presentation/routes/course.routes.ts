import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';

const router = Router();
const courseController = new CourseController();

// Routes publiques (pas besoin d'authentification pour consulter les cours)
router.get('/', courseController.getAllCourses);
router.get('/:courseId', courseController.getCourseById);
router.get('/:courseId/layers/:layerId', courseController.getCourseLayer);

export default router;
