/**
 * SERVICE DE RANDOMISATION DES QUESTIONS
 * Évite la monotonie en variant les questions à chaque tentative
 */

import { QuizQuestion } from '../types';

export class QuestionRandomizer {
    /**
     * Sélectionne N questions aléatoires parmi un pool
     * @param allQuestions - Pool complet de questions
     * @param count - Nombre de questions à sélectionner (défaut: 3)
     * @returns Array de questions randomisées
     */
    static selectRandomQuestions(allQuestions: QuizQuestion[], count: number = 3): QuizQuestion[] {
        if (!allQuestions || allQuestions.length === 0) {
            return [];
        }

        // Si le pool a moins de questions que demandé, retourner toutes
        if (allQuestions.length <= count) {
            return this.shuffleArray([...allQuestions]);
        }

        // Créer une copie pour ne pas modifier l'original
        const shuffled = this.shuffleArray([...allQuestions]);
        
        // Prendre les N premières après shuffle
        return shuffled.slice(0, count);
    }

    /**
     * Mélange un array de manière aléatoire (Fisher-Yates shuffle)
     */
    private static shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Sélectionne des questions en garantissant une diversité de difficultés
     * @param allQuestions - Pool complet
     * @param count - Nombre total de questions
     * @returns Array équilibré par difficulté
     */
    static selectBalancedQuestions(allQuestions: QuizQuestion[], count: number = 3): QuizQuestion[] {
        if (!allQuestions || allQuestions.length === 0) return [];
        if (allQuestions.length <= count) {
            return this.shuffleArray([...allQuestions]);
        }

        // Séparer par difficulté
        const easy = allQuestions.filter(q => q.difficulty === 'easy');
        const medium = allQuestions.filter(q => q.difficulty === 'medium');
        const hard = allQuestions.filter(q => q.difficulty === 'hard');

        const selected: QuizQuestion[] = [];

        // Stratégie: 1-2 easy, 1-2 medium, 0-1 hard selon disponibilité
        if (count === 3) {
            // Prendre 1 easy, 1 medium, 1 de n'importe quelle difficulté
            if (easy.length > 0) {
                selected.push(easy[Math.floor(Math.random() * easy.length)]);
            }
            if (medium.length > 0) {
                selected.push(medium[Math.floor(Math.random() * medium.length)]);
            }
            
            // Pour la 3ème, prendre aléatoirement parmi ce qui reste
            const remaining = allQuestions.filter(q => !selected.includes(q));
            if (remaining.length > 0) {
                selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
            }
        } else {
            // Fallback: pure randomisation
            return this.selectRandomQuestions(allQuestions, count);
        }

        // Shuffle final pour ne pas avoir un ordre prévisible
        return this.shuffleArray(selected);
    }

    /**
     * Sélectionne des questions en évitant les répétitions récentes
     * @param allQuestions - Pool complet
     * @param recentQuestionIds - IDs des questions récemment posées
     * @param count - Nombre de questions
     * @returns Array sans répétitions si possible
     */
    static selectAvoidingRecent(
        allQuestions: QuizQuestion[], 
        recentQuestionIds: string[] = [],
        count: number = 3
    ): QuizQuestion[] {
        if (!allQuestions || allQuestions.length === 0) return [];

        // Filtrer les questions récentes
        const fresh = allQuestions.filter(q => !recentQuestionIds.includes(q.id));

        // Si on a assez de questions fraîches, les utiliser
        if (fresh.length >= count) {
            return this.selectRandomQuestions(fresh, count);
        }

        // Sinon, compléter avec les anciennes en randomisant
        const selected = [...fresh];
        const old = allQuestions.filter(q => recentQuestionIds.includes(q.id));
        const needed = count - fresh.length;
        
        if (needed > 0 && old.length > 0) {
            const shuffledOld = this.shuffleArray(old);
            selected.push(...shuffledOld.slice(0, needed));
        }

        return this.shuffleArray(selected);
    }
}
