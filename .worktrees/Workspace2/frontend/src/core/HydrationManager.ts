// =========================
// 🛡️ PRODUCTION-GRADE HYDRATION MANAGER
// Anti-regression, deterministic, zero data loss
// =========================

// =========================
// TYPES
// =========================
export type QuizResult = {
  quizId: string;
  score: number;
  total: number;
  completedAt: number;
};

export type UserProgress = {
  xp: number;
  pi: number;
  completedCourses: string[];
  quizzes: Record<string, QuizResult>;
  lastUpdated: number;
};

export type MergeStrategy = 'MAX_PROGRESS_WINS';

// =========================
// MAIN MERGE
// =========================
export function mergeUserProgress(
  local: UserProgress | null,
  remote: UserProgress | null,
  strategy: MergeStrategy
): UserProgress {
  if (!local && !remote) {
    return emptyProgress();
  }
  if (!remote) return local!;
  if (!local) return remote;

  if (strategy !== 'MAX_PROGRESS_WINS') {
    throw new Error('Unsupported merge strategy');
  }

  console.log('[MERGE] MAX_PROGRESS_WINS strategy');
  console.log('[MERGE] Local XP:', local.xp, '| Remote XP:', remote.xp);
  console.log('[MERGE] Local Pi:', local.pi, '| Remote Pi:', remote.pi);

  const merged = {
    xp: Math.max(local.xp, remote.xp),
    pi: Math.max(local.pi, remote.pi),

    completedCourses: Array.from(
      new Set([...local.completedCourses, ...remote.completedCourses])
    ),

    quizzes: mergeQuizzes(local.quizzes, remote.quizzes),

    lastUpdated: Math.max(local.lastUpdated, remote.lastUpdated),
  };

  console.log('[MERGE] ✅ Final XP:', merged.xp, '| Final Pi:', merged.pi);
  return merged;
}

// =========================
// QUIZ MERGE (ANTI-REGRESSION GARANTI)
// =========================
export function mergeQuizzes(
  local: Record<string, QuizResult> = {},
  remote: Record<string, QuizResult> = {}
): Record<string, QuizResult> {
  const merged: Record<string, QuizResult> = {};

  const quizIds = new Set([
    ...Object.keys(local),
    ...Object.keys(remote),
  ]);

  quizIds.forEach(quizId => {
    const l = local[quizId];
    const r = remote[quizId];

    if (!l) {
      merged[quizId] = r;
      return;
    }
    if (!r) {
      merged[quizId] = l;
      return;
    }

    // 🛡️ RÈGLE D'OR : le MEILLEUR score gagne
    if (l.score > r.score) {
      merged[quizId] = l;
      console.log(`[MERGE] Quiz ${quizId}: local score wins (${l.score} > ${r.score})`);
    } else if (r.score > l.score) {
      merged[quizId] = r;
      console.log(`[MERGE] Quiz ${quizId}: remote score wins (${r.score} > ${l.score})`);
    } else {
      // même score → le plus récent
      merged[quizId] = l.completedAt >= r.completedAt ? l : r;
      console.log(`[MERGE] Quiz ${quizId}: same score, taking most recent`);
    }
  });

  return merged;
}

// =========================
// HELPERS
// =========================
export function emptyProgress(): UserProgress {
  return {
    xp: 0,
    pi: 0,
    completedCourses: [],
    quizzes: {},
    lastUpdated: Date.now(),
  };
}

// =========================
// SAFE SAVE (WRITE ONLY IF PROGRESSION ↑)
// =========================
export function shouldSaveProgress(
  local: UserProgress,
  remote: UserProgress | null
): boolean {
  if (!remote) {
    console.log('[SAVE] No remote data → save');
    return true;
  }

  const improved =
    local.xp > remote.xp ||
    local.pi > remote.pi ||
    local.completedCourses.length > remote.completedCourses.length ||
    Object.keys(local.quizzes).length > Object.keys(remote.quizzes).length;

  if (!improved) {
    console.log('[SAVE] No progress improvement → skip save');
    return false;
  }

  console.log('[SAVE] Progress improved → saving to backend');
  return true;
}
