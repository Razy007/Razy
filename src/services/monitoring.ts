/**
 * Monitoring and Error Tracking Service
 * Integrates with Sentry for production error tracking
 */

interface MonitoringConfig {
    dsn?: string;
    environment: string;
    enabled: boolean;
    tracesSampleRate: number;
}

const config: MonitoringConfig = {
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || 'development',
    enabled: import.meta.env.VITE_SENTRY_ENABLED === 'true',
    tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
};

/**
 * Initialize monitoring service
 * Only initializes Sentry if enabled and DSN is provided
 */
export const initMonitoring = async (): Promise<void> => {
    if (!config.enabled || !config.dsn) {
        console.log('📊 Monitoring disabled or DSN not configured');
        return;
    }

    try {
        // Dynamically import Sentry to avoid bundling if not used
        const Sentry = await import('@sentry/react');

        Sentry.init({
            dsn: config.dsn,
            environment: config.environment,
            tracesSampleRate: config.tracesSampleRate,
            integrations: [
                new Sentry.BrowserTracing(),
                new Sentry.Replay({
                    maskAllText: false,
                    blockAllMedia: false,
                }),
            ],
            // Performance Monitoring
            beforeSend(event, hint) {
                // Filter out certain errors if needed
                return event;
            },
        });

        console.log('✅ Sentry monitoring initialized');
    } catch (error) {
        console.error('❌ Failed to initialize Sentry:', error);
    }
};

/**
 * Log an error to monitoring service
 */
export const logError = (error: Error, context?: Record<string, any>): void => {
    console.error('Error:', error, context);

    if (!config.enabled) {
        return;
    }

    import('@sentry/react').then((Sentry) => {
        Sentry.captureException(error, {
            extra: context,
        });
    }).catch(() => {
        // Sentry not available
    });
};

/**
 * Log a message to monitoring service
 */
export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info'): void => {
    console.log(`[${level.toUpperCase()}]`, message);

    if (!config.enabled) {
        return;
    }

    import('@sentry/react').then((Sentry) => {
        Sentry.captureMessage(message, level);
    }).catch(() => {
        // Sentry not available
    });
};

/**
 * Set user context for error tracking
 */
export const setUserContext = (user: { id: string; username?: string; email?: string }): void => {
    if (!config.enabled) {
        return;
    }

    import('@sentry/react').then((Sentry) => {
        Sentry.setUser({
            id: user.id,
            username: user.username,
            email: user.email,
        });
    }).catch(() => {
        // Sentry not available
    });
};

/**
 * Clear user context
 */
export const clearUserContext = (): void => {
    if (!config.enabled) {
        return;
    }

    import('@sentry/react').then((Sentry) => {
        Sentry.setUser(null);
    }).catch(() => {
        // Sentry not available
    });
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (message: string, data?: Record<string, any>): void => {
    if (!config.enabled) {
        return;
    }

    import('@sentry/react').then((Sentry) => {
        Sentry.addBreadcrumb({
            message,
            data,
            level: 'info',
        });
    }).catch(() => {
        // Sentry not available
    });
};

/**
 * Log a structured event to monitoring service
 */
export const logEvent = (eventName: string, properties?: Record<string, any>): void => {
    console.log(`[EVENT] ${eventName}`, properties);

    if (!config.enabled) {
        return;
    }

    import('@sentry/react').then((Sentry) => {
        Sentry.captureMessage(eventName, {
            level: 'info',
            extra: properties
        });
    }).catch(() => {
        // Sentry not available
    });
};

export default {
    initMonitoring,
    logError,
    logMessage,
    setUserContext,
    clearUserContext,
    addBreadcrumb,
    logEvent,
};
