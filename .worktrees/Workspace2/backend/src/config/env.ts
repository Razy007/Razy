import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/**
 * Environment Variables Schema
 * Validates all required environment variables at startup
 */
const envSchema = z.object({
    // Server Configuration
    PORT: z.string().default('3001'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    
    // Database
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    
    // Security
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    
    // Pi Network
    PI_API_KEY: z.string().min(1, 'PI_API_KEY is required'),
    PI_SANDBOX: z.string().default('true'),
    
    // CORS
    FRONTEND_URL: z.string().default('http://localhost:5173'),
    
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
});

/**
 * Parse and validate environment variables
 */
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Invalid environment variables:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
};

export const env = parseEnv();

/**
 * Typed environment configuration
 */
export const config = {
    server: {
        port: parseInt(env.PORT, 10),
        nodeEnv: env.NODE_ENV,
        isDevelopment: env.NODE_ENV === 'development',
        isProduction: env.NODE_ENV === 'production',
    },
    database: {
        uri: env.MONGODB_URI,
    },
    security: {
        jwtSecret: env.JWT_SECRET,
        jwtExpiresIn: env.JWT_EXPIRES_IN,
    },
    piNetwork: {
        apiKey: env.PI_API_KEY,
        sandbox: env.PI_SANDBOX === 'true',
    },
    cors: {
        origin: env.FRONTEND_URL,
        credentials: true,
    },
    rateLimit: {
        windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
        maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
    },
} as const;

export default config;
