/**
 * 🔁 RETRY SYSTEM - Anti-Exploitation & Valeur Pédagogique
 * 
 * Objectifs:
 * - Empêcher retry illimité sans coût
 * - Préserver la valeur des XP/Pi
 * - Encourager l'apprentissage vs la répétition mécanique
 * - Maintenir l'économie de l'application
 */

/**  Interface pour stocker historique des retries d'un layer */
export interface RetryAttempt {
    layerId: string;
    attemptNumber: number;
    timestamp: number;
    score: number;
    earnedXP: number;
    earnedPi: number;
    source?: 'XP' | 'AD' | 'PREMIUM'; // 📊 Source du retry
}

export interface RetryLimitInfo {
    currentAttempt: number; // Numéro de la tentative actuelle
    maxFreeRetries: number; // Nombre de retries gratuits
    costXP: number;         // Coût en XP pour retry suivant (0 si gratuit)
    costPi: number;         // Coût en Pi pour retry suivant (généralement 0)
    rewardMultiplier: number; // Multiplicateur des récompenses (1.0 = 100%, 0.5 = 50%)
    canRetry: boolean;      // Est-ce que le retry est autorisé
    canWatchAd: boolean;    // 📺 Est-ce que la pub est autorisée (Max 1 par quiz)
    message: string;        // Message explicatif pour l'utilisateur
    nextCooldownHours?: number; // Cooldown en heures si applicable
}

export interface RetryHistory {
    [layerId: string]: RetryAttempt[];
}

/**
 * Configuration du système de retry
 */
const RETRY_CONFIG = {
    MAX_FREE_RETRIES: 2,      // 2 tentatives gratuites (total 3 essais dont 1 initial)
    RETRY_COST_TIER_1: 0,     // XP coût pour tentative 1-2 (gratuit)
    RETRY_COST_TIER_2: 50,    // XP coût pour tentative 3
    RETRY_COST_TIER_3: 100,   // XP coût pour tentative 4+
    
    REWARD_MULTIPLIER_FREE: 1.0,    // 100% des gains pour retries gratuits
    REWARD_MULTIPLIER_TIER_2: 1.0,  // 100% des gains pour tentative 3 (Payé = Pas de pénalité)
    REWARD_MULTIPLIER_TIER_3: 1.0,  // 100% des gains pour tentative 4+ (Payé = Pas de pénalité)
    
    COOLDOWN_AFTER_ATTEMPTS: 5,     // Cooldown après X tentatives
    COOLDOWN_HOURS: 24,             // Durée du cooldown en heures
};

export const RetrySystem = {
    /**
     * Obtenir les informations de retry pour un layer spécifique
     */
    getRetryInfo(
        layerId: string, 
        retryHistory: RetryHistory,
        userXP: number,
        isPremium: boolean = false,
        hasWatchedAd: boolean = false,
        isAdNetworkAvailable: boolean = true
    ): RetryLimitInfo {
        const attempts = retryHistory[layerId] || [];
        const attemptNumber = attempts.length + 1; // +1 car c'est le prochain essai
        
        // Premium ou Pub regardée: Retries illimités ou sponsorisés sans coût
        if (isPremium) {
            return {
                currentAttempt: attemptNumber,
                maxFreeRetries: 999,
                costXP: 0,
                costPi: 0,
                rewardMultiplier: 1.0,
                canRetry: true,
                canWatchAd: false, // Premium n'a pas besoin de pub
                message: '✨ Premium: Retries illimités sans coût ni réduction de gains!'
            };
        }

        // Vérifier si une pub a DÉJÀ été utilisée pour ce layer (Max 1 par layer session/historique)
        // Note: L'historique passée ici est persistante. Si on veut "1 par quiz", il faudrait tracker la session,
        // mais "1 par layer" est plus sûr contre le farming.
        const hasUsedAd = attempts.some(a => a.source === 'AD');

        // Si l'utilisateur a regardé une pub pour ce retry SPÉCIFIQUE (flag temporaire de App.tsx)
        if (hasWatchedAd) {
             return {
                currentAttempt: attemptNumber,
                maxFreeRetries: RETRY_CONFIG.MAX_FREE_RETRIES, // On ne change pas le max théorique
                costXP: 0, // Coût annulé
                costPi: 0,
                rewardMultiplier: 0.8, // 📉 ÉCO: 80% des gains uniquement pour ne pas dévaluer l'XP
                canRetry: true,
                canWatchAd: false, // Déjà regardée pour ce tour
                message: '📺 Publicité visionnée : Retry offert (80% des gains)'
            };
        }
        
        // Vérifier cooldown
        if (attempts.length >= RETRY_CONFIG.COOLDOWN_AFTER_ATTEMPTS) {
            const lastAttempt = attempts[attempts.length - 1];
            const hoursSinceLastAttempt = (Date.now() - lastAttempt.timestamp) / (1000 * 60 * 60);
            
            if (hoursSinceLastAttempt < RETRY_CONFIG.COOLDOWN_HOURS) {
                const hoursRemaining = Math.ceil(RETRY_CONFIG.COOLDOWN_HOURS - hoursSinceLastAttempt);
                return {
                    currentAttempt: attemptNumber,
                    maxFreeRetries: RETRY_CONFIG.MAX_FREE_RETRIES,
                    costXP: 0,
                    costPi: 0,
                    rewardMultiplier: 0,
                    canRetry: false,
                    canWatchAd: false,
                    message: `⏰ Cooldown actif: Attendez ${hoursRemaining}h avant de réessayer ce layer.\n\n💡 Profitez-en pour explorer d'autres cours!`,
                    nextCooldownHours: hoursRemaining
                };
            }
        }
        
        // Déterminer coût et multiplicateur basés sur le nombre de tentatives
        let costXP = 0;
        let rewardMultiplier = RETRY_CONFIG.REWARD_MULTIPLIER_FREE;
        let message = '';
        
        if (attemptNumber <= RETRY_CONFIG.MAX_FREE_RETRIES) {
            // Tentatives gratuites
            costXP = RETRY_CONFIG.RETRY_COST_TIER_1;
            rewardMultiplier = RETRY_CONFIG.REWARD_MULTIPLIER_FREE;
            const remaining = RETRY_CONFIG.MAX_FREE_RETRIES - attemptNumber + 1;
            message = `🆓 Retry gratuit (${remaining} restant${remaining > 1 ? 's' : ''})\n\n100% des récompenses maintenues.`;
        } else if (attemptNumber === 3) {
            // 3ème tentative
            costXP = RETRY_CONFIG.RETRY_COST_TIER_2;
            rewardMultiplier = RETRY_CONFIG.REWARD_MULTIPLIER_TIER_2;
            message = `⚠️ Tentative ${attemptNumber}\n\nCoût: ${costXP} XP\nRécompenses: ${(rewardMultiplier * 100).toFixed(0)}% des gains\n\n💡 Conseil: Relisez le contenu avant de réessayer!`;
        } else {
            // 4ème tentative et plus
            costXP = RETRY_CONFIG.RETRY_COST_TIER_3;
            rewardMultiplier = RETRY_CONFIG.REWARD_MULTIPLIER_TIER_3;
            const attemptsUntilCooldown = RETRY_CONFIG.COOLDOWN_AFTER_ATTEMPTS - attemptNumber + 1;
            message = `🔴 Tentative ${attemptNumber}\n\nCoût: ${costXP} XP\nRécompenses: ${(rewardMultiplier * 100).toFixed(0)}% des gains\n\n⚠️ Attention: Cooldown dans ${attemptsUntilCooldown} tentative${attemptsUntilCooldown > 1 ? 's' : ''}`;
        }
        
        // Vérifier si l'utilisateur a assez d'XP
        const canAfford = userXP >= costXP;
        
        if (!canAfford && costXP > 0) {
            message = `❌ XP insuffisant pour retry!\n\nCoût: ${costXP} XP\nVos XP: ${userXP} XP\nManquant: ${costXP - userXP} XP\n\n💡 Complétez d'autres cours pour gagner de l'XP!`;
        }
        
        return {
            currentAttempt: attemptNumber,
            maxFreeRetries: RETRY_CONFIG.MAX_FREE_RETRIES,
            costXP,
            costPi: 0,
            rewardMultiplier,
            canRetry: canAfford,
            canWatchAd: !hasUsedAd && isAdNetworkAvailable, // Autorisé si pas encore utilisé pour ce layer ET disponible globalement
            message
        };
    },
    
    /**
     * Enregistrer une tentative de retry
     */
    recordRetry(
        layerId: string,
        retryHistory: RetryHistory,
        score: number,
        earnedXP: number,
        earnedPi: number,
        source: 'XP' | 'AD' | 'PREMIUM' = 'XP'
    ): RetryHistory {
        const attempts = retryHistory[layerId] || [];
        const newAttempt: RetryAttempt = {
            layerId,
            attemptNumber: attempts.length + 1,
            timestamp: Date.now(),
            score,
            earnedXP,
            earnedPi,
            source
        };
        
        return {
            ...retryHistory,
            [layerId]: [...attempts, newAttempt]
        };
    },
    
    /**
     * Calculer les récompenses ajustées en fonction du retry
     */
    calculateAdjustedRewards(
        baseXP: number,
        basePi: number,
        retryMultiplier: number
    ): { adjustedXP: number; adjustedPi: number } {
        return {
            adjustedXP: Math.floor(baseXP * retryMultiplier),
            adjustedPi: basePi * retryMultiplier
        };
    },
    
    /**
     * Obtenir les statistiques de retry d'un utilisateur
     */
    getRetryStats(retryHistory: RetryHistory): {
        totalRetries: number;
        layersRetried: number;
        averageAttemptsPerLayer: number;
        mostRetriedLayer: string | null;
    } {
        const layers = Object.keys(retryHistory);
        const totalRetries = layers.reduce((sum, layerId) => sum + retryHistory[layerId].length, 0);
        const layersRetried = layers.length;
        
        let mostRetriedLayer: string | null = null;
        let maxRetries = 0;
        
        layers.forEach(layerId => {
            if (retryHistory[layerId].length > maxRetries) {
                maxRetries = retryHistory[layerId].length;
                mostRetriedLayer = layerId;
            }
        });
        
        return {
            totalRetries,
            layersRetried,
            averageAttemptsPerLayer: layersRetried > 0 ? totalRetries / layersRetried : 0,
            mostRetriedLayer
        };
    },
    
    /**
     * Réinitialiser le cooldown d'un layer (admin function)
     */
    resetCooldown(layerId: string, retryHistory: RetryHistory): RetryHistory {
        const updated = { ...retryHistory };
        if (updated[layerId]) {
            // Garder seulement les 2 dernières tentatives
            updated[layerId] = updated[layerId].slice(-2);
        }
        return updated;
    }
};

export default RetrySystem;
