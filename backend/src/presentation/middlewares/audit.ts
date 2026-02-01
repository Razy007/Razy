import { Request, Response, NextFunction } from 'express';
import { AuditLogger, AuditAction, extractRequestInfo } from '../../infrastructure/services/AuditLogger';

/**
 * Middleware to automatically log API requests for audit trail
 */
export const auditMiddleware = (action: AuditAction | string, resourceType?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const { ipAddress, userAgent } = extractRequestInfo(req);
    const user = (req as any).user;
    
    // Store original json method to intercept response
    const originalJson = res.json.bind(res);
    
    res.json = (body: any) => {
      const duration = Date.now() - startTime;
      const status = res.statusCode >= 400 ? 'failure' : 'success';
      
      try {
        const logger = AuditLogger.getInstance();
        logger.log({
          userId: user?.id,
          action,
          resourceType: resourceType || extractResourceType(req.path),
          resourceId: extractResourceId(req),
          ipAddress,
          userAgent,
          metadata: {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            // Don't log sensitive fields
            bodyKeys: Object.keys(req.body || {}).filter(k => !['password', 'accessToken', 'token'].includes(k))
          },
          status
        });
      } catch (e) {
        // Don't fail request if logging fails
        console.error('[AuditMiddleware] Logging failed:', e);
      }
      
      return originalJson(body);
    };
    
    next();
  };
};

/**
 * Middleware to log security events
 */
export const securityEventMiddleware = (eventType: string, severity: 'low' | 'medium' | 'high' | 'critical') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { ipAddress, userAgent } = extractRequestInfo(req);
    const user = (req as any).user;
    
    try {
      const logger = AuditLogger.getInstance();
      await logger.logSecurityEvent({
        eventType,
        userId: user?.id,
        ipAddress,
        details: {
          path: req.path,
          method: req.method,
          userAgent
        },
        severity
      });
    } catch (e) {
      console.error('[SecurityMiddleware] Event logging failed:', e);
    }
    
    next();
  };
};

/**
 * Log specific actions after they complete
 */
export const logAuditEvent = async (
  req: Request,
  action: AuditAction | string,
  resourceType: string,
  resourceId?: string,
  metadata?: Record<string, any>,
  status: 'success' | 'failure' = 'success'
) => {
  const { ipAddress, userAgent } = extractRequestInfo(req);
  const user = (req as any).user;
  
  try {
    const logger = AuditLogger.getInstance();
    await logger.logImmediate({
      userId: user?.id,
      action,
      resourceType,
      resourceId,
      ipAddress,
      userAgent,
      metadata,
      status
    });
  } catch (e) {
    console.error('[AuditHelper] Logging failed:', e);
  }
};

// Helper functions
function extractResourceType(path: string): string {
  const parts = path.split('/').filter(p => p && p !== 'api');
  return parts[0] || 'unknown';
}

function extractResourceId(req: Request): string | undefined {
  // Look for ID in params or body
  return req.params.id || 
         req.params.stakingId || 
         req.params.postId || 
         req.params.userId ||
         req.body.id ||
         undefined;
}
