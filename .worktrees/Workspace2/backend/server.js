const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// MongoDB Atlas avec retry logic et connection pooling optimisé
const { connectAtlas, disconnectAtlas, healthCheck, createIndexes } = require('./database/mongodb-atlas-config');

// Backward compatibility
const connectDB = connectAtlas;
const closeDB = disconnectAtlas;
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const stakingRoutes = require('./routes/staking');
const shopRoutes = require('./routes/shop');
const transactionRoutes = require('./routes/transactions');
const courseRoutes = require('./routes/courses');
const socialRoutes = require('./routes/social');
const leaderboardRoutes = require('./routes/leaderboard');
const referralRoutes = require('./routes/referral');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// Middleware
// ============================================================================

app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, error: 'Trop de requêtes, veuillez réessayer plus tard.' },
});
app.use('/api/', limiter);

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ============================================================================
// Routes
// ============================================================================

// Health check avec statut MongoDB
app.get('/health', async (req, res) => {
    const mongoHealth = await healthCheck();
    
    res.json({
        success: true,
        message: 'Pi Academy Backend API is running',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        database: {
            status: mongoHealth.status,
            type: 'MongoDB Atlas',
            connected: mongoHealth.status === 'healthy',
            ...(mongoHealth.host && { host: mongoHealth.host }),
            ...(mongoHealth.name && { database: mongoHealth.name })
        },
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/payments', require('./routes/payments'));

// ============================================================================
// Error Handling
// ============================================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route non trouvée',
        code: 'NOT_FOUND'
    });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        code: 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});

// ============================================================================
// Start Server
// ============================================================================

const startServer = async () => {
    try {
        console.log('🔄 Démarrage du serveur Pi Academy...\n');
        
        // Connect to MongoDB Atlas
        await connectDB();
        
        // Create indexes for optimal performance
        console.log('📊 Création des indexes MongoDB...');
        await createIndexes();
        
        // Start server
        const server = app.listen(PORT, () => {
            console.log('\n' + '='.repeat(60));
            console.log(`🚀 Pi Academy Backend - PRÊT`);
            console.log('='.repeat(60));
            console.log(`📍 Server: http://localhost:${PORT}`);
            console.log(`🏥 Health: http://localhost:${PORT}/health`);
            console.log(`📡 API: http://localhost:${PORT}/api`);
            console.log('-'.repeat(60));
            console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`💾 Database: MongoDB Atlas`);
            console.log(`🥧 Pi Network: ${process.env.PI_SANDBOX === 'true' ? 'Sandbox' : 'Production'}`);
            console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
            console.log('='.repeat(60));
            console.log('\n✨ Backend sécurisé, scalable et prêt pour production!\n');
        });
        
        return server;
    } catch (error) {
        console.error('\n❌ Échec démarrage serveur:', error.message);
        console.error('\n💡 Actions suggérées:');
        console.error('   1. Vérifiez votre connexion MongoDB Atlas');
        console.error('   2. Vérifiez le fichier .env');
        console.error('   3. Consultez MONGODB_ATLAS_GUIDE.md');
        console.error('\n');
        console.error('   4. Le serveur démarre en mode dégradé (sans base de données).');
        console.error('\n');
        // process.exit(1); // Keep server alive
        
        // Start server anyway
        const server = app.listen(PORT, () => {
             console.log('\n' + '='.repeat(60));
             console.log(`⚠️  Pi Academy Backend - MODE DÉGRADÉ`);
             console.log('='.repeat(60));
             console.log(`📍 Server: http://localhost:${PORT}`);
             console.log('='.repeat(60));
             console.log('\n✨ Serveur démarré mais non connecté à la base de données !\n');
        });
        return server;
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await closeDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await closeDB();
    process.exit(0);
});

startServer();

module.exports = app;
