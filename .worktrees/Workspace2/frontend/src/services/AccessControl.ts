// ============================================================================
// ACCESS CONTROL SERVICE
// Determines if a user can access specific layers based on multiple criteria
// ============================================================================

import { LayerType, LayerProgress, EnergyState, AccessControlResult } from '../types';
import { EnergySystem } from './EnergySystem';

export class AccessControl {
  private static readonly COOLDOWN_DURATION = 4 * 60 * 60 * 1000; // 4 hours in ms
  private static readonly FAILURE_THRESHOLD = 3; // Failures before cooldown
  private static readonly MASTERY_SCORE_REQUIRED = 80; // % score to unlock next layer

  /**
   * Check if user can access a specific layer
   */
  static canAccessLayer(
    courseId: string,
    layerId: LayerType,
    energyRequired: number,
    energyState: EnergyState,
    layerProgress: LayerProgress[]
  ): AccessControlResult {
    // 1. Check energy availability
    if (!EnergySystem.hasEnoughEnergy(energyState, energyRequired)) {
      const currentEnergy = EnergySystem.getCurrentEnergy(energyState);
      return {
        allowed: false,
        reason: `Insufficient energy. You need ${energyRequired}⚡ but have ${currentEnergy.current}⚡`,
        energyNeeded: energyRequired - currentEnergy.current
      };
    }

    // 2. Check if layer is unlocked (based on previous layer mastery)
    const unlockCheck = this.checkLayerUnlock(courseId, layerId, layerProgress);
    if (!unlockCheck.allowed) {
      return unlockCheck;
    }

    // 3. Check cooldown (after repeated failures)
    const cooldownCheck = this.checkCooldown(courseId, layerId, layerProgress);
    if (!cooldownCheck.allowed) {
      return cooldownCheck;
    }

    // All checks passed
    return { allowed: true };
  }

  /**
   * Check if layer is unlocked based on previous layer completion
   */
  private static checkLayerUnlock(
    courseId: string,
    layerId: LayerType,
    layerProgress: LayerProgress[]
  ): AccessControlResult {
    const layerOrder: LayerType[] = ['discovery', 'comprehension', 'application', 'mastery'];
    const currentIndex = layerOrder.indexOf(layerId);

    // Discovery is always unlocked
    if (currentIndex === 0) {
      return { allowed: true };
    }

    // Check if previous layer is mastered
    const previousLayerId = layerOrder[currentIndex - 1];
    const previousProgress = layerProgress.find(
      lp => lp.courseId === courseId && lp.layerId === previousLayerId
    );

    if (!previousProgress || !previousProgress.mastered) {
      return {
        allowed: false,
        reason: `You must master the ${previousLayerId} layer first (score ${this.MASTERY_SCORE_REQUIRED}%+)`,
        requiredLayer: previousLayerId
      };
    }

    return { allowed: true };
  }

  /**
   * Check if layer is on cooldown due to repeated failures
   */
  private static checkCooldown(
    courseId: string,
    layerId: LayerType,
    layerProgress: LayerProgress[]
  ): AccessControlResult {
    const progress = layerProgress.find(
      lp => lp.courseId === courseId && lp.layerId === layerId
    );

    if (!progress || !progress.cooldownUntil) {
      return { allowed: true };
    }

    const now = Date.now();
    if (now < progress.cooldownUntil) {
      const remainingMs = progress.cooldownUntil - now;
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);

      return {
        allowed: false,
        reason: `Layer on cooldown. Please wait ${hours}h ${minutes}m before retrying.`,
        cooldownRemaining: remainingSeconds
      };
    }

    return { allowed: true };
  }

  /**
   * Update layer progress after quiz completion
   */
  static updateLayerProgress(
    courseId: string,
    layerId: LayerType,
    score: number,
    totalQuestions: number,
    currentProgress: LayerProgress[]
  ): LayerProgress[] {
    const percentage = (score / totalQuestions) * 100;
    const now = Date.now();

    // Find existing progress or create new
    const existingIndex = currentProgress.findIndex(
      lp => lp.courseId === courseId && lp.layerId === layerId
    );

    const newProgress: LayerProgress = {
      courseId,
      layerId,
      attempts: 1,
      bestScore: percentage,
      lastAttempt: now,
      unlocked: true,
      mastered: percentage >= this.MASTERY_SCORE_REQUIRED,
      cooldownUntil: undefined
    };

    if (existingIndex >= 0) {
      const existing = currentProgress[existingIndex];
      newProgress.attempts = existing.attempts + 1;
      newProgress.bestScore = Math.max(existing.bestScore, percentage);
      newProgress.mastered = newProgress.bestScore >= this.MASTERY_SCORE_REQUIRED;

      // Apply cooldown if user failed multiple times
      if (percentage < this.MASTERY_SCORE_REQUIRED && newProgress.attempts >= this.FAILURE_THRESHOLD) {
        newProgress.cooldownUntil = now + this.COOLDOWN_DURATION;
      }

      // Update existing entry
      const updated = [...currentProgress];
      updated[existingIndex] = newProgress;
      return updated;
    }

    // Add new entry
    return [...currentProgress, newProgress];
  }

  /**
   * Unlock next layer if current is mastered
   */
  static unlockNextLayer(
    courseId: string,
    currentLayerId: LayerType,
    layerProgress: LayerProgress[]
  ): LayerProgress[] {
    const layerOrder: LayerType[] = ['discovery', 'comprehension', 'application', 'mastery'];
    const currentIndex = layerOrder.indexOf(currentLayerId);

    // Check if there's a next layer
    if (currentIndex >= layerOrder.length - 1) {
      return layerProgress; // Already at final layer
    }

    // Check if current layer is mastered
    const currentProgress = layerProgress.find(
      lp => lp.courseId === courseId && lp.layerId === currentLayerId
    );

    if (!currentProgress || !currentProgress.mastered) {
      return layerProgress; // Not mastered yet
    }

    // Unlock next layer
    const nextLayerId = layerOrder[currentIndex + 1];
    const nextExists = layerProgress.some(
      lp => lp.courseId === courseId && lp.layerId === nextLayerId
    );

    if (nextExists) {
      return layerProgress; // Already unlocked
    }

    // Create unlocked entry for next layer
    const nextProgress: LayerProgress = {
      courseId,
      layerId: nextLayerId,
      attempts: 0,
      bestScore: 0,
      lastAttempt: 0,
      unlocked: true,
      mastered: false
    };

    return [...layerProgress, nextProgress];
  }

  /**
   * Get layer status for UI display
   */
  static getLayerStatus(
    courseId: string,
    layerId: LayerType,
    layerProgress: LayerProgress[]
  ): {
    unlocked: boolean;
    mastered: boolean;
    attempts: number;
    bestScore: number;
    onCooldown: boolean;
    cooldownRemaining?: number;
  } {
    const progress = layerProgress.find(
      lp => lp.courseId === courseId && lp.layerId === layerId
    );

    if (!progress) {
      // Discovery layer is always unlocked by default
      return {
        unlocked: layerId === 'discovery',
        mastered: false,
        attempts: 0,
        bestScore: 0,
        onCooldown: false
      };
    }

    const onCooldown = progress.cooldownUntil ? Date.now() < progress.cooldownUntil : false;
    const cooldownRemaining = progress.cooldownUntil && onCooldown
      ? Math.ceil((progress.cooldownUntil - Date.now()) / 1000)
      : undefined;

    return {
      unlocked: progress.unlocked,
      mastered: progress.mastered,
      attempts: progress.attempts,
      bestScore: progress.bestScore,
      onCooldown,
      cooldownRemaining
    };
  }

  /**
   * Reset cooldown (admin function or premium feature)
   */
  static resetCooldown(
    courseId: string,
    layerId: LayerType,
    layerProgress: LayerProgress[]
  ): LayerProgress[] {
    return layerProgress.map(lp => {
      if (lp.courseId === courseId && lp.layerId === layerId) {
        return { ...lp, cooldownUntil: undefined };
      }
      return lp;
    });
  }

  /**
   * Get overall course progress percentage
   */
  static getCourseProgress(
    courseId: string,
    layerProgress: LayerProgress[]
  ): number {
    const layerOrder: LayerType[] = ['discovery', 'comprehension', 'application', 'mastery'];
    const courseProgress = layerProgress.filter(lp => lp.courseId === courseId);

    if (courseProgress.length === 0) return 0;

    const totalScore = courseProgress.reduce((sum, lp) => sum + lp.bestScore, 0);
    return Math.round(totalScore / layerOrder.length);
  }
}
