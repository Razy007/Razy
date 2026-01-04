import { QuizQuestion, UserProgress } from '../../types';

const ROTATION_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export const QuestionEngine = {
    /**
     * Selects a batch of questions for a session.
     * Prioritizes:
     * 1. Unanswered questions
     * 2. Questions answered incorrectly > 24h ago
     * 3. Questions answered correctly long ago (Review)
     */
    selectQuestionsForSession(
        allQuestions: QuizQuestion[],
        userProgress: UserProgress,
        count: number = 5
    ): QuizQuestion[] {
        const history = userProgress.questionHistory || {};
        const now = Date.now();

        // 1. Filter out locked or inappropriate questions (placeholder for future logic)
        let candidates = allQuestions;

        // 2. Sort by priority
        candidates.sort((a, b) => {
            const histA = history[a.id];
            const histB = history[b.id];

            // If never seen, highest priority
            if (!histA && !histB) return 0;
            if (!histA) return -1;
            if (!histB) return 1;

            // If answered constantly, check cooldown
            const timeSinceA = now - histA.lastAnswered;
            const timeSinceB = now - histB.lastAnswered;

            // If A was wrong and B was correct, prioritize A
            if (!histA.correct && histB.correct) return -1;
            if (histA.correct && !histB.correct) return 1;

            // Otherwise, prioritize oldest interaction
            return timeSinceB - timeSinceA; // Descending order of time (longest gap first)
        });

        // 3. Filter out recent repeats (Rotation Logic)
        const validQuestions = candidates.filter(q => {
            const h = history[q.id];
            if (!h) return true; // Never seen
            
            // If answered correctly, enforce cooldown
            if (h.correct && (now - h.lastAnswered) < ROTATION_COOLDOWN_MS) {
                return false;
            }
            // If wrong, allow retry sooner (e.g. 1 hour or immediate in different mode)
            // For now, let's keep them available but maybe deprioritized by sort
            return true;
        });

        return validQuestions.slice(0, count);
    },

    /**
     * Returns the next difficulty level based on performance.
     */
    getNextDifficulty(currentDiff: string, successRate: number): 'easy' | 'medium' | 'hard' | 'expert' {
        if (successRate > 0.8) {
            if (currentDiff === 'easy') return 'medium';
            if (currentDiff === 'medium') return 'hard';
            if (currentDiff === 'hard') return 'expert';
        }
        if (successRate < 0.4) {
            if (currentDiff === 'expert') return 'hard';
            if (currentDiff === 'hard') return 'medium';
            if (currentDiff === 'medium') return 'easy';
        }
        return currentDiff as any;
    }
};
