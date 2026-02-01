/**
 * ============================================================================
 * PI ACADEMY - CONFIGURATION SÉCURITÉ MONGODB ATLAS
 * ============================================================================
 * 
 * Protection avancée contre les failles de sécurité :
 * - Validation des données
 * - Sanitization anti-injection
 * - Rate limiting par utilisateur
 * - Détection d'anomalies
 * - Chiffrement des données sensibles
 * - Audit logging
 */

const crypto = require('crypto');

// ============================================================================
// CHIFFREMENT DES DONNÉES SENSIBLES
// ============================================================================

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16; // Pour AES, c'est toujours 16

/**
 * Chiffrer les données sensibles (KYC, emails, etc.)
 */
const encrypt = (text) => {
    if (!text) return text;
    
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error('Erreur chiffrement:', error);
        return text;
    }
};

/**
 * Déchiffrer les données sensibles
 */
const decrypt = (text) => {
    if (!text || !text.includes(':')) return text;
    
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        return decrypted.toString();
    } catch (error) {
        console.error('Erreur déchiffrement:', error);
        return text;
    }
};

// ============================================================================
// SANITIZATION ANTI-INJECTION
// ============================================================================

/**
 * Protège contre les injections NoSQL
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'object' || input === null) {
        return input;
    }
    
    // Nettoyer les objets MongoDB particulièrement dangereux
    const dangerousKeys = ['$where', '$regex', '$ne', '$gt', '$lt', '$gte', '$lte'];
    
    const sanitized = {};
    for (const key in input) {
        if (dangerousKeys.includes(key)) {
            console.warn(`⚠️  Tentative d'injection détectée: ${key}`);
            continue;
        }
        
        if (typeof input[key] === 'object' && input[key] !== null) {
            sanitized[key] = sanitizeInput(input[key]);
        } else {
            sanitized[key] = input[key];
        }
    }
    
    return sanitized;
};

/**
 * Valider et nettoyer les données utilisateur
 */
const validateAndSanitize = (data, schema) => {
    const sanitized = {};
    
    for (const field in schema) {
        const value = data[field];
        const rules = schema[field];
        
        // Champ requis
        if (rules.required && (value === undefined || value === null || value === '')) {
            throw new Error(`Le champ ${field} est requis`);
        }
        
        // Type checking
        if (value !== undefined && value !== null) {
            if (rules.type === 'string' && typeof value !== 'string') {
                throw new Error(`${field} doit être une chaîne de caractères`);
            }
            if (rules.type === 'number' && typeof value !== 'number') {
                throw new Error(`${field} doit être un nombre`);
            }
            if (rules.type === 'email' && !isValidEmail(value)) {
                throw new Error(`${field} doit être un email valide`);
            }
            
            // Min/Max length pour strings
            if (rules.type === 'string') {
                if (rules.minLength && value.length < rules.minLength) {
                    throw new Error(`${field} doit contenir au moins ${rules.minLength} caractères`);
                }
                if (rules.maxLength && value.length > rules.maxLength) {
                    throw new Error(`${field} ne peut pas dépasser ${rules.maxLength} caractères`);
                }
            }
            
            // Min/Max value pour numbers
            if (rules.type === 'number') {
                if (rules.min !== undefined && value < rules.min) {
                    throw new Error(`${field} doit être au minimum ${rules.min}`);
                }
                if (rules.max !== undefined && value > rules.max) {
                    throw new Error(`${field} ne peut pas dépasser ${rules.max}`);
                }
            }
            
            // Sanitize
            sanitized[field] = sanitizeInput(value);
        }
    }
    
    return sanitized;
};

// ============================================================================
// VALIDATION EMAIL
// ============================================================================

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// ============================================================================
// DÉTECTION D'ANOMALIES
// ============================================================================

const userActivityMap = new Map();

/**
 * Détecter les activités suspectes (tentatives de fraude)
 */
const detectAnomalies = (userId, action, amount = 0) => {
    const now = Date.now();
    const timeWindow = 60000; // 1 minute
    
    if (!userActivityMap.has(userId)) {
        userActivityMap.set(userId, []);
    }
    
    const userActivity = userActivityMap.get(userId);
    
    // Nettoyer les vieilles entrées
    const recentActivity = userActivity.filter(a => now - a.timestamp < timeWindow);
    
    // Ajouter la nouvelle activité
    recentActivity.push({ action, amount, timestamp: now });
    userActivityMap.set(userId, recentActivity);
    
    // RÈGLES DE DÉTECTION D'ANOMALIES
    
    // 1. Trop d'actions en peu de temps (> 20 actions/minute)
    if (recentActivity.length > 20) {
        return {
            suspicious: true,
            reason: 'Trop d\'actions en peu de temps',
            severity: 'high'
        };
    }
    
    // 2. Montant de transaction suspect (> 1000 Pi en 1 minute)
    const totalAmount = recentActivity
        .filter(a => a.action.includes('stake') || a.action.includes('purchase'))
        .reduce((sum, a) => sum + a.amount, 0);
    
    if (totalAmount > 1000) {
        return {
            suspicious: true,
            reason: 'Montant de transactions anormalement élevé',
            severity: 'critical'
        };
    }
    
    // 3. Actions répétitives identiques (bot?)
    const actionCounts = {};
    recentActivity.forEach(a => {
        actionCounts[a.action] = (actionCounts[a.action] || 0) + 1;
    });
    
    for (const [act, count] of Object.entries(actionCounts)) {
        if (count > 10) {
            return {
                suspicious: true,
                reason: `Action répétée ${count} fois: ${act}`,
                severity: 'medium'
            };
        }
    }
    
    return { suspicious: false };
};

// ============================================================================
// AUDIT LOGGING
// ============================================================================

const auditLog = (userId, action, details = {}) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        userId,
        action,
        ip: details.ip || 'unknown',
        userAgent: details.userAgent || 'unknown',
        success: details.success !== false,
        error: details.error || null
    };
    
    // En production, envoyer à un service de logging (Sentry, CloudWatch, etc.)
    if (process.env.NODE_ENV === 'production') {
        // TODO: Implémenter l'envoi vers service externe
        console.log('[AUDIT]', JSON.stringify(logEntry));
    } else {
        console.log('[AUDIT]', logEntry);
    }
    
    return logEntry;
};

// ============================================================================
// RATE LIMITING PAR UTILISATEUR
// ============================================================================

const userRateLimits = new Map();

/**
 * Vérifier si l'utilisateur a dépassé la limite de requêtes
 */
const checkRateLimit = (userId, action, limit = 100, windowMs = 60000) => {
    const now = Date.now();
    const key = `${userId}:${action}`;
    
    if (!userRateLimits.has(key)) {
        userRateLimits.set(key, []);
    }
    
    const requests = userRateLimits.get(key);
    const recentRequests = requests.filter(timestamp => now - timestamp < windowMs);
    
    if (recentRequests.length >= limit) {
        return {
            allowed: false,
            retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
        };
    }
    
    recentRequests.push(now);
    userRateLimits.set(key, recentRequests);
    
    return { allowed: true };
};

// ============================================================================
// VALIDATION DES TRANSACTIONS FINANCIÈRES
// ============================================================================

/**
 * Valider une transaction avant de l'exécuter
 */
const validateTransaction = (userId, type, amount, userBalance) => {
    const errors = [];
    
    // 1. Vérifier le montant
    if (typeof amount !== 'number' || amount <= 0) {
        errors.push('Montant invalide');
    }
    
    // 2. Vérifier la balance
    if (amount > userBalance) {
        errors.push('Solde insuffisant');
    }
    
    // 3. Limites par type de transaction
    const limits = {
        stake: 100,      // Max 100 Pi par stake
        purchase: 50,    // Max 50 Pi par achat
        withdraw: 200    // Max 200 Pi par retrait
    };
    
    if (limits[type] && amount > limits[type]) {
        errors.push(`Montant maximum pour ${type}: ${limits[type]} Pi`);
    }
    
    // 4. Détecter les anomalies
    const anomaly = detectAnomalies(userId, type, amount);
    if (anomaly.suspicious) {
        errors.push(`Transaction suspecte: ${anomaly.reason}`);
        
        // Bloquer immédiatement si critique
        if (anomaly.severity === 'critical') {
            errors.push('Transaction bloquée pour sécurité');
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    // Chiffrement
    encrypt,
    decrypt,
    
    // Sanitization
    sanitizeInput,
    validateAndSanitize,
    
    // Validation
    isValidEmail,
    validateTransaction,
    
    // Détection d'anomalies
    detectAnomalies,
    
    // Rate limiting
    checkRateLimit,
    
    // Audit
    auditLog
};
