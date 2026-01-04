import { Course, UserProgress } from '../types';

/**
 * SYSTÈME INTELLIGENT DE PROGRESSION
 * Gère le déblocage progressif des cours basé sur le niveau, XP, et courses complétés
 */

export interface UnlockStatus {
    isUnlocked: boolean;
    reason?: string;
    requirements?: {
        level?: { current: number; required: number };
        xp?: { current: number; required: number };
        courses?: { completed: string[]; required: string[] };
    };
}

export class ProgressionSystem {
    /**
     * Vérifie si un cours est débloqué pour l'utilisateur
     */
    static isCourseUnlocked(course: Course, userProgress: UserProgress): UnlockStatus {
        // Premium courses require premium status (handled elsewhere)
        // Basic lock check
        if (course.locked && !course.requiredLevel) {
            return {
                isUnlocked: false,
                reason: 'Ce cours est actuellement verrouillé.'
            };
        }

        const requirements: UnlockStatus['requirements'] = {};
        
        // Check level requirement
        if (course.requiredLevel && userProgress.level < course.requiredLevel) {
            requirements.level = {
                current: userProgress.level,
                required: course.requiredLevel
            };
            return {
                isUnlocked: false,
                reason: `Niveau ${course.requiredLevel} requis`,
                requirements
            };
        }

        // Check XP requirement
        // 🐛 FIX: Utiliser userProgress.xp au lieu de totalPoints pour la vérification
        // totalPoints peut être différent de xp selon comment l'app les met à jour
        const currentXP = userProgress.xp || userProgress.totalPoints || 0;
        if (course.requiredXP && currentXP < course.requiredXP) {
            requirements.xp = {
                current: currentXP,
                required: course.requiredXP
            };
            return {
                isUnlocked: false,
                reason: `${course.requiredXP} XP total requis`,
                requirements
            };
        }

        // Check prerequisite courses
        if (course.requiredCourses && course.requiredCourses.length > 0) {
            const missingCourses = course.requiredCourses.filter(
                reqCourse => !userProgress.completedCourses.includes(reqCourse)
            );
            
            if (missingCourses.length > 0) {
                requirements.courses = {
                    completed: userProgress.completedCourses,
                    required: course.requiredCourses
                };
                return {
                    isUnlocked: false,
                    reason: `Complétez d'abord: ${missingCourses.length} cours prérequis`,
                    requirements
                };
            }
        }

        return { isUnlocked: true };
    }

    /**
     * Calcule la progression d'un cours
     */
    static calculateCourseProgress(course: Course, userProgress: UserProgress): number {
        const completedLayers = userProgress.completedLayers[course.id] || [];
        const totalLayers = course.layers.length;
        
        if (totalLayers === 0) return 0;
        
        return Math.round((completedLayers.length / totalLayers) * 100);
    }

    /**
     * Recommande le prochain cours à suivre
     */
    static recommendNextCourse(allCourses: Course[], userProgress: UserProgress): Course | null {
        // Filter unlocked, non-completed courses
        const availableCourses = allCourses.filter(course => {
            const unlockStatus = this.isCourseUnlocked(course, userProgress);
            const progress = this.calculateCourseProgress(course, userProgress);
            return unlockStatus.isUnlocked && progress < 100;
        });

        if (availableCourses.length === 0) return null;

        // Sort by:
        // 1. Courses already started (progress > 0)
        // 2. Beginner difficulty first
       // 3. Lower XP (easier) first
        return availableCourses.sort((a, b) => {
            const progressA = this.calculateCourseProgress(a, userProgress);
            const progressB = this.calculateCourseProgress(b, userProgress);
            
            // Started courses first
            if (progressA > 0 && progressB === 0) return -1;
            if (progressA === 0 && progressB > 0) return 1;
            
            // Then by difficulty
            const difficultyOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2, 'expert': 3 };
            const diffA = difficultyOrder[a.difficulty || 'beginner'];
            const diffB = difficultyOrder[b.difficulty || 'beginner'];
            
            if (diffA !== diffB) return diffA - diffB;
            
            // Then by XP (easier first)
            return a.totalXp - b.totalXp;
        })[0];
    }

    /**
     * Calcule le niveau suivant basé sur le XP total
     */
    static calculateLevel(totalXP: number): number {
        // Formula: Level = floor(sqrt(XP / 100)) + 1
        // This creates a curve where levels get progressively harder
        return Math.floor(Math.sqrt(totalXP / 100)) + 1;
    }

    /**
     * Calcule le XP requis pour le niveau suivant
     */
    static getXPForNextLevel(currentLevel: number): number {
        // Formula: XP = (level - 1)^2 * 100
        return Math.pow(currentLevel, 2) * 100;
    }

    /**
     * Organise les cours par catégories avec statuts de déblocage
     */
    static organizeCoursesByCategory(
        allCourses: Course[],
        userProgress: UserProgress
    ): Map<string, { course: Course; unlockStatus: UnlockStatus; progress: number }[]> {
        const categorized = new Map<string, any[]>();
        
        allCourses.forEach(course => {
            const unlockStatus = this.isCourseUnlocked(course, userProgress);
            const progress = this.calculateCourseProgress(course, userProgress);
            
            const category = course.category;
            if (!categorized.has(category)) {
                categorized.set(category, []);
            }
            
            categorized.get(category)!.push({
                course,
                unlockStatus,
                progress
            });
        });
        
        // Sort within categories: unlocked first, then by difficulty
        categorized.forEach((courses, category) => {
            courses.sort((a, b) => {
                if (a.unlockStatus.isUnlocked && !b.unlockStatus.isUnlocked) return -1;
                if (!a.unlockStatus.isUnlocked && b.unlockStatus.isUnlocked) return 1;
                
                const difficultyOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2, 'expert': 3 };
                const diffA = difficultyOrder[a.course.difficulty || 'beginner'];
                const diffB = difficultyOrder[b.course.difficulty || 'beginner'];
                
                return diffA - diffB;
            });
        });
        
        return categorized;
    }

    /**
     * Système autonome: Suggère de nouveaux cours basé sur les tendances
     * (À implémenter avec une API AI pour génération automatique)
     */
    static async suggestNewCourses(userProgress: UserProgress): Promise<string[]> {
        // TODO: Intégrer avec Gemini API ou GPT-4
        // Analyser:
        // - Cours complétés de l'utilisateur
        // - Topics tendances dans Pi Network
        // - Gaps dans les connaissances
        
        // Pour l'instant, retourne des suggestions simples
        const completedCourses = userProgress.completedCourses;
        const suggestions: string[] = [];
        
        if (!completedCourses.includes('pi-intro-101')) {
            suggestions.push('Introduction à Pi Network');
        }
        if (completedCourses.includes('pi-intro-101') && !completedCourses.includes('blockchain-fundamentals')) {
            suggestions.push('Blockchain Fundamentals');
        }
        if (completedCourses.includes('blockchain-fundamentals') && !completedCourses.includes('defi-intro')) {
            suggestions.push('Introduction au DeFi');
        }
        
        return suggestions;
    }
}

export default ProgressionSystem;
