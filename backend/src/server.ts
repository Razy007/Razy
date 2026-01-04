import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/env';
import db from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import stakingRoutes from './routes/staking.routes';

/**
 * ============================================================================
 * EXPRESS APPLICATION SETUP
 * ============================================================================
 */

const app: Application = express();
const PORT = config.server.port;

/**
 * ============================================================================
 * MIDDLEWARE
 * ============================================================================
 */

// Security headers
app.use(helmet({
    contentSecurityPolicy: config.server.isProduction,
    crossOriginEmbedderPolicy: config.server.isProduction,
}));

// CORS
app.use(cors(config.cors));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
        success: false,
        error: 'Too many requests, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

/**
 * ============================================================================
 * ROUTES
 * ============================================================================
 */

// Health check
app.get('/health', async (req: Request, res: Response) => {
    try {
        const dbHealth = await db.healthCheck();
        
        res.json({
            success: true,
            message: 'Pi Academy Backend API is running',
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            environment: config.server.nodeEnv,
            database: dbHealth,
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            error: 'Service unavailable',
            code: 'SERVICE_UNAVAILABLE',
        });
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/staking', stakingRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: '🥧 Welcome to Pioneer Academy Backend API',
        version: '2.0.0',
        documentation: '/api/docs',
        health: '/health',
    });
});

/**
 * ============================================================================
 * ERROR HANDLING
 * ============================================================================
 */

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        code: 'NOT_FOUND',
        path: req.url,
    });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Server error:', err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    const code = err.code || 'INTERNAL_ERROR';
    
    res.status(statusCode).json({
        success: false,
        error: message,
        code,
        ...(config.server.isDevelopment && { stack: err.stack }),
    });
});

/**
 * ============================================================================
 * SERVER STARTUP
 * ============================================================================
 */

const startServer = async (): Promise<void> => {
    try {
        // Connect to database
        console.log('🔌 Connecting to database...');
        await db.connect();
        
        // Start HTTP server
        app.listen(PORT, () => {
            console.log('='.repeat(70));
            console.log('🚀 PI ACADEMY BACKEND - SECURE MODE ACTIVATED');
            console.log('='.repeat(70));
            console.log(`📍 Server:        http://localhost:${PORT}`);
            console.log(`🏥 Health Check:  http://localhost:${PORT}/health`);
            console.log(`🔧 Environment:   ${config.server.nodeEnv}`);
            console.log(`🥧 Pi Sandbox:    ${config.piNetwork.sandbox ? 'ENABLED' : 'DISABLED'}`);
            console.log(`🔗 Frontend URL:  ${config.cors.origin}`);
            console.log(`🔒 Security:      JWT Auth + KYC Verification + Guest Blocking`);
            console.log('='.repeat(70));
            console.log('✅ Backend ready to accept requests');
            console.log('='.repeat(70));
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

/**
 * ============================================================================
 * GRACEFUL SHUTDOWN
 * ============================================================================
 */

const gracefulShutdown = async (signal: string): Promise<void> => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
    
    try {
        // Close database connection
        await db.disconnect();
        
        console.log('✅ Server shut down successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
};

// Handle shutdown signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason: any) => {
    console.error('❌ Unhandled Rejection:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
});

/**
 * ============================================================================
 * START APPLICATION
 * ============================================================================
 */

startServer();

export default app;
