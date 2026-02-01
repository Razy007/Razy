"use strict";
/**
 * 🔐 QUIZ ANSWERS - SERVER ONLY
 * ⚠️ NEVER expose this file to client-side code
 *
 * This file contains the actual correct answers for all quiz questions.
 * It will ONLY be deployed to Firebase Cloud Functions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUIZ_ANSWERS = void 0;
exports.getCorrectAnswer = getCorrectAnswer;
/**
 * Quiz answers indexed by courseId-lessonId
 * Example: 'pi-intro-l2' contains all answers for Pi Intro Lesson 2
 */
exports.QUIZ_ANSWERS = {
    // ========================================
    // COURS 1: INTRODUCTION À PI NETWORK (50 QUESTIONS)
    // ========================================
    'pi-intro-l2': [
        // EASY (20 questions) - 30 seconds each
        { questionId: 'q-pi-intro-1', correctAnswer: 0, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-2', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-3', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-4', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-5', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-6', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-7', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-8', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-9', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-10', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-11', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-12', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-13', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-14', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-15', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-16', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-17', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-18', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-19', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-pi-intro-20', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        // MEDIUM (20 questions) - 45 seconds each
        { questionId: 'q-pi-intro-21', correctAnswer: 0, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-22', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-23', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-24', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-25', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-26', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-27', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-28', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-29', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-30', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-31', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-32', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-33', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-34', correctAnswer: 2, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-35', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-36', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-37', correctAnswer: 0, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-38', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-39', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-pi-intro-40', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        // HARD (10 questions) - 60 seconds each
        { questionId: 'q-pi-intro-41', correctAnswer: 1, difficulty: 'hard', maxTime: 60 },
        { questionId: 'q-pi-intro-42', correctAnswer: 1, difficulty: 'hard', maxTime: 60 },
        { questionId: 'q-pi-intro-43', correctAnswer: 1, difficulty: 'hard', maxTime: 60 },
        { questionId: 'q-pi-intro-44', correctAnswer: 0, difficulty: 'hard', maxTime: 60 },
        { questionId: 'q-pi-intro-45', correctAnswer: 0, difficulty: 'hard', maxTime: 60 },
        { questionId: 'q-pi-intro-46', correctAnswer: 0, difficulty: 'hard', maxTime: 60 },
        { questionId: 'q-pi-intro-47', correctAnswer: 1, difficulty: 'hard', maxTime: 60 },
        { questionId: 'q-pi-intro-48', correctAnswer: 0, difficulty: 'hard', maxTime: 60 },
        { questionId: 'q-pi-intro-49', correctAnswer: 0, difficulty: 'hard', maxTime: 60 },
        { questionId: 'q-pi-intro-50', correctAnswer: 0, difficulty: 'hard', maxTime: 60 },
    ],
    // ========================================
    // COURS 2: PI WALLET MASTERY (10 QUESTIONS)
    // ========================================
    'wallet-l2-comprehension': [
        { questionId: 'q-wallet-1', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-wallet-2', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-wallet-3', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-wallet-4', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        // Medium
        { questionId: 'q-wallet-5', correctAnswer: 2, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-wallet-6', correctAnswer: 2, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-wallet-7', correctAnswer: 2, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-wallet-8', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        // Hard
        { questionId: 'q-wallet-9', correctAnswer: 1, difficulty: 'hard', maxTime: 60 },
        { questionId: 'q-wallet-10', correctAnswer: 1, difficulty: 'hard', maxTime: 60 },
    ],
    // ========================================
    // COURS 3: ANTI-SCAM DEFENSE (10 QUESTIONS)
    // ========================================
    'safety-l2': [
        // Easy
        { questionId: 'q-scam-1', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-scam-2', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-scam-3', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-scam-4', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        // Medium
        { questionId: 'q-scam-5', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-scam-6', correctAnswer: 2, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-scam-7', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-scam-8', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        // Hard
        { questionId: 'q-scam-9', correctAnswer: 1, difficulty: 'hard', maxTime: 60 },
        { questionId: 'q-scam-10', correctAnswer: 1, difficulty: 'hard', maxTime: 60 }
    ],
    // ========================================
    // COURS 4: KYC VERIFICATION (10 QUESTIONS)
    // ========================================
    'kyc-l2': [
        // Easy
        { questionId: 'q-kyc-1', correctAnswer: 1, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-kyc-2', correctAnswer: 0, difficulty: 'easy', maxTime: 30 }, // Yoti
        { questionId: 'q-kyc-3', correctAnswer: 2, difficulty: 'easy', maxTime: 30 },
        { questionId: 'q-kyc-4', correctAnswer: 0, difficulty: 'easy', maxTime: 30 },
        // Medium
        { questionId: 'q-kyc-5', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-kyc-6', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-kyc-7', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        { questionId: 'q-kyc-8', correctAnswer: 1, difficulty: 'medium', maxTime: 45 },
        // Hard
        { questionId: 'q-kyc-9', correctAnswer: 1, difficulty: 'hard', maxTime: 60 },
        { questionId: 'q-kyc-10', correctAnswer: 1, difficulty: 'hard', maxTime: 60 }
    ]
};
/**
 * Get the correct answer for a specific question
 */
function getCorrectAnswer(courseId, lessonId, questionId) {
    const quizKey = `${courseId}-${lessonId}`;
    const answers = exports.QUIZ_ANSWERS[quizKey];
    // Try finding in other keys if exact match not found (handling 'safety-l2' where lessonId might differ in calling code)
    if (!answers) {
        // Fallback search in all keys
        for (const key in exports.QUIZ_ANSWERS) {
            const found = exports.QUIZ_ANSWERS[key].find(a => a.questionId === questionId);
            if (found)
                return found;
        }
        console.error(`No answers found for quiz: ${quizKey}`);
        return null;
    }
    const answer = answers.find(a => a.questionId === questionId);
    if (!answer) {
        console.error(`No answer found for question: ${questionId} in quiz: ${quizKey}`);
        return null;
    }
    return answer;
}
//# sourceMappingURL=quizAnswers.js.map