import { Request, Response } from 'express';
import { EducationService } from '../../infrastructure/services/EducationService';
import { RESTORED_COURSES } from '../../data/restored_courses';

export class EducationController {
  constructor(private educationService: EducationService) {}

  updateProgress = async (req: Request, res: Response) => {
    try {
      let { layerId, courseId, score } = req.body;
      const userId = (req as any).user.id;

      if (!layerId) {
        return res.status(400).json({ error: 'layerId is required' });
      }

      // If courseId not provided, try to extract it from layerId (fragile, but kept for compatibility)
      if (!courseId) {
        const lastHyphenIndex = layerId.lastIndexOf('-l');
        if (lastHyphenIndex !== -1) {
          courseId = layerId.substring(0, lastHyphenIndex);
          // Special case: if it ends with -101, -201 etc but was stripped
          if (!RESTORED_COURSES.find(c => c.id === courseId)) {
             // Try common patterns if stripped
             if (RESTORED_COURSES.find(c => c.id === `${courseId}-101`)) courseId = `${courseId}-101`;
             else if (RESTORED_COURSES.find(c => c.id === `${courseId}-fundamentals`)) courseId = `${courseId}-fundamentals`;
             else if (RESTORED_COURSES.find(c => c.id === `${courseId}-intro`)) courseId = `${courseId}-intro`;
          }
        }
      }
      
      // Fetch real layer data to avoid hardcoded 50 XP
      const course = RESTORED_COURSES.find(c => (c.id === courseId || (c as any).courseId === courseId));
      const layer = course?.layers?.find((l: any) => (l.id === layerId || l.layerId === layerId));
      
      const baseXP = layer?.xpReward || 50;
      const actualScore = Math.min(Math.max(score !== undefined ? score : 100, 0), 100);
      
      // Calculate scaled XP based on score
      const scaledXP = Math.ceil((actualScore / 100) * baseXP);

      const layerData = {
        layerId: layerId,
        courseId: courseId,
        xpReward: scaledXP,
        // Quizzes and Comprehension layers are paid upfront in the frontend via consumeEnergy
        energyCost: (layer?.type === 'quiz' || layer?.type === 'comprehension') ? 0 : (layer?.energyCost || 0),
        score: actualScore
      };

      const result = await this.educationService.completeLayer(userId, layerData);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error: any) {
      console.error('[EducationController] updateProgress error:', error);
      res.status(500).json({ error: error.message });
    }
  };

  submitQuiz = async (req: Request, res: Response) => {
    try {
      const { score, totalQuestions } = req.body;
      const userId = (req as any).user.id;

      if (score === undefined || !totalQuestions) {
        return res.status(400).json({ error: 'Score and totalQuestions are required' });
      }

      // Security Check: Anti-Cheat
      if (score < 0 || totalQuestions <= 0) {
        return res.status(400).json({ error: 'Invalid score or question count' });
      }
      if (score > totalQuestions) {
        return res.status(400).json({ error: 'Score cannot exceed total questions' }); 
      }
      if (totalQuestions > 20) { // Hard limit to prevent farming with massive "1000 question" quizzes
         return res.status(400).json({ error: 'Question count exceeds maximum allowed' });
      }

      const result = await this.educationService.completeQuiz(userId, score, totalQuestions);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getQuizzes = async (req: Request, res: Response) => {
    try {
      const quizzes = await this.educationService.getAvailableQuizzes();
      res.json({ success: true, quizzes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
