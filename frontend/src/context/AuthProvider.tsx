import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { ApiService } from '../services/ApiService';
import type { PiUser, PiUserProgress, PiAuthResult, UserEconomyState } from '../types';

import { AuthContext, AuthContextType } from './AuthContext';

interface PiSDK {
  init: (config: { version: string, sandbox: boolean }) => Promise<void>;
  authenticate: (scopes: string[], onPayment: (p: unknown) => void) => Promise<PiAuthResult>;
}
declare const Pi: PiSDK;

const DEFAULT_ECONOMY: UserEconomyState = {
    balance: 0,
    transferableBalance: 0,
    lifetimeEarnings: 0,
    lifetimeSpent: 0,
    credibilityScore: 0,
    withdrawalTier: 0,
    pendingWithdrawals: 0
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(() => {
    const storedUser = localStorage.getItem('pi_user');
    if (!storedUser) return null;
    try {
      const parsed = JSON.parse(storedUser) as unknown as Record<string, unknown>; // Type safety compromise for migration
      
      // Legacy Repair: Ensure userProgress is complete and XP is cumulative
      if ((parsed.uid as string)?.startsWith('guest_') || parsed.userProgress) {
        const p = (parsed.userProgress || {}) as Partial<PiUserProgress>;
        const rootBalance = parsed.piBalance || 0;
        
        // Ensure userProgress existence and sync with root
        if (!parsed.userProgress || p.energyBalance === undefined || p.cumulatedXP === undefined || !p.economy) {
           console.warn('[AuthContext] Repairing/Migrating guest/legacy user data');
           const level = p.level || 1;
           const oldXP = p.xp || 0;
           const currentPi = p.piBalance !== undefined ? p.piBalance : rootBalance;
           
           // If we have level 4 and xp 0, cumulatedXP should be 1500 (3*500)
           const totalXP = p.cumulatedXP ?? ((level - 1) * 500 + oldXP);
           
           parsed.userProgress = {
             level: level,
             xp: totalXP % 500,
             cumulatedXP: totalXP,
             piBalance: currentPi, // Legacy field kept for safety
             energyBalance: p.energyBalance ?? 100,
             lastEnergyUpdate: p.lastEnergyUpdate || Date.now(),
             referralCode: p.referralCode || 'GUEST',
             completedLayers: p.completedLayers || {},
             // NEW ECONOMY FIELDS
             economy: p.economy || { ...DEFAULT_ECONOMY, balance: currentPi },
             inventory: p.inventory || []
           };
        }
      }
      return parsed as unknown as PiUser;
    } catch (e) {
      console.error('[AuthContext] Failed to parse stored user:', e);
      localStorage.removeItem('pi_user');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Helper to ensure economy state exists before updates
  const ensureEconomy = (progress: Partial<PiUserProgress> | undefined): PiUserProgress => {
      const base = progress || {};
      return {
          ...base,
          economy: base.economy || { ...DEFAULT_ECONOMY, balance: base.piBalance || 0 },
          inventory: base.inventory || []
      } as PiUserProgress;
  };

  const refreshProfile = useCallback(async () => {
    if (!user || user.uid.startsWith('guest_')) return;
    
    try {
      const response = await ApiService.getUserProfile();
      const userData = response.data.user;
      
      setUser(prev => {
        if (!prev) return null;
        
        // backend xp IS total/cumulated xp
        const totalXP = userData.xp || 0;
        const level = Math.floor(totalXP / 500) + 1;
        const progressXP = totalXP % 500;

        const currentEconomy = ensureEconomy(prev.userProgress).economy;

        const updatedProgress: PiUserProgress = {
            ...ensureEconomy(prev.userProgress), 
            level: level,
            xp: progressXP,
            cumulatedXP: totalXP,
            piBalance: userData.piBalance,
            referralCode: userData.referralCode || prev.userProgress?.referralCode,
            energyBalance: userData.energyBalance,
            stakingBalance: userData.stakingBalance,
            completedLayers: userData.completedLayers || {},
            quizAttempts: userData.quizAttempts || {},
            inventory: userData.inventory || [], // Synced from Backend
            economy: {
                ...currentEconomy,
                balance: userData.piBalance,
                transferableBalance: userData.transferableBalance || 0 // Synced from Backend
            }
        };

        const updated: PiUser = {
          ...prev,
          avatar: userData.avatar || prev.avatar,
          userProgress: updatedProgress
        };
        localStorage.setItem('pi_user', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      throw error;
    }
  }, [user]);

  const updateProgressSync = useCallback((xpGain: number, piGain: number, energyCost: number = 0, layerId?: string, courseId?: string) => {
    setUser(prev => {
      if (!prev) return null;
      
      const p = ensureEconomy(prev.userProgress);
      
      const newTotalXP = (p.cumulatedXP || 0) + xpGain;
      
      // Calculate level and remainder XP from total
      // HARDCORE: Level 1: 0-499, Level 2: 500-999, etc.
      const newLevel = Math.floor(newTotalXP / 500) + 1;
      const newLevelXP = newTotalXP % 500;
      
      const updatedLayers = { ...(p.completedLayers || {}) };
      const updatedQuizAttempts = { ...(p.quizAttempts || {}) };
      const updatedLayerProgress = [...(p.layerProgress || [])];
      
      if (layerId && courseId) {
          if (xpGain > 0) {
              // 1. Update completedLayers (Record)
              if (!updatedLayers[courseId]) {
                  updatedLayers[courseId] = [];
              }
              if (!updatedLayers[courseId].includes(layerId)) {
                  updatedLayers[courseId].push(layerId);
              }

              // 2. Update layerProgress (Array)
              const existingIndex = updatedLayerProgress.findIndex(
                  lp => lp.layerId === layerId && lp.courseId === courseId
              );

              if (existingIndex > -1) {
                  updatedLayerProgress[existingIndex] = {
                      ...updatedLayerProgress[existingIndex],
                      mastered: true,
                      unlocked: true,
                      lastAttempt: Date.now(),
                      bestScore: Math.max(updatedLayerProgress[existingIndex].bestScore || 0, 100)
                  };
              } else {
                  updatedLayerProgress.push({
                      courseId,
                      layerId: layerId,
                      unlocked: true,
                      mastered: true,
                      attempts: 1,
                      bestScore: 100,
                      lastAttempt: Date.now()
                  });
              }

              // Reset attempts on success
              delete updatedQuizAttempts[layerId];
          }
      }

      // Update Economy Balance as well
      const newEconomy = { ...p.economy, balance: p.economy.balance + piGain };

      const updatedProgress: PiUserProgress = {
          ...p,
          xp: newLevelXP,
          cumulatedXP: newTotalXP,
          level: newLevel,
          piBalance: newEconomy.balance, // Legacy sync
          economy: newEconomy,
          energyBalance: Math.max(0, (p.energyBalance || 0) - energyCost),
          lastEnergyUpdate: p.lastEnergyUpdate || Date.now(),
          completedLayers: updatedLayers,
          layerProgress: updatedLayerProgress,
          quizAttempts: updatedQuizAttempts
      };

      const updated: PiUser = {
        ...prev,
        userProgress: updatedProgress
      };
      
      localStorage.setItem('pi_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateUserProgress = useCallback((newProgress: PiUserProgress) => {
      setUser(prev => {
          if (!prev) return null;
          const updated: PiUser = {
              ...prev,
              userProgress: newProgress
          };
          localStorage.setItem('pi_user', JSON.stringify(updated));
          return updated;
      });
  }, []);

  /**
   * Mark a course as fully completed (all layers passed).
   * This enables unlocking of subsequent courses that have this course as a prerequisite.
   */
  const markCourseAsCompleted = useCallback((courseId: string) => {
    setUser(prev => {
      if (!prev) return null;
      
      const p = prev.userProgress;
      if (!p) return prev;
      
      const currentCompleted = p.completedCourses || [];
      
      // Don't add duplicates
      if (currentCompleted.includes(courseId)) {
        console.log(`[ProgressTracker] Course ${courseId} already marked as completed.`);
        return prev;
      }
      
      const updatedCompletedCourses = [...currentCompleted, courseId];
      console.log(`[ProgressTracker] 🎓 Course COMPLETED: ${courseId}. Total completed: ${updatedCompletedCourses.length}`);
      
      const updatedProgress: PiUserProgress = {
        ...p,
        completedCourses: updatedCompletedCourses
      };
      
      const updated: PiUser = {
        ...prev,
        userProgress: updatedProgress
      };
      
      localStorage.setItem('pi_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateUserAvatar = useCallback((newAvatarUrl: string) => {
    setUser(prev => {
      if (!prev) return null;
      const updated: PiUser = { ...prev, avatar: newAvatarUrl };
      localStorage.setItem('pi_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ENERGY RECOVERY SYSTEM (Every 1 minute check)
  useEffect(() => {
    const timer = setInterval(() => {
      setUser(prev => {
        if (!prev || !prev.userProgress) return prev;
        
        const now = Date.now();
        const p = prev.userProgress;
        const lastUpdate = p.lastEnergyUpdate || now;
        const currentEnergy = p.energyBalance ?? 100;
        
        if (currentEnergy >= 100) {
            if (p.lastEnergyUpdate !== now) {
                 return { ...prev, userProgress: { ...p, lastEnergyUpdate: now } };
            }
            return prev;
        }

        // Recover 1 energy every 5 minutes (300,000 ms)
        const elapsed = now - lastUpdate;
        const recoveryPoints = Math.floor(elapsed / 300000);

        if (recoveryPoints > 0) {
          const newEnergy = Math.min(100, currentEnergy + recoveryPoints);
          const updated: PiUser = {
            ...prev,
            userProgress: {
              ...p,
              energyBalance: newEnergy,
              lastEnergyUpdate: now - (elapsed % 300000) // Keep the remainder
            }
          };
          localStorage.setItem('pi_user', JSON.stringify(updated));
          return updated;
        }
        
        return prev;
      });
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  // Initial profile refresh on mount if token exists
  // Initial profile refresh on mount if token exists
  useEffect(() => {
    if (user && !user.uid.startsWith('guest_')) {
      refreshProfile().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithPi = async () => {
    setLoading(true);
    try {
      if (typeof Pi === 'undefined') {
        throw new Error('Pi Browser not detected. Please open this app inside the Pi Browser.');
      }

      // 🔥 CAPTURE GUEST PROGRESS BEFORE OVERWRITING
      const existingUser = user;
      const wasGuest = existingUser?.uid?.startsWith('guest_') ?? false;
      const guestProgress = wasGuest && existingUser ? existingUser.userProgress : null;
      const guestAvatar = wasGuest && existingUser ? existingUser.avatar : null;
      
      if (wasGuest && guestProgress) {
        console.log('[Auth] Guest progress detected, will migrate:', {
          level: guestProgress.level,
          xp: guestProgress.cumulatedXP,
          completedLayers: Object.keys(guestProgress.completedLayers || {}).length,
          piBalance: guestProgress.piBalance
        });
      }

      // Avoid double init if index.html already did it
      if (!window.piInitialized) {
          try {
            await Pi.init({ version: "2.0", sandbox: import.meta.env.VITE_PI_SANDBOX === 'true' });
          } catch (err) {
            console.warn("Pi Init skipped or failed:", err);
          }
      }
      
      let auth: PiAuthResult;
      
      // STRATÉGIE D'AUTHENTIFICATION PROGRESSIVE
      // 1. Tenter l'auth complète (Username + Payments)
      try {
          console.log("🔒 Tentative Auth Complète (Username + Payments)...");
          const scopes = ['username', 'payments'];
          
          const authPromise = Pi.authenticate(scopes, (payment: unknown) => {
            console.log('Incomplete payment found:', payment);
          });
          
          // Timeout court pour la première tentative (5s) pour basculer vite si bloqué
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("TIMEOUT_FULL_AUTH")), 5000)
          );

          auth = await Promise.race([authPromise, timeoutPromise]) as PiAuthResult;
      } catch (error) {
          console.warn("⚠️ Auth Complète échouée/trop longue. Bascule sur Auth Simple...", error);
          
          // 2. Fallback: Auth Simple (Username uniquement) - GARANTIT L'ACCÈS
          const scopes = ['username'];
          // Use no-op function instead of undefined to satisfy type checker
          const authPromiseFallback = Pi.authenticate(scopes, (_p: unknown) => { /* no-op in simple auth */ }); 
          
          // Timeout un peu plus long pour le fallback (10s)
          const timeoutPromiseFallback = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Délai d'attente dépassé (Pi Auth). Veuillez vérifier votre connexion.")), 10000)
          );
          
          auth = await Promise.race([authPromiseFallback, timeoutPromiseFallback]) as PiAuthResult;
          toast('Mode "Accès Simple" activé. Réactivez les paiements dans la boutique si nécessaire.', { icon: 'ℹ️' });
      }

      // 🔥 MERGE GUEST PROGRESS OR CREATE NEW
      const piUser: PiUser = {
        uid: auth.user.uid,
        username: auth.user.username,
        accessToken: auth.accessToken,
        avatar: guestAvatar || '👤', // Keep guest avatar if they set one
        kycVerified: true, // v2.5: Assume authenticated Pi users are verified contextually
        userType: 'kyc_verified',
        userProgress: guestProgress ? {
            // MIGRATE ALL GUEST PROGRESS
            level: guestProgress.level || 1,
            xp: guestProgress.xp || 0,
            cumulatedXP: guestProgress.cumulatedXP || 0,
            piBalance: guestProgress.piBalance || 0,
            energyBalance: guestProgress.energyBalance ?? 100,
            lastEnergyUpdate: guestProgress.lastEnergyUpdate || Date.now(),
            completedLayers: guestProgress.completedLayers || {},
            layerProgress: guestProgress.layerProgress || [],
            quizAttempts: guestProgress.quizAttempts || {},
            economy: guestProgress.economy || DEFAULT_ECONOMY,
            inventory: guestProgress.inventory || [],
            stakingBalance: guestProgress.stakingBalance || 0,
            referralCode: undefined // Will be generated by backend
        } : {
            // Default for truly new users (no guest history)
            level: 1,
            xp: 0,
            cumulatedXP: 0,
            piBalance: 0,
            energyBalance: 100,
            lastEnergyUpdate: Date.now(),
            completedLayers: {},
            economy: DEFAULT_ECONOMY,
            inventory: []
        }
      };

      setUser(piUser);
      localStorage.setItem('pi_user', JSON.stringify(piUser));
      
      // Refresh to sync with backend (backend may have existing data for this Pi UID)
      // The backend profile will be MERGED with local if backend has more progress
      await refreshProfile();
      
      // Track referral if code was captured from URL
      const referralCode = localStorage.getItem('pending_referral_code');
      if (referralCode) {
        try {
          await ApiService.trackReferral(referralCode);
          console.log('[Referral] Tracked successfully:', referralCode);
        } catch (e) {
          console.warn('[Referral] Tracking failed:', e);
        } finally {
          localStorage.removeItem('pending_referral_code');
        }
      }
      
      // 🔥 SHOW MIGRATION SUCCESS MESSAGE
      if (wasGuest && guestProgress && (guestProgress.cumulatedXP || 0) > 0) {
        toast.success(`🎉 Bienvenue ${piUser.username} ! Votre progression invité (${guestProgress.cumulatedXP} XP, Niveau ${guestProgress.level}) a été transférée !`, { duration: 6000 });
      } else {
        toast.success(`Welcome, ${piUser.username}!`);
      }
    } catch (error: unknown) {
      console.error('Pi Login Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    const guestUser: PiUser = {
      uid: 'guest_' + Math.random().toString(36).substr(2, 9),
      username: 'Guest_Pioneer',
      accessToken: 'guest_token',
      avatar: '🕵️',
      kycVerified: false,
      userType: 'guest',
      userProgress: {
        level: 1,
        xp: 0,
        cumulatedXP: 0,
        piBalance: 0, // Legacy
        energyBalance: 100,
        lastEnergyUpdate: Date.now(),
        referralCode: 'GUEST',
        completedLayers: {},
        economy: DEFAULT_ECONOMY,
        inventory: []
      }
    };
    setUser(guestUser);
    localStorage.setItem('pi_user', JSON.stringify(guestUser));
    toast.success('Browsing as Guest');
  };

  const logout = () => {
    console.log('[AuthContext] LOGOUT CALLED - Purging all auth data');
    setUser(null);
    localStorage.removeItem('pi_user');
    localStorage.removeItem('pi_auth_token'); // Additional potential key
    localStorage.removeItem('pi_academy_auth');
    window.piInitialized = false; 
    // Force reload to clear any memory states if needed
    window.location.href = '#/login';
    toast('Logged out');
  };

  const contextValue: AuthContextType = { 
    user, 
    isAuthenticated: !!user, 
    loginWithPi, 
    loginAsGuest, 
    logout, 
    loading, 
    refreshProfile, 
    updateProgressSync,
    updateUserProgress, // Added to context
    updateUserAvatar,
    markCourseAsCompleted
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
