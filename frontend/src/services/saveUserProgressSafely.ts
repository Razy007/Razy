/**
 * 🔐 SAFE FIREBASE SAVE
 * Only writes to Firebase if progress improved
 * Prevents backend degradation
 */

import { saveUserProfile } from './firebase';
import { shouldSaveProgress } from '../core/HydrationManager';

export interface ProgressData {
  xp: number;
  pi: number;
  completedCourses: string[];
  quizzes: Record<string, any>;
  lastUpdated: number;
  [key: string]: any;
}

/**
 * Save user progress ONLY if there's actual improvement
 * Prevents writing stale/degraded data to Firebase
 */
export async function saveUserProgressSafely(
  uid: string,
  localProgress: ProgressData,
  remoteProgress: ProgressData | null
): Promise<void> {
  // Convert to HydrationManager format
  const local = {
    xp: localProgress.xp || 0,
    pi: localProgress.pi || 0,
    completedCourses: localProgress.completedCourses || [],
    quizzes: localProgress.quizzes || {},
    lastUpdated: localProgress.lastUpdated || Date.now()
  };

  const remote = remoteProgress ? {
    xp: remoteProgress.xp || 0,
    pi: remoteProgress.pi || 0,
    completedCourses: remoteProgress.completedCourses || [],
    quizzes: remoteProgress.quizzes || {},
    lastUpdated: remoteProgress.lastUpdated || Date.now()
  } : null;

  // Check if should save
  if (!shouldSaveProgress(local, remote)) {
    console.log('[SAVE] Skipped - no progress improvement');
    return;
  }

  // Save to Firebase
  console.log('[SAVE] Writing to Firebase (progress improved)');
  await saveUserProfile(uid, {
    userProgress: localProgress,
    // Add other data as needed
  } as any);
}
