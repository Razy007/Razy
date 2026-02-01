import { QuizQuestion, UserProgress } from '../../types';

const ROTATION_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export const QuestionEngine = {
    /**
     * Selects a batch of questions for a session.
     */
    selectQuestionsForSession(
        allQuestions: QuizQuestion[],
        userProgress: UserProgress,
        count: number = 5
    ): QuizQuestion[] {
        // Convert array history to latest entry map for easy lookup
        const historyMap = new Map<string, any>();
        if (Array.isArray(userProgress.questionHistory)) {
            userProgress.questionHistory.forEach(entry => {
                const existing = historyMap.get(entry.questionId);
                if (!existing || entry.timestamp > existing.timestamp) {
                    historyMap.set(entry.questionId, entry);
                }
            });
        }

        const now = Date.now();

        // 1. Filter out inappropriate questions
        let candidates = [...allQuestions];

        // 2. Sort by priority
        candidates.sort((a, b) => {
            const histA = historyMap.get(a.id);
            const histB = historyMap.get(b.id);

            // If never seen, highest priority
            if (!histA && !histB) return 0;
            if (!histA) return -1;
            if (!histB) return 1;

            // If answered, check performance
            // If A was wrong and B was correct, prioritize A
            if (!histA.correct && histB.correct) return -1;
            if (histA.correct && !histB.correct) return 1;

            // Otherwise, prioritize oldest interaction
            return histA.timestamp - histB.timestamp; 
        });

        // 3. Filter out recent repeats
        const validQuestions = candidates.filter(q => {
            const h = historyMap.get(q.id);
            if (!h) return true; // Never seen
            
            // If answered correctly, enforce cooldown
            if (h.correct && (now - h.timestamp) < ROTATION_COOLDOWN_MS) {
                return false;
            }
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
