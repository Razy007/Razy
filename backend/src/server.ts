import 'dotenv/config';
import app from './app';
import Database from './config/database';
import RedisClient from './config/redis';
import walletRoutes from './routes/wallet'; // Added import for wallet routes
import { CronService } from './infrastructure/services/CronService';
import { AuditLogger } from './infrastructure/services/AuditLogger';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize Database
    const db = Database.getInstance();
    try {
      await db.query('SELECT 1');
      console.log('✅ Database connected');
    } catch (dbError) {
      console.error('⚠️ Database connection failed at startup:', dbError instanceof Error ? dbError.message : String(dbError));
      console.log('Continuing server initiation in fallback mode...');
    }

    // Initialize Audit Logger
    AuditLogger.initialize(db.pool);
    console.log('✅ Audit Logger initialized');

    // Initialize Redis
    RedisClient.getInstance();

    // Start Cron Jobs
    const cronService = new CronService(db.pool);
    cronService.start();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('🛑 SIGTERM received, shutting down gracefully...');
      try {
        await AuditLogger.getInstance().shutdown();
        console.log('✅ Audit logs flushed');
      } catch (e) {
        console.error('Error during shutdown:', e);
      }
      process.exit(0);
    });

    // Handle unexpected errors on the database pool
    db.pool.on('error', (err) => {
      console.error('Unexpected error on idle client in database pool:', err);
      // Removed process.exit(-1) to allow recovery or continued operation
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
