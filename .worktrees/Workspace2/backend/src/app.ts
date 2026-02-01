import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { globalLimiter } from './presentation/middlewares/rateLimiter';
import paymentRoutes from './presentation/routes/payment.routes';
import userRoutes from './presentation/routes/user.routes';
import stakingRoutes from './presentation/routes/staking.routes';
import educationRoutes from './presentation/routes/education.routes';
import courseRoutes from './presentation/routes/course.routes';
import socialRoutes from './presentation/routes/social.routes';
import economyRoutes from './presentation/routes/economy.routes';
import notificationRoutes from './presentation/routes/notification.routes';
import referralRoutes from './presentation/routes/referral.routes';

const app: Application = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://sdk.minepi.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.minepi.com", "https://*.minepi.com", process.env.FRONTEND_URL || "http://localhost:3000"],
      frameSrc: ["'self'", "https://app-cdn.minepi.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  crossOriginEmbedderPolicy: false, // Required for Pi SDK
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3000').split(',');
app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' })); // Reduced limit for security
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(globalLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), database: 'PostgreSQL' });
});

// Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/economy', economyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/referral', referralRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
