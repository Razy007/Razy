/**
 * 🚀 UNLOCK VALIDATOR - Système de Déblocage de Cours
 * 
 * Objectifs:
 * - Règles claires de déblocage (niveau, XP, prérequis)
 * - Synchronisation automatique XP ↔ Niveau
 * - Prévention des états bloquants
 * - Progression fluide et motivante
 */

export interface CourseUnlockRequirements {
    minLevel: number;           // Niveau minimum requis
    minXP?: number;             // XP minimum (optionnel, généralement basé sur niveau)
    prerequisiteCourses: string[]; // IDs des cours à compléter d'abord
    minCompletionRate: number;  // % de réussite minimum (ex: 80%)
    isPremium?: boolean;        // Nécessite le statut Premium
}

export interface UnlockStatus {
    isUnlocked: boolean;
    reason?: string;            // Raison du blocage si non débloqué
    progress: number;           // Progression vers déblocage (0-100%)
    missingRequirements: {
        level?: number;         // Niveaux manquants
        xp?: number;            // XP manquants
        courses?: string[];     // Cours prérequis manquants
        premium?: boolean;      // Premium requis
    };
}

/**
 * Formule de progression XP → Niveau
 * Progression non linéaire pour maintenir l'engagement
 * 
 * Formule: XP(N) = 100 * N + 50 * (N-1)²
 * 
 * Exemples:
 * - Niveau 1: 100 XP
 * - Niveau 2: 250 XP (+150)
 * - Niveau 3: 450 XP (+200)
 * - Niveau 4: 700 XP (+250)
 * - Niveau 5: 1000 XP (+300)
 * - Niveau 10: 5050 XP
 * - Niveau 11: 6100 XP
 * - Niveau 20: 28100 XP
 */

export const UnlockValidator = {
    /**
     * Calculer le niveau depuis XP total
     */
    calculateLevelFromXP(totalXP: number): { level: number; xpToNext: number; xpForCurrentLevel: number } {
        let level = 1;
        let xpNeeded = 0;
        let previousXP = 0;
        
        // Chercher le niveau correspondant aux XP
        while (true) {
            const xpForLevel = this.getXPRequiredForLevel(level);
            if (totalXP < xpForLevel) {
                break;
            }
            previousXP = xpNeeded;
            xpNeeded = xpForLevel;
            level++;
        }
        
        // Ajuster car la boucle dépasse d'1 niveau
        level = Math.max(1, level - 1);
        const xpForCurrentLevel = this.getXPRequiredForLevel(level);
        const xpForNextLevel = this.getXPRequiredForLevel(level + 1);
        const xpToNext = xpForNextLevel - totalXP;
        
        return {
            level,
            xpToNext: Math.max(0, xpToNext),
            xpForCurrentLevel
        };
    },
    
    /**
     * Calculer XP requis pour atteindre un niveau donné
     */
    getXPRequiredForLevel(level: number): number {
        if (level <= 1) return 0;
        
        // Formule: XP(N) = 100 * N + 50 * (N-1)²
        return 100 * level + 50 * Math.pow(level - 1, 2);
    },
    
    /**
     * Vérifier si un cours est débloqué pour l'utilisateur
     */
    checkCourseUnlock(
        courseRequirements: CourseUnlockRequirements,
        userLevel: number,
        userXP: number,
        completedCourses: string[],
        isPremium: boolean
    ): UnlockStatus {
        const missing: UnlockStatus['missingRequirements'] = {};
        let isUnlocked = true;
        let reason = '';
        let progress = 0;
        let totalRequirements = 0;
        let metRequirements = 0;
        
        // 1. Vérifier niveau minimum
        totalRequirements++;
        if (userLevel >= courseRequirements.minLevel) {
            metRequirements++;
        } else {
            isUnlocked = false;
            missing.level = courseRequirements.minLevel - userLevel;
            reason = `Niveau ${courseRequirements.minLevel} requis (actuellement niveau ${userLevel})`;
        }
        
        // 2. Vérifier XP minimum si spécifié
        if (courseRequirements.minXP) {
            totalRequirements++;
            if (userXP >= courseRequirements.minXP) {
                metRequirements++;
            } else {
                isUnlocked = false;
                missing.xp = courseRequirements.minXP - userXP;
                reason = reason || `${courseRequirements.minXP} XP requis (actuellement ${userXP} XP)`;
            }
        }
        
        // 3. Vérifier cours prérequis
        if (courseRequirements.prerequisiteCourses.length > 0) {
            totalRequirements++;
            const missingCourses = courseRequirements.prerequisiteCourses.filter(
                courseId => !completedCourses.includes(courseId)
            );
            
            if (missingCourses.length === 0) {
                metRequirements++;
            } else {
                isUnlocked = false;
                missing.courses = missingCourses;
                reason = reason || `Complétez d'abord: ${missingCourses.join(', ')}`;
            }
        }
        
        // 4. Vérifier statut Premium si nécessaire
        if (courseRequirements.isPremium) {
            totalRequirements++;
            if (isPremium) {
                metRequirements++;
            } else {
                isUnlocked = false;
                missing.premium = true;
                reason = reason || 'Cours Premium - Statut Premium requis';
            }
        }
        
        // Calculer progression vers déblocage
        progress = totalRequirements > 0 ? (metRequirements / totalRequirements) * 100 : 100;
        
        return {
            isUnlocked,
            reason: isUnlocked ? undefined : reason,
            progress,
            missingRequirements: missing
        };
    },
    
    /**
     * Débloquer automatiquement les cours accessibles
     * Retourne la liste des cours nouvellement débloqués
     */
    autoUnlockCourses(
        allCourses: Array<{ id: string; requirements: CourseUnlockRequirements }>,
        userLevel: number,
        userXP: number,
        completedCourses: string[],
        isPremium: boolean
    ): string[] {
        const newlyUnlocked: string[] = [];
        
        allCourses.forEach(course => {
            const unlockStatus = this.checkCourseUnlock(
                course.requirements,
                userLevel,
                userXP,
                completedCourses,
                isPremium
            );
            
            if (unlockStatus.isUnlocked) {
                // Vérifier si pas déjà dans la liste d'accès
                // (cette logique doit être gérée par le composant appelant)
                newlyUnlocked.push(course.id);
            }
        });
        
        return newlyUnlocked;
    },
    
    /**
     * Synchroniser progression utilisateur (pour resync backend)
     * Recalcule TOUT depuis zéro pour éviter incohérences
     */
    syncUserProgress(
        totalXP: number,
        completedCourses: string[],
        isPremium: boolean
    ): {
        level: number;
        xpToNext: number;
        accessibleCourses: string[];
    } {
        // 1. Recalculer niveau depuis XP
        const { level, xpToNext } = this.calculateLevelFromXP(totalXP);
        
        // 2. Déterminer cours accessibles
        // (Nécessite la liste complète des cours - à passer en paramètre si besoin)
        const accessibleCourses: string[] = [];
        
        return {
            level,
            xpToNext,
            accessibleCourses
        };
    },
    
    /**
     * Générer un message d'aide pour débloquer un cours
     */
    getUnlockHint(unlockStatus: UnlockStatus): string {
        if (unlockStatus.isUnlocked) {
            return '✅ Cours accessible!';
        }
        
        const hints: string[] = [];
        const missing = unlockStatus.missingRequirements;
        
        if (missing.level) {
            hints.push(`📊 Gagnez ${missing.level} niveau${missing.level > 1 ? 'x' : ''} supplémentaire${missing.level > 1 ? 's' : ''}`);
        }
        
        if (missing.xp) {
            hints.push(`⭐ Gagnez ${missing.xp} XP de plus`);
        }
        
        if (missing.courses && missing.courses.length > 0) {
            hints.push(`📚 Complétez ${missing.courses.length} cours prérequis`);
        }
        
        if (missing.premium) {
            hints.push('👑 Passez Premium pour débloquer');
        }
        
        return `🔒 ${unlockStatus.reason}\n\n💡 Pour débloquer:\n${hints.map(h => `  • ${h}`).join('\n')}`;
    },
    
    /**
     * Estimer temps jusqu'au déblocage (basé sur activité moyenne)
     */
    estimateTimeToUnlock(
        unlockStatus: UnlockStatus,
        averageXPPerDay: number = 200
    ): string {
        if (unlockStatus.isUnlocked) return 'Déjà débloqué';
        
        const missing = unlockStatus.missingRequirements;
        
        if (missing.xp && missing.xp > 0) {
            const days = Math.ceil(missing.xp / averageXPPerDay);
            if (days === 0) return 'Quelques heures';
            if (days === 1) return '~1 jour';
            if (days <= 7) return `~${days} jours`;
            return `~${Math.ceil(days / 7)} semaine${days > 14 ? 's' : ''}`;
        }
        
        if (missing.courses && missing.courses.length > 0) {
            return `~${missing.courses.length} jour${missing.courses.length > 1 ? 's' : ''}`;
        }
        
        return 'Impossible à estimer';
    }
};

export default UnlockValidator;
