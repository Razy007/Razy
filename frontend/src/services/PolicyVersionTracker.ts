/**
 * Policy Version Tracker
 * Tracks which version of Privacy Policy and Terms of Service the user has seen
 * Triggers notifications when policy documents are updated
 */

export interface PolicyVersions {
  privacy: string;
  terms: string;
}

// ✅ CURRENT VERSIONS - Update these when policies change
export const CURRENT_POLICY_VERSIONS: PolicyVersions = {
  privacy: '2025-01-07',  // Date d'effet actuelle
  terms: '2025-01-07'     // Date d'effet actuelle
};

const STORAGE_KEY = 'pi_academy_policy_versions_seen';

/**
 * Get last policy versions seen by user
 */
export const getLastSeenVersions = (): PolicyVersions | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as PolicyVersions;
    }
  } catch (e) {
    console.error('[PolicyTracker] Error reading versions:', e);
  }
  return null;
};

/**
 * Mark current policy versions as seen
 */
export const markPoliciesAsSeen = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(CURRENT_POLICY_VERSIONS));
    console.log('[PolicyTracker] Policies marked as seen:', CURRENT_POLICY_VERSIONS);
  } catch (e) {
    console.error('[PolicyTracker] Error saving versions:', e);
  }
};

/**
 * Check if user needs to be notified about policy updates
 */
export const checkForPolicyUpdates = (): {
  privacyUpdated: boolean;
  termsUpdated: boolean;
  needsNotification: boolean;
} => {
  const lastSeen = getLastSeenVersions();

  // First time user - no notification needed
  if (!lastSeen) {
    return {
      privacyUpdated: false,
      termsUpdated: false,
      needsNotification: false
    };
  }

  const privacyUpdated = lastSeen.privacy !== CURRENT_POLICY_VERSIONS.privacy;
  const termsUpdated = lastSeen.terms !== CURRENT_POLICY_VERSIONS.terms;

  return {
    privacyUpdated,
    termsUpdated,
    needsNotification: privacyUpdated || termsUpdated
  };
};

/**
 * Mark specific policy as seen
 */
export const markPolicyAsSeen = (type: 'privacy' | 'terms'): void => {
  try {
    const current = getLastSeenVersions() || { privacy: '', terms: '' };
    
    if (type === 'privacy') {
      current.privacy = CURRENT_POLICY_VERSIONS.privacy;
    } else {
      current.terms = CURRENT_POLICY_VERSIONS.terms;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    console.log(`[PolicyTracker] ${type} marked as seen:`, current[type]);
  } catch (e) {
    console.error(`[PolicyTracker] Error marking ${type} as seen:`, e);
  }
};

/**
 * Reset policy tracking (for testing or user data reset)
 */
export const resetPolicyTracking = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[PolicyTracker] Policy tracking reset');
  } catch (e) {
    console.error('[PolicyTracker] Error resetting tracking:', e);
  }
};
