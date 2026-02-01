const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getUserProgress, updateUserProgress, createTransaction } = require('../database/db');

/**
 * POST /api/courses/complete
 * Complete a course
 */
router.post('/complete',
    authenticateToken,
    async (req, res) => {
        try {
            const { courseId, score } = req.body;
            const userId = req.user.uid;

            if (!courseId || score === undefined) {
                return res.status(400).json({
                    success: false,
                    error: 'Données invalides',
                    code: 'INVALID_DATA'
                });
            }

            const progress = await getUserProgress(userId);

            // Calculate rewards (server-side validation)
            const percentage = Math.min(100, Math.max(0, score));
            const baseXP = 100; // Base XP per course
            const basePi = 0.001; // Base Pi reward

            const { findUserByUid } = require('../database/db');
            const user = await findUserByUid(userId);
            const xpMultiplier = user.isPremium ? 2 : 1;

            const earnedXP = Math.floor((baseXP * percentage) / 100) * xpMultiplier;
            const earnedPi = percentage >= 80 ? basePi : (basePi * percentage) / 100;

            const newXP = (progress?.xp || 0) + earnedXP;
            const newLevel = Math.floor(newXP / 100) + 1;

            // Update progress
            const completedCourses = progress?.completedCourses || [];
            if (!completedCourses.includes(courseId)) {
                completedCourses.push(courseId);
            }

            await updateUserProgress(userId, {
                xp: newXP,
                level: newLevel,
                xpToNext: (newLevel * 100) - (newXP % 100),
                piBalance: (progress?.piBalance || 0) + earnedPi,
                totalPoints: (progress?.totalPoints || 0) + earnedXP,
                completedCourses
            });

            // Record transaction
            await createTransaction({
                userId,
                type: 'course_completion',
                courseId,
                score: percentage,
                earnedXP,
                earnedPi
            });

            res.json({
                success: true,
                message: 'Cours complété avec succès',
                data: {
                    earnedXP,
                    earnedPi,
                    newLevel,
                    newXP,
                    piBalance: (progress?.piBalance || 0) + earnedPi
                }
            });

        } catch (error) {
            console.error('Course completion error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la complétion du cours',
                code: 'COURSE_COMPLETION_ERROR'
            });
        }
    }
);

/**
 * GET /api/courses
 * Get all courses
 */
router.get('/',
    async (req, res) => {
        try {
            // Return courses (could be from database in production)
            res.json({
                success: true,
                data: []
            });
        } catch (error) {
            console.error('Get courses error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des cours',
                code: 'GET_COURSES_ERROR'
            });
        }
    }
);

module.exports = router;
