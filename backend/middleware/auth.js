import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'pi_academy_secret_key_change_in_production';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate JWT token
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Token d\'authentification manquant',
            code: 'NO_TOKEN'
        });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
        return res.status(403).json({
            success: false,
            error: 'Token invalide ou expiré',
            code: 'INVALID_TOKEN'
        });
    }

    req.user = decoded;
    next();
};

/**
 * KYC verification middleware
 * Requires user to have verified KYC status
 */
export const requireKYC = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentification requise',
            code: 'NO_AUTH'
        });
    }

    if (!req.user.kycVerified) {
        return res.status(403).json({
            success: false,
            error: 'KYC vérifié requis pour cette fonctionnalité',
            code: 'KYC_REQUIRED',
            requiredStatus: 'pioneer_kyc',
            message: 'Complétez votre vérification KYC pour accéder à cette fonctionnalité.'
        });
    }

    next();
};

/**
 * Pioneer status middleware
 * Requires user to be at least a Pioneer (not guest)
 */
export const requirePioneer = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentification requise',
            code: 'NO_AUTH'
        });
    }

    if (req.user.authStatus === 'guest') {
        return res.status(403).json({
            success: false,
            error: 'Compte Pioneer requis',
            code: 'PIONEER_REQUIRED',
            requiredStatus: 'pioneer_non_kyc',
            message: 'Connectez-vous avec Pi Network pour accéder à cette fonctionnalité.'
        });
    }

    next();
};

/**
 * Get user-friendly message based on status and feature
 */
const getUserStatusMessage = (userStatus, feature) => {
    if (userStatus === 'guest') {
        return `Connectez-vous avec Pi Network pour accéder à ${feature}.`;
    }
    if (userStatus === 'pioneer_non_kyc') {
        return `Complétez votre KYC pour débloquer toutes les fonctionnalités de ${feature}.`;
    }
    return 'Accès refusé.';
};

/**
 * Access control middleware factory
 * Checks if user has access to specific feature/action
 */
export const requireAccess = (feature, action) => {
    const ACCESS_MATRIX = {
        guest: {
            staking: { canStake: false },
            shop: { canBuy: false, canBuyEnergy: false },
            social: { post: false, comment: false },
            earnings: { canWithdraw: false }
        },
        pioneer_non_kyc: {
            staking: { canStake: true, maxStakeAmount: 0.05 },
            shop: { canBuy: true, canBuyEnergy: true },
            social: { post: true, comment: true },
            earnings: { canWithdraw: true, withdrawLimit: 0.01 }
        },
        pioneer_kyc: {
            staking: { canStake: true, maxStakeAmount: null },
            shop: { canBuy: true, canBuyEnergy: true },
            social: { post: true, comment: true },
            earnings: { canWithdraw: true, withdrawLimit: null }
        }
    };

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentification requise',
                code: 'NO_AUTH'
            });
        }

        // Determine user status
        const userStatus = req.user.kycVerified ? 'pioneer_kyc' :
                          req.user.authStatus === 'pioneer' ? 'pioneer_non_kyc' : 'guest';

        const access = ACCESS_MATRIX[userStatus];
        
        if (!access || !access[feature] || !access[feature][action]) {
            return res.status(403).json({
                success: false,
                error: `Accès refusé: ${feature}.${action}`,
                code: 'ACCESS_DENIED',
                userStatus,
                requiredAction: 'upgrade_account',
                message: getUserStatusMessage(userStatus, feature)
            });
        }

        // Attach access limits to request for further validation
        req.accessLimits = access[feature];
        next();
    };
};
