"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizAnalytics = exports.validateQuizAnswer = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const quizAnswers_1 = require("./quizAnswers");
admin.initializeApp();
const db = admin.firestore();
// ==========================================
// 🛡️ RATE LIMITING & ANTI-SPAM
// ==========================================
const RATE_LIMITS = {
    maxAttemptsPerQuestion: 3, // Max 3 attempts per question
    maxQuestionsPerMinute: 10, // Max 10 questions per minute
    minTimePerQuestion: 5, // Minimum 5 seconds per question
};
/**
 * Check if user is rate-limited
 */
async function checkRateLimit(userId, questionId) {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    // Check attempts on this specific question
    const questionAttemptsRef = db
        .collection('quiz_attempts')
        .where('userId', '==', userId)
        .where('questionId', '==', questionId)
        .where('timestamp', '>', oneMinuteAgo);
    const questionSnapshot = await questionAttemptsRef.get();
    if (questionSnapshot.size >= RATE_LIMITS.maxAttemptsPerQuestion) {
        return {
            allowed: false,
            reason: `Maximum ${RATE_LIMITS.maxAttemptsPerQuestion} attempts per question exceeded`,
        };
    }
    // Check questions per minute
    const recentAttemptsRef = db
        .collection('quiz_attempts')
        .where('userId', '==', userId)
        .where('timestamp', '>', oneMinuteAgo);
    const recentSnapshot = await recentAttemptsRef.get();
    if (recentSnapshot.size >= RATE_LIMITS.maxQuestionsPerMinute) {
        return {
            allowed: false,
            reason: `Maximum ${RATE_LIMITS.maxQuestionsPerMinute} questions per minute exceeded. Slow down!`,
        };
    }
    return { allowed: true };
}
/**
 * Log quiz attempt for rate limiting & analytics
 */
async function logQuizAttempt(userId, questionId, correct, timeSpent) {
    await db.collection('quiz_attempts').add({
        userId,
        questionId,
        correct,
        timeSpent,
        timestamp: Date.now(),
    });
}
// ==========================================
// 🎯 MAIN VALIDATION FUNCTION
// ==========================================
exports.validateQuizAnswer = functions.https.onCall(async (data, context) => {
    try {
        // 1. Authentication Check
        if (!context.auth) {
            return {
                success: false,
                correct: false,
                message: 'Unauthorized: You must be logged in',
            };
        }
        // 2. Validate input data
        const { userId, courseId, lessonId, questionId, selectedAnswer, timeSpent } = data;
        if (!userId || !courseId || !lessonId || !questionId || selectedAnswer === undefined) {
            return {
                success: false,
                correct: false,
                message: 'Invalid request: Missing required fields',
            };
        }
        // 3. Verify userId matches authenticated user
        if (context.auth.uid !== userId) {
            return {
                success: false,
                correct: false,
                message: 'Unauthorized: User ID mismatch',
            };
        }
        // 4. Rate Limiting Check
        const rateLimitCheck = await checkRateLimit(userId, questionId);
        if (!rateLimitCheck.allowed) {
            return {
                success: false,
                correct: false,
                message: rateLimitCheck.reason,
                rateLimitExceeded: true,
            };
        }
        // 5. Get Correct Answer from Server
        const correctAnswerData = (0, quizAnswers_1.getCorrectAnswer)(courseId, lessonId, questionId);
        if (!correctAnswerData) {
            console.error(`Answer not found: ${courseId}-${lessonId}-${questionId}`);
            return {
                success: false,
                correct: false,
                message: 'Question not found',
            };
        }
        // 6. Check Time Constraint
        if (timeSpent < RATE_LIMITS.minTimePerQuestion) {
            await logQuizAttempt(userId, questionId, false, timeSpent);
            return {
                success: false,
                correct: false,
                message: `Too fast! Minimum ${RATE_LIMITS.minTimePerQuestion}s required`,
                timeViolation: true,
            };
        }
        if (timeSpent > correctAnswerData.maxTime) {
            await logQuizAttempt(userId, questionId, false, timeSpent);
            return {
                success: true,
                correct: false,
                message: `Time exceeded! Maximum ${correctAnswerData.maxTime}s allowed`,
                timeViolation: true,
            };
        }
        // 7. Validate Answer
        const isCorrect = selectedAnswer === correctAnswerData.correctAnswer;
        // 8. Log Attempt
        await logQuizAttempt(userId, questionId, isCorrect, timeSpent);
        // 9. Return Result
        return {
            success: true,
            correct: isCorrect,
            message: isCorrect ? 'Correct answer!' : 'Incorrect answer',
        };
    }
    catch (error) {
        console.error('Error validating quiz answer:', error);
        return {
            success: false,
            correct: false,
            message: 'Server error during validation',
        };
    }
});
// ==========================================
// 📊 ANALYTICS FUNCTION (Optional)
// ==========================================
exports.getQuizAnalytics = functions.https.onCall(async (data, context) => {
    if (!context.auth || context.auth.uid !== data.userId) {
        throw new functions.https.HttpsError('unauthenticated', 'Unauthorized');
    }
    const attemptsSnapshot = await db
        .collection('quiz_attempts')
        .where('userId', '==', data.userId)
        .get();
    const totalAttempts = attemptsSnapshot.size;
    const correctAttempts = attemptsSnapshot.docs.filter(doc => doc.data().correct).length;
    return {
        totalAttempts,
        correctAttempts,
        accuracy: totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0,
    };
});
//# sourceMappingURL=index.js.map