const express = require('express');
const router = express.Router();
const { authenticateToken, requirePioneer, requireAccess } = require('../middleware/auth');
const { getCollection } = require('../database/db');

/**
 * POST /api/social/post
 * Create a post
 */
router.post('/post',
    authenticateToken,
    requirePioneer,
    requireAccess('social', 'post'),
    async (req, res) => {
        try {
            const { content } = req.body;
            const userId = req.user.uid;

            if (!content || !content.trim()) {
                return res.status(400).json({
                    success: false,
                    error: 'Contenu vide',
                    code: 'EMPTY_CONTENT'
                });
            }

            const post = {
                userId,
                username: req.user.username,
                content: content.trim(),
                likes: 0,
                timestamp: new Date(),
                comments: []
            };

            const result = await getCollection('posts').insertOne(post);

            res.json({
                success: true,
                message: 'Publication créée',
                data: {
                    ...post,
                    id: result.insertedId
                }
            });

        } catch (error) {
            console.error('Create post error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la création de la publication',
                code: 'CREATE_POST_ERROR'
            });
        }
    }
);

/**
 * GET /api/social/feed
 * Get social feed
 */
router.get('/feed',
    authenticateToken,
    async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 50;

            const posts = await getCollection('posts')
                .find({})
                .sort({ timestamp: -1 })
                .limit(limit)
                .toArray();

            res.json({
                success: true,
                data: posts
            });

        } catch (error) {
            console.error('Get feed error:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération du feed',
                code: 'GET_FEED_ERROR'
            });
        }
    }
);

module.exports = router;
