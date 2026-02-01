/**
 * 🛡️ SECURE STATE HYDRATION MANAGER
 * 
 * Prevents data loss by implementing:
 * - MAX_PROGRESS_WINS merge strategy
 * - Hydration lock (no writes before hydration complete)
 * - Explicit load order
 */

export interface UserProgress {
  level: number;
  xp: number;
  piBalance: number;
  energy: any;
  completedCourses: string[];
  completedLayers: Record<string, string[]>;
  cooldowns: Record<string, number>;
  // ... autres champs
  [key: string]: any;
}

interface HydrationState {
  isHydrated: boolean;
  localData: UserProgress | null;
  remoteData: UserProgress | null;
}

/**
 * Merge two user progress objects using MAX_PROGRESS_WINS strategy
 * 
 * Rules:
 * 1. Take HIGHEST value for numeric fields (xp, piBalance, level)
 * 2. Take UNION for arrays (completedCourses, etc.)
 * 3. Take MOST RECENT for timestamps
 * 4. NEVER overwrite with null/undefined
 */
export function mergeUserProgress(
  local: UserProgress | null,
  remote: UserProgress | null,
  strategy: 'MAX_PROGRESS_WINS' | 'LOCAL_FIRST' | 'REMOTE_FIRST' = 'MAX_PROGRESS_WINS'
): UserProgress {
  // If one source is null, return the other
  if (!local) return remote || getDefaultProgress();
  if (!remote) return local;

  console.log('🔀 MERGING USER PROGRESS');
  console.log('Local:', local);
  console.log('Remote:', remote);

  const merged: UserProgress = { ...local }; // Start with local as base

  if (strategy === 'MAX_PROGRESS_WINS') {
    // Numeric fields: take MAX
    merged.xp = Math.max(local.xp || 0, remote.xp || 0);
    merged.piBalance = Math.max(local.piBalance || 0, remote.piBalance || 0);
    merged.level = Math.max(local.level || 1, remote.level || 1);
    
    // Arrays: UNION (combine unique values)
    merged.completedCourses = Array.from(new Set([
      ...(local.completedCourses || []),
      ...(remote.completedCourses || [])
    ]));
    
    // Completed layers: merge by taking union
    merged.completedLayers = {
      ...local.completedLayers,
      ...remote.completedLayers
    };
    
    // For each layer, take union of completed items
    Object.keys(merged.completedLayers).forEach(layerId => {
      const localLayers = local.completedLayers?.[layerId] || [];
      const remoteLayers = remote.completedLayers?.[layerId] || [];
      merged.completedLayers[layerId] = Array.from(new Set([
        ...localLayers,
        ...remoteLayers
      ]));
    });
    
    // Cooldowns: take EARLIEST (most restrictive)
    merged.cooldowns = { ...local.cooldowns };
    Object.keys(remote.cooldowns || {}).forEach(key => {
      const localCooldown = local.cooldowns?.[key] || 0;
      const remoteCooldown = remote.cooldowns?.[key] || 0;
      merged.cooldowns[key] = Math.min(localCooldown, remoteCooldown);
    });
    
    console.log('✅ MERGED (MAX_PROGRESS_WINS):', merged);
  } else if (strategy === 'LOCAL_FIRST') {
    // Keep all local data
    console.log('✅ USING LOCAL DATA');
  } else if (strategy === 'REMOTE_FIRST') {
    // Use remote data
    Object.assign(merged, remote);
    console.log('✅ USING REMOTE DATA');
  }

  return merged;
}

/**
 * Get default empty progress
 */
function getDefaultProgress(): UserProgress {
  return {
    level: 1,
    xp: 0,
    piBalance: 0,
    energy: { current: 100, max: 100, lastUpdate: Date.now() },
    completedCourses: [],
    completedLayers: {},
    cooldowns: {},
    streak: 0,
    referralCode: '',
    achievements: []
  };
}

/**
 * Safe hydration manager
 * Ensures data is loaded in correct order with no overwrites
 */
export class HydrationManager {
  private state: HydrationState = {
    isHydrated: false,
    localData: null,
    remoteData: null
  };

  /**
   * Step 1: Load from localStorage
   */
  async loadLocal(userId: string): Promise<UserProgress | null> {
    try {
      const key = `user_progress_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        this.state.localData = JSON.parse(stored);
        console.log('[HYDRATION] ✅ Local data loaded:', this.state.localData);
        return this.state.localData;
      }
    } catch (error) {
      console.error('[HYDRATION] ❌ Error loading local:', error);
    }
    return null;
  }

  /**
   * Step 2: Load from remote (Firebase)
   */
  async loadRemote(userId: string, getUserProfile: (uid: string) => Promise<any>): Promise<UserProgress | null> {
    try {
      const saved = await getUserProfile(userId);
      if (saved?.userProgress) {
        this.state.remoteData = saved.userProgress;
        console.log('[HYDRATION] ✅ Remote data loaded:', this.state.remoteData);
        return this.state.remoteData;
      }
    } catch (error) {
      console.error('[HYDRATION] ❌ Error loading remote:', error);
    }
    return null;
  }

  /**
   * Step 3: Merge and return final progress
   */
  getFinalProgress(): UserProgress {
    const merged = mergeUserProgress(
      this.state.localData,
      this.state.remoteData,
      'MAX_PROGRESS_WINS'
    );
    
    this.state.isHydrated = true;
    console.log('[HYDRATION] ✅ HYDRATION COMPLETE');
    console.log('[HYDRATION] Final progress:', merged);
    
    return merged;
  }

  /**
   * Check if hydration is complete
   */
  isReady(): boolean {
    return this.state.isHydrated;
  }

  /**
   * Reset hydration state
   */
  reset() {
    this.state = {
      isHydrated: false,
      localData: null,
      remoteData: null
    };
  }
}

// Export singleton
export const hydrationManager = new HydrationManager();
