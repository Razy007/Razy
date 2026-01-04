import { UserProgress } from '../../types';

/**
 * 🎮 GAMIFICATION SYSTEM
 * 
 * Système complet de gamification pour maximiser l'engagement et la rétention
 * - Achievements et badges
 * - Combos et streaks
 * - Power-ups et bonus
 * - Défis quotidiens/hebdomadaires
 * - Leaderboard compétitif
 */

// ========== ACHIEVEMENTS ==========
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xpReward: number;
    piReward: number;
    condition: (progress: UserProgress) => boolean;
    progress?: number; // 0-100
    unlocked: boolean;
    unlockedAt?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
    // ========== PROGRESSION ==========
    {
        id: 'first_steps',
        title: '🎯 Premiers Pas',
        description: 'Complétez votre premier layer',
        icon: '🎯',
        rarity: 'common',
        xpReward: 50,
        piReward: 0.0001,
        condition: (p) => Object.keys(p.completedLayers).length > 0,
        unlocked: false
    },
    {
        id: 'knowledge_seeker',
        title: '📚 Chercheur de Savoir',
        description: 'Complétez 5 cours différents',
        icon: '📚',
        rarity: 'rare',
        xpReward: 200,
        piReward: 0.0005,
        condition: (p) => Object.keys(p.completedLayers).length >= 5,
        unlocked: false
    },
    {
        id: 'master_scholar',
        title: '🎓 Érudit Maître',
        description: 'Atteignez le niveau 10',
        icon: '🎓',
        rarity: 'epic',
        xpReward: 500,
        piReward: 0.001,
        condition: (p) => p.level >= 10,
        unlocked: false
    },
    {
        id: 'legend_pioneer',
        title: '👑 Pionnier Légendaire',
        description: 'Atteignez le niveau 25',
        icon: '👑',
        rarity: 'legendary',
        xpReward: 1000,
        piReward: 0.005,
        condition: (p) => p.level >= 25,
        unlocked: false
    },

    // ========== PRÉCISION ==========
    {
        id: 'sharp_mind',
        title: '🎯 Esprit Aiguisé',
        description: 'Obtenez 10 réponses correctes d\'affilée',
        icon: '🎯',
        rarity: 'rare',
        xpReward: 150,
        piReward: 0.0003,
        condition: (p) => p.reputation.precision >= 90,
        unlocked: false
    },
    {
        id: 'perfect_score',
        title: '💯 Score Parfait',
        description: 'Complétez un quiz avec 100% de réussite',
        icon: '💯',
        rarity: 'epic',
        xpReward: 300,
        piReward: 0.0008,
        condition: (p) => p.reputation.precision === 100,
        unlocked: false
    },

    // ========== CONSTANCE ==========
    {
        id: 'dedicated_learner',
        title: '🔥 Apprenant Dévoué',
        description: 'Maintenez un streak de 7 jours',
        icon: '🔥',
        rarity: 'rare',
        xpReward: 250,
        piReward: 0.0005,
        condition: (p) => p.streak >= 7,
        unlocked: false
    },
    {
        id: 'unstoppable',
        title: '⚡ Inarrêtable',
        description: 'Maintenez un streak de 30 jours',
        icon: '⚡',
        rarity: 'epic',
        xpReward: 800,
        piReward: 0.002,
        condition: (p) => p.streak >= 30,
        unlocked: false
    },
    {
        id: 'eternal_flame',
        title: '🌟 Flamme Éternelle',
        description: 'Maintenez un streak de 100 jours',
        icon: '🌟',
        rarity: 'legendary',
        xpReward: 2000,
        piReward: 0.01,
        condition: (p) => p.streak >= 100,
        unlocked: false
    },

    // ========== SÉCURITÉ ==========
    {
        id: 'scam_detector',
        title: '🛡️ Détecteur d\'Arnaques',
        description: 'Répondez correctement à 20 questions de sécurité',
        icon: '🛡️',
        rarity: 'rare',
        xpReward: 200,
        piReward: 0.0004,
        condition: (p) => {
            const securityQuestions = Object.entries(p.questionHistory || {})
                .filter(([id, data]) => id.includes('scam') || id.includes('security'))
                .filter(([_, data]) => data.correct);
            return securityQuestions.length >= 20;
        },
        unlocked: false
    },

    // ========== SOCIAL ==========
    {
        id: 'community_helper',
        title: '🤝 Aide Communautaire',
        description: 'Partagez 10 posts éducatifs',
        icon: '🤝',
        rarity: 'rare',
        xpReward: 150,
        piReward: 0.0003,
        condition: (p) => false, // À implémenter avec le système social
        unlocked: false
    },

    // ========== ÉCONOMIE ==========
    {
        id: 'pi_collector',
        title: '💰 Collectionneur de Pi',
        description: 'Accumulez 1 Pi via l\'apprentissage',
        icon: '💰',
        rarity: 'epic',
        xpReward: 400,
        piReward: 0.001,
        condition: (p) => p.piBalance >= 1,
        unlocked: false
    },
    {
        id: 'pi_whale',
        title: '🐋 Baleine Pi',
        description: 'Accumulez 10 Pi via l\'apprentissage',
        icon: '🐋',
        rarity: 'legendary',
        xpReward: 1500,
        piReward: 0.01,
        condition: (p) => p.piBalance >= 10,
        unlocked: false
    }
];

// ========== COMBOS & STREAKS ==========
export interface ComboState {
    current: number;
    best: number;
    multiplier: number;
    lastAnswerTime: number;
    active: boolean;
}

export class ComboSystem {
    private static readonly COMBO_TIMEOUT_MS = 10000; // 10 secondes entre réponses
    private static readonly COMBO_THRESHOLDS = [
        { count: 3, multiplier: 1.2, label: 'Nice!' },
        { count: 5, multiplier: 1.5, label: 'Great!' },
        { count: 7, multiplier: 2.0, label: 'Amazing!' },
        { count: 10, multiplier: 2.5, label: 'LEGENDARY!' }
    ];

    static updateCombo(
        comboState: ComboState,
        correct: boolean,
        timestamp: number = Date.now()
    ): { newState: ComboState; bonusXp: number; message?: string } {
        if (!correct) {
            // Combo brisé
            return {
                newState: {
                    current: 0,
                    best: comboState.best,
                    multiplier: 1.0,
                    lastAnswerTime: timestamp,
                    active: false
                },
                bonusXp: 0,
                message: comboState.current >= 3 ? '💔 Combo perdu!' : undefined
            };
        }

        // Vérifier le timeout
        const timeSinceLastAnswer = timestamp - comboState.lastAnswerTime;
        const timedOut = comboState.current > 0 && timeSinceLastAnswer > this.COMBO_TIMEOUT_MS;

        if (timedOut) {
            // Timeout - réinitialiser
            return {
                newState: {
                    current: 1,
                    best: comboState.best,
                    multiplier: 1.0,
                    lastAnswerTime: timestamp,
                    active: true
                },
                bonusXp: 0,
                message: '⏱️ Combo timeout - Redémarrage!'
            };
        }

        // Incrémenter le combo
        const newCurrent = comboState.current + 1;
        const newBest = Math.max(newCurrent, comboState.best);

        // Calculer le multiplicateur
        const threshold = [...this.COMBO_THRESHOLDS]
            .reverse()
            .find(t => newCurrent >= t.count);
        const multiplier = threshold?.multiplier || 1.0;
        const message = threshold && newCurrent === threshold.count ? 
            `🔥 ${threshold.label} Combo x${multiplier}!` : undefined;

        // Calculer le bonus XP
        const bonusXp = Math.floor(10 * multiplier * newCurrent);

        return {
            newState: {
                current: newCurrent,
                best: newBest,
                multiplier,
                lastAnswerTime: timestamp,
                active: true
            },
            bonusXp,
            message
        };
    }

    static getComboLabel(count: number): string {
        if (count >= 10) return '🌟 LEGENDARY';
        if (count >= 7) return '⚡ AMAZING';
        if (count >= 5) return '🔥 GREAT';
        if (count >= 3) return '✨ NICE';
        return '';
    }
}

// ========== DAILY CHALLENGES ==========
export interface DailyChallenge {
    id: string;
    title: string;
    description: string;
    icon: string;
    xpReward: number;
    piReward: number;
    progress: number;
    target: number;
    completed: boolean;
    expiresAt: number;
}

export class ChallengeSystem {
    static generateDailyChallenges(userProgress: UserProgress): DailyChallenge[] {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const expiresAt = today.getTime();

        return [
            {
                id: 'daily_questions',
                title: '📝 Quiz Quotidien',
                description: 'Répondez correctement à 10 questions',
                icon: '📝',
                xpReward: 100,
                piReward: 0.0002,
                progress: 0,
                target: 10,
                completed: false,
                expiresAt
            },
            {
                id: 'daily_layer',
                title: '🎯 Layer du Jour',
                description: 'Complétez 1 layer',
                icon: '🎯',
                xpReward: 150,
                piReward: 0.0003,
                progress: 0,
                target: 1,
                completed: false,
                expiresAt
            },
            {
                id: 'daily_perfect',
                title: '💯 Perfection',
                description: 'Obtenez 5 réponses correctes d\'affilée',
                icon: '💯',
                xpReward: 200,
                piReward: 0.0005,
                progress: 0,
                target: 5,
                completed: false,
                expiresAt
            }
        ];
    }

    static generateWeeklyChallenges(userProgress: UserProgress): DailyChallenge[] {
        const nextSunday = new Date();
        nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()));
        nextSunday.setHours(23, 59, 59, 999);
        const expiresAt = nextSunday.getTime();

        return [
            {
                id: 'weekly_courses',
                title: '📚 Marathon Hebdomadaire',
                description: 'Complétez 3 cours complets',
                icon: '📚',
                xpReward: 500,
                piReward: 0.001,
                progress: 0,
                target: 3,
                completed: false,
                expiresAt
            },
            {
                id: 'weekly_streak',
                title: '🔥 Streak Parfait',
                description: 'Connectez-vous 7 jours d\'affilée',
                icon: '🔥',
                xpReward: 400,
                piReward: 0.0008,
                progress: 0,
                target: 7,
                completed: false,
                expiresAt
            },
            {
                id: 'weekly_master',
                title: '🎓 Maîtrise Totale',
                description: 'Atteignez 90% de précision sur 50 questions',
                icon: '🎓',
                xpReward: 600,
                piReward: 0.0015,
                progress: 0,
                target: 50,
                completed: false,
                expiresAt
            }
        ];
    }
}

// ========== POWER-UPS ==========
export interface PowerUp {
    id: string;
    name: string;
    description: string;
    icon: string;
    duration: number; // en millisecondes
    effect: 'double_xp' | 'double_pi' | 'energy_boost' | 'hint' | 'skip';
    multiplier?: number;
    piCost: number;
    active: boolean;
    expiresAt?: number;
}

export const AVAILABLE_POWERUPS: PowerUp[] = [
    {
        id: 'double_xp',
        name: '⚡ Double XP',
        description: 'Doublez vos gains XP pendant 1 heure',
        icon: '⚡',
        duration: 60 * 60 * 1000, // 1 heure
        effect: 'double_xp',
        multiplier: 2,
        piCost: 0.01,
        active: false
    },
    {
        id: 'double_pi',
        name: '💰 Double Pi',
        description: 'Doublez vos gains Pi pendant 1 heure',
        icon: '💰',
        duration: 60 * 60 * 1000,
        effect: 'double_pi',
        multiplier: 2,
        piCost: 0.02,
        active: false
    },
    {
        id: 'energy_boost',
        name: '🔋 Boost d\'Énergie',
        description: 'Restaurez instantanément 50 points d\'énergie',
        icon: '🔋',
        duration: 0,
        effect: 'energy_boost',
        multiplier: 50,
        piCost: 0.005,
        active: false
    },
    {
        id: 'hint',
        name: '💡 Indice',
        description: 'Éliminez 2 mauvaises réponses',
        icon: '💡',
        duration: 0,
        effect: 'hint',
        piCost: 0.001,
        active: false
    },
    {
        id: 'skip',
        name: '⏭️ Passer',
        description: 'Passez une question difficile sans pénalité',
        icon: '⏭️',
        duration: 0,
        effect: 'skip',
        piCost: 0.002,
        active: false
    }
];

// ========== LEADERBOARD ==========
export interface LeaderboardEntry {
    rank: number;
    username: string;
    avatar: string;
    level: number;
    xp: number;
    streak: number;
    piEarned: number;
    badge?: string;
}

export class LeaderboardSystem {
    static calculateRank(userProgress: UserProgress, allUsers: UserProgress[]): number {
        const sorted = allUsers.sort((a, b) => {
            // Trier par niveau, puis XP, puis streak
            if (b.level !== a.level) return b.level - a.level;
            if (b.xp !== a.xp) return b.xp - a.xp;
            return b.streak - a.streak;
        });

        return sorted.findIndex(u => u === userProgress) + 1;
    }

    static getTopPlayers(allUsers: UserProgress[], limit: number = 10): LeaderboardEntry[] {
        return allUsers
            .sort((a, b) => {
                if (b.level !== a.level) return b.level - a.level;
                if (b.xp !== a.xp) return b.xp - a.xp;
                return b.streak - a.streak;
            })
            .slice(0, limit)
            .map((user, index) => ({
                rank: index + 1,
                username: `Pioneer${user.level}`, // À remplacer par le vrai username
                avatar: '👤',
                level: user.level,
                xp: user.xp,
                streak: user.streak,
                piEarned: user.piBalance,
                badge: this.getBadgeForRank(index + 1)
            }));
    }

    private static getBadgeForRank(rank: number): string {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        if (rank <= 10) return '⭐';
        return '';
    }
}

// ========== PROGRESSION VISIBLE ==========
export interface ProgressionMilestone {
    level: number;
    title: string;
    icon: string;
    rewards: {
        xp: number;
        pi: number;
        unlocks?: string[];
    };
}

export const PROGRESSION_MILESTONES: ProgressionMilestone[] = [
    {
        level: 1,
        title: 'Novice Pioneer',
        icon: '🌱',
        rewards: { xp: 0, pi: 0 }
    },
    {
        level: 5,
        title: 'Apprentice Scholar',
        icon: '📖',
        rewards: { xp: 500, pi: 0.001, unlocks: ['Premium Courses'] }
    },
    {
        level: 10,
        title: 'Expert Learner',
        icon: '🎓',
        rewards: { xp: 1000, pi: 0.005, unlocks: ['Advanced Challenges'] }
    },
    {
        level: 15,
        title: 'Master Pioneer',
        icon: '👨‍🎓',
        rewards: { xp: 2000, pi: 0.01, unlocks: ['Exclusive Content'] }
    },
    {
        level: 20,
        title: 'Legendary Scholar',
        icon: '👑',
        rewards: { xp: 5000, pi: 0.05, unlocks: ['VIP Features'] }
    },
    {
        level: 25,
        title: 'Pi Academy Elite',
        icon: '🌟',
        rewards: { xp: 10000, pi: 0.1, unlocks: ['Elite Badge', 'Custom Avatar'] }
    }
];

export class GamificationEngine {
    /**
     * Vérifie et débloque les achievements
     */
    static checkAchievements(
        userProgress: UserProgress,
        unlockedAchievements: Set<string>
    ): Achievement[] {
        const newlyUnlocked: Achievement[] = [];

        for (const achievement of ACHIEVEMENTS) {
            if (unlockedAchievements.has(achievement.id)) continue;
            
            if (achievement.condition(userProgress)) {
                achievement.unlocked = true;
                achievement.unlockedAt = Date.now();
                newlyUnlocked.push(achievement);
                unlockedAchievements.add(achievement.id);
            }
        }

        return newlyUnlocked;
    }

    /**
     * Calcule les récompenses totales avec multiplicateurs
     */
    static calculateRewards(
        baseXp: number,
        basePi: number,
        activePowerUps: PowerUp[],
        comboMultiplier: number = 1.0
    ): { xp: number; pi: number } {
        let xp = baseXp;
        let pi = basePi;

        // Appliquer les power-ups
        for (const powerUp of activePowerUps) {
            if (!powerUp.active) continue;
            
            if (powerUp.effect === 'double_xp' && powerUp.multiplier) {
                xp *= powerUp.multiplier;
            }
            if (powerUp.effect === 'double_pi' && powerUp.multiplier) {
                pi *= powerUp.multiplier;
            }
        }

        // Appliquer le combo
        xp *= comboMultiplier;

        return {
            xp: Math.floor(xp),
            pi: parseFloat(pi.toFixed(6))
        };
    }
}
