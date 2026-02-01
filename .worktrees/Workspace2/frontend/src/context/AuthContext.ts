import { createContext, useContext } from 'react';
import type { PiUser, PiUserProgress } from '../types';

export interface AuthContextType {
  user: PiUser | null;
  isAuthenticated: boolean;
  loginWithPi: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProgressSync: (xpGain: number, piGain: number, energyCost?: number, layerId?: string, courseId?: string) => void;
  updateUserProgress: (newProgress: PiUserProgress) => void;
  updateUserAvatar: (newAvatarUrl: string) => void;
  markCourseAsCompleted: (courseId: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
