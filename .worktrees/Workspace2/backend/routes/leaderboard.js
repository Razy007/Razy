const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getCollection } = require('../database/db');

/**
 * GET /api/leaderboard/top
 * Get top users
 */
router.get('/top',
    authenticateToken,
    async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;

            const topUsers = await getCollection('progress')
                .find({})
                .sort({ totalPoints: -1 })
                .limit(limit)
                .toArray();

            res.json({
                success: true,
                data: topUsers
            });

        } catch (error) {
            console.error('Get leaderboard error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération du classement',
                code: 'GET_LEADERBOARD_ERROR'
            });
        }
    }
);

module.exports = router;
