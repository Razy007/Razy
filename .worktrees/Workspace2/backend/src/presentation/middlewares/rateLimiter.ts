import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

// Redis client setup (if configured)
let redisClient: Redis | null = null;
let redisStore: any = null;

const initializeRedis = async () => {
  if (process.env.REDIS_URL) {
    try {
      redisClient = new Redis(process.env.REDIS_URL);
      
      redisClient.on('error', (err: Error) => {
        console.error('[Redis] Connection error:', err.message);
      });
      
      redisClient.on('connect', () => {
        console.log('✅ [Redis] Connected for rate limiting');
      });
      
      redisStore = new RedisStore({
        // @ts-ignore - types mismatch but works
        sendCommand: (...args: string[]) => redisClient!.call(args[0], ...args.slice(1)),
        prefix: 'rl:' // rate-limit prefix
      });
      
      return true;
    } catch (error) {
      console.warn('[Redis] Failed to connect, falling back to memory store:', error);
      redisClient = null;
      redisStore = null;
      return false;
    }
  }
  console.log('[Redis] REDIS_URL not set, using memory store for rate limiting');
  return false;
};

// Initialize Redis on module load
initializeRedis();

// Global rate limiter (100 requests per 15 minutes)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // Increased for production
  message: { error: 'Too many requests, please try again later', code: 'RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore || undefined, // Use Redis if available
  handler: (req, res, next, options) => {
    console.warn(`[RateLimit] Global limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  }
});

// Payment rate limiter (10 requests per hour)
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many payment requests, please try again later', code: 'PAYMENT_RATE_LIMIT' },
  keyGenerator: (req) => (req as any).user?.id?.toString() || req.ip || 'anonymous',
  store: redisStore || undefined,
  handler: (req, res, next, options) => {
    console.warn(`[RateLimit] Payment limit exceeded for user: ${(req as any).user?.id || req.ip}`);
    res.status(429).json(options.message);
  }
});

// Auth rate limiter (stricter - 5 attempts per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many authentication attempts, please try again later', code: 'AUTH_RATE_LIMIT' },
  store: redisStore || undefined,
  skipSuccessfulRequests: true, // Only count failed attempts
  handler: (req, res, next, options) => {
    console.warn(`[RateLimit] Auth limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  }
});

// API-heavy endpoint limiter (for quiz submissions, etc.)
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { error: 'Rate limit exceeded, slow down', code: 'API_RATE_LIMIT' },
  keyGenerator: (req) => (req as any).user?.id?.toString() || req.ip || 'anonymous',
  store: redisStore || undefined
});

// Export Redis status check
export const isRedisConnected = () => redisClient?.status === 'ready';

