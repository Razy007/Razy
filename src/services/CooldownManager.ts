/**
 * SERVICE DE GESTION DES COOLDOWNS
 * Évite le spam et encourage un gameplay sain et réfléchi
 */

export interface LayerCooldown {
    layerId: string;
    completedAt: number; // Timestamp de la dernière completion
    availableAt: number; // Timestamp quand disponible à nouveau
    cooldownMinutes: number; // Durée du cooldown
    attemptCount: number; // Nombre de tentatives successives
    lastResetAt: number; // Quand le compteur a été reset (pour reset après 1h)
}

export class CooldownManager {
    /**
     * Vérifie si un layer est en cooldown
     * @param layerId - ID du layer
     * @param cooldowns - Map des cooldowns actifs
     * @returns true si en cooldown, false sinon
     */
    static isOnCooldown(layerId: string, cooldowns: Record<string, LayerCooldown>): boolean {
        const cooldown = cooldowns[layerId];
        if (!cooldown) return false;
        
        const now = Date.now();
        return now < cooldown.availableAt;
    }

    /**
     * Obtient le temps restant en secondes
     * @param layerId - ID du layer
     * @param cooldowns - Map des cooldowns
     * @returns Secondes restantes (0 si pas de cooldown)
     */
    static getRemainingSeconds(layerId: string, cooldowns: Record<string, LayerCooldown>): number {
        const cooldown = cooldowns[layerId];
        if (!cooldown) return 0;
        
        const now = Date.now();
        if (now >= cooldown.availableAt) return 0;
        
        return Math.ceil((cooldown.availableAt - now) / 1000);
    }

    /**
     * Obtient le temps restant formaté (MM:SS)
     * @param layerId - ID du layer
     * @param cooldowns - Map des cooldowns
     * @returns String formaté "15:30" ou ""
     */
    static getRemainingTimeFormatted(layerId: string, cooldowns: Record<string, LayerCooldown>): string {
        const seconds = this.getRemainingSeconds(layerId, cooldowns);
        if (seconds === 0) return '';
        
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Démarre/met à jour un cooldown pour un layer
     * RÈGLE: 3 tentatives gratuites, cooldown au 4ème essai
     * @param layerId - ID du layer
     * @param cooldownMinutes - Durée en minutes
     * @param existingCooldown - Cooldown existant (pour incrémenter attempts)
     * @returns LayerCooldown object
     */
    static startCooldown(
        layerId: string, 
        cooldownMinutes: number,
        existingCooldown?: LayerCooldown
    ): LayerCooldown {
        const now = Date.now();
        const oneHourMs = 60 * 60 * 1000;
        
        // Si cooldown existe et <1h, incrémenter attempts
        let attemptCount = 1;
        let lastResetAt = now;
        
        if (existingCooldown) {
            const timeSinceReset = now - existingCooldown.lastResetAt;
            
            // Reset counter si > 1h depuis dernier reset
            if (timeSinceReset > oneHourMs) {
                attemptCount = 1;
                lastResetAt = now;
            } else {
                // Incrémenter
                attemptCount = existingCooldown.attemptCount + 1;
                lastResetAt = existingCooldown.lastResetAt;
            }
        }
        
        // 🎯 RÈGLE: Cooldown SEULEMENT après 3 tentatives
        let availableAt = now; // Pas de cooldown par défaut
        
        if (attemptCount >= 3) {
            // 4ème tentative et + = cooldown de 15min
            const cooldownMs = cooldownMinutes * 60 * 1000;
            availableAt = now + cooldownMs;
        }
        
        return {
            layerId,
            completedAt: now,
            availableAt,
            cooldownMinutes,
            attemptCount,
            lastResetAt
        };
    }

    /**
     * Obtient le nombre de tentatives restantes avant cooldown
     * @param layerId - ID du layer
     * @param cooldowns - Map des cooldowns
     * @returns Nombre de tentatives restantes (0-3)
     */
    static getRemainingAttempts(layerId: string, cooldowns: Record<string, LayerCooldown>): number {
        const cooldown = cooldowns[layerId];
        if (!cooldown) return 3; // Première fois = 3 essais
        
        const now = Date.now();
        const timeSinceReset = now - cooldown.lastResetAt;
        const oneHourMs = 60 * 60 * 1000;
        
        // Reset si > 1h
        if (timeSinceReset > oneHourMs) {
            return 3;
        }
        
        // Sinon, calculer restant
        const remaining = 3 - cooldown.attemptCount;
        return Math.max(0, remaining);
    }

    /**
     * Obtient le message d'info sur les tentatives
     * @param layerId - ID du layer
     * @param cooldowns - Map des cooldowns
     * @returns Message formaté "2/3 essais restants"
     */
    static getAttemptsMessage(layerId: string, cooldowns: Record<string, LayerCooldown>): string {
        const remaining = this.getRemainingAttempts(layerId, cooldowns);
        
        if (remaining === 3) return ''; // Pas besoin d'afficher si 3/3
        if (remaining === 0) return ''; // Cooldown actif, autre message
        
        return `${remaining}/3 essais restants`;
    }

    /**
     * Met à jour les cooldowns en retirant ceux expirés
     * @param cooldowns - Map actuelle
     * @returns Map nettoyée
     */
    static cleanExpiredCooldowns(cooldowns: Record<string, LayerCooldown>): Record<string, LayerCooldown> {
        const now = Date.now();
        const cleaned: Record<string, LayerCooldown> = {};
        
        Object.entries(cooldowns).forEach(([layerId, cooldown]) => {
            if (now < cooldown.availableAt) {
                cleaned[layerId] = cooldown;
            }
        });
        
        return cleaned;
    }

    /**
     * Calcule le multiplicateur de XP basé sur le temps écoulé
     * Plus on attend, plus le bonus est grand (encourage la patience)
     * @param layerId - ID du layer
     * @param cooldowns - Map des cooldowns
     * @param baseCooldownMinutes - Cooldown de base
     * @returns Multiplicateur de 1.0 à 1.5
     */
    static getWaitBonusMultiplier(
        layerId: string, 
        cooldowns: Record<string, LayerCooldown>,
        baseCooldownMinutes: number
    ): number {
        const cooldown = cooldowns[layerId];
        if (!cooldown) return 1.0; // Première fois = pas de bonus
        
        const now = Date.now();
        const timeSinceCompletion = now - cooldown.completedAt;
        const baseCooldownMs = baseCooldownMinutes * 60 * 1000;
        
        // Si on a attendu 2x le cooldown de base, bonus max de 50%
        if (timeSinceCompletion >= baseCooldownMs * 2) {
            return 1.5;
        }
        
        // Si on a attendé 1x le cooldown, bonus de 25%
        if (timeSinceCompletion >= baseCooldownMs) {
            return 1.25;
        }
        
        // Sinon, bonus proportionnel
        const ratio = timeSinceCompletion / baseCooldownMs;
        return 1.0 + (ratio * 0.5); // Max 1.5x
    }

    /**
     * Obtient un message d'encouragement pendant le cooldown
     * @param remainingSeconds - Secondes restantes
     * @returns Message motivant
     */
    static getCooldownMessage(remainingSeconds: number): string {
        if (remainingSeconds === 0) return '';
        
        const minutes = Math.floor(remainingSeconds / 60);
        
        if (minutes > 10) {
            return '💡 Profite de ce temps pour explorer d\'autres cours !';
        } else if (minutes > 5) {
            return '🧠 Laisse tes connaissances s\'ancrer. Reviens bientôt !';
        } else if (minutes > 2) {
            return '⏳ Quelques minutes pour bien assimiler...';
        } else {
            return '⚡ Presque prêt ! Prépare-toi...';
        }
    }

    /**
     * Vérifie si l'utilisateur abuse du système (détection de spam)
     * @param cooldowns - Map des cooldowns
     * @param maxAttemptsPerHour - Nombre max de tentatives par heure
     * @returns true si spam détecté
     */
    static detectSpamming(cooldowns: Record<string, LayerCooldown>, maxAttemptsPerHour: number = 20): boolean {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        
        const recentAttempts = Object.values(cooldowns).filter(
            cd => cd.completedAt > oneHourAgo
        );
        
        return recentAttempts.length >= maxAttemptsPerHour;
    }
}
