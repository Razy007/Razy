// ============================================================================
// ADAPTIVE QUESTION ENGINE
// Selects questions based on user history, difficulty, and learning patterns
// ============================================================================

import { QuizQuestion, QuestionHistoryEntry, LayerType } from '../types';

export class QuestionEngine {
  private static readonly REPEAT_COOLDOWN_DAYS = 3; // Don't repeat questions within 3 days
  private static readonly MAX_CONSECUTIVE_HARD = 2; // Max hard questions in a row
  private static readonly ADAPTIVE_THRESHOLD = 0.7; // 70% accuracy to increase difficulty

  /**
   * Select questions for a quiz session
   * Uses adaptive algorithm based on user history
   */
  static selectQuestions(
    availableQuestions: QuizQuestion[],
    questionHistory: QuestionHistoryEntry[],
    count: number,
    layerId: LayerType
  ): QuizQuestion[] {
    // Filter out recently answered questions
    const recentQuestionIds = this.getRecentQuestionIds(questionHistory);
    const eligibleQuestions = availableQuestions.filter(
      q => !recentQuestionIds.has(q.id)
    );

    // If not enough eligible questions, include some recent ones
    const questionsToUse = eligibleQuestions.length >= count
      ? eligibleQuestions
      : availableQuestions;

    // Calculate user's current performance level
    const userAccuracy = this.calculateRecentAccuracy(questionHistory);
    const preferredDifficulty = this.getPreferredDifficulty(userAccuracy, layerId);

    // Select questions with balanced difficulty
    return this.balancedSelection(questionsToUse, preferredDifficulty, count);
  }

  /**
   * Get IDs of questions answered recently (within cooldown period)
   */
  private static getRecentQuestionIds(
    history: QuestionHistoryEntry[]
  ): Set<string> {
    const cooldownMs = this.REPEAT_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    const cutoffTime = Date.now() - cooldownMs;

    const recentIds = new Set<string>();
    history.forEach(entry => {
      if (entry.timestamp > cutoffTime) {
        recentIds.add(entry.questionId);
      }
    });

    return recentIds;
  }

  /**
   * Calculate user's recent accuracy (last 20 questions)
   */
  private static calculateRecentAccuracy(
    history: QuestionHistoryEntry[]
  ): number {
    const recentHistory = history.slice(-20);
    if (recentHistory.length === 0) return 0.5; // Default 50% for new users

    const correct = recentHistory.filter(h => h.correct).length;
    return correct / recentHistory.length;
  }

  /**
   * Determine preferred difficulty based on accuracy and layer
   */
  private static getPreferredDifficulty(
    accuracy: number,
    layerId: LayerType
  ): QuizQuestion['difficulty'] {
    // Layer-based base difficulty
    const layerDifficulty: Record<LayerType, QuizQuestion['difficulty']> = {
      'discovery': 'easy',
      'comprehension': 'medium',
      'application': 'hard',
      'mastery': 'expert',
      'decision-lab': 'expert'
    };

    const baseDifficulty = layerDifficulty[layerId];

    // Adjust based on user performance
    if (accuracy >= this.ADAPTIVE_THRESHOLD) {
      // User is doing well, can handle harder questions
      const difficultyLevels: QuizQuestion['difficulty'][] = ['easy', 'medium', 'hard', 'expert'];
      const currentIndex = difficultyLevels.indexOf(baseDifficulty);
      return difficultyLevels[Math.min(currentIndex + 1, difficultyLevels.length - 1)];
    } else if (accuracy < 0.5) {
      // User is struggling, provide easier questions
      const difficultyLevels: QuizQuestion['difficulty'][] = ['easy', 'medium', 'hard', 'expert'];
      const currentIndex = difficultyLevels.indexOf(baseDifficulty);
      return difficultyLevels[Math.max(currentIndex - 1, 0)];
    }

    return baseDifficulty;
  }

  /**
   * Select questions with balanced difficulty distribution
   */
  private static balancedSelection(
    questions: QuizQuestion[],
    preferredDifficulty: QuizQuestion['difficulty'],
    count: number
  ): QuizQuestion[] {
    // Group questions by difficulty
    const byDifficulty = this.groupByDifficulty(questions);

    const selected: QuizQuestion[] = [];
    const difficultyOrder = this.getDifficultyOrder(preferredDifficulty);

    // Select questions in order of preference
    for (const difficulty of difficultyOrder) {
      const available = byDifficulty[difficulty] || [];
      const shuffled = this.shuffleArray([...available]);

      for (const question of shuffled) {
        if (selected.length >= count) break;
        
        // Avoid too many consecutive hard questions
        if (this.shouldSkipQuestion(selected, question)) continue;
        
        selected.push(question);
      }

      if (selected.length >= count) break;
    }

    // If still not enough, fill with any remaining questions
    if (selected.length < count) {
      const remaining = questions.filter(q => !selected.includes(q));
      const shuffled = this.shuffleArray(remaining);
      selected.push(...shuffled.slice(0, count - selected.length));
    }

    return this.shuffleArray(selected);
  }

  /**
   * Group questions by difficulty
   */
  private static groupByDifficulty(
    questions: QuizQuestion[]
  ): Record<QuizQuestion['difficulty'], QuizQuestion[]> {
    return questions.reduce((acc, q) => {
      if (!acc[q.difficulty]) acc[q.difficulty] = [];
      acc[q.difficulty].push(q);
      return acc;
    }, {} as Record<QuizQuestion['difficulty'], QuizQuestion[]>);
  }

  /**
   * Get difficulty selection order based on preferred difficulty
   */
  private static getDifficultyOrder(
    preferred: QuizQuestion['difficulty']
  ): QuizQuestion['difficulty'][] {
    const allDifficulties: QuizQuestion['difficulty'][] = ['easy', 'medium', 'hard', 'expert'];
    const preferredIndex = allDifficulties.indexOf(preferred);

    // Prioritize preferred, then adjacent difficulties
    const order: QuizQuestion['difficulty'][] = [preferred];
    
    // Add easier and harder alternately
    for (let i = 1; i < allDifficulties.length; i++) {
      if (preferredIndex - i >= 0) {
        order.push(allDifficulties[preferredIndex - i]);
      }
      if (preferredIndex + i < allDifficulties.length) {
        order.push(allDifficulties[preferredIndex + i]);
      }
    }

    return order;
  }

  /**
   * Check if question should be skipped to maintain balance
   */
  private static shouldSkipQuestion(
    selected: QuizQuestion[],
    question: QuizQuestion
  ): boolean {
    if (question.difficulty !== 'hard' && question.difficulty !== 'expert') {
      return false;
    }

    // Check last N questions
    const recentCount = Math.min(this.MAX_CONSECUTIVE_HARD, selected.length);
    const recent = selected.slice(-recentCount);

    const consecutiveHard = recent.filter(
      q => q.difficulty === 'hard' || q.difficulty === 'expert'
    ).length;

    return consecutiveHard >= this.MAX_CONSECUTIVE_HARD;
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
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
   * Record question answer in history
   */
  static recordAnswer(
    questionId: string,
    courseId: string,
    layerId: LayerType,
    correct: boolean,
    timeTaken?: number
  ): QuestionHistoryEntry {
    return {
      questionId,
      courseId,
      layerId,
      timestamp: Date.now(),
      correct,
      timeTaken
    };
  }

  /**
   * Get question statistics for analytics
   */
  static getQuestionStats(
    questionId: string,
    history: QuestionHistoryEntry[]
  ): {
    attempts: number;
    correctCount: number;
    accuracy: number;
    lastAttempt: number | null;
  } {
    const questionHistory = history.filter(h => h.questionId === questionId);
    const correctCount = questionHistory.filter(h => h.correct).length;

    return {
      attempts: questionHistory.length,
      correctCount,
      accuracy: questionHistory.length > 0 ? correctCount / questionHistory.length : 0,
      lastAttempt: questionHistory.length > 0
        ? Math.max(...questionHistory.map(h => h.timestamp))
        : null
    };
  }
}
